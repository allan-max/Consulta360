import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { consultas, catalogoPublico } from './consultas.js';
import { FINALIDADES, PLANOS } from './public/js/catalogo.js';
import { db, transacao } from './db.js';
import { gerarHash, conferirSenha, criarSessao, encerrarSessao, carregarUsuario, exigirLogin } from './auth.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', process.env.TRUST_PROXY === '1');
app.use(express.json({ limit: '10kb' }));
app.use(carregarUsuario);
app.use(express.static('public', { extensions: ['html'] }));

const limiteAuth = rateLimit({ windowMs: 15 * 60_000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { erro: 'Muitas tentativas. Aguarde alguns minutos.' } });
const limiteConsulta = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { erro: 'Muitas consultas em pouco tempo. Aguarde um minuto.' } });

const erro = (res, status, msg) => res.status(status).json({ erro: msg });
const texto = (v, max) => String(v ?? '').trim().slice(0, max);
const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* ---------- Catalogo ---------- */

app.get('/api/consultas', (_req, res) => {
  res.json({ consultas: catalogoPublico(), finalidades: FINALIDADES, planos: PLANOS });
});

/* ---------- Conta ---------- */

app.post('/api/cadastro', limiteAuth, async (req, res) => {
  const nome = texto(req.body.nome, 80);
  const email = texto(req.body.email, 120).toLowerCase();
  const senha = String(req.body.senha ?? '');
  if (nome.length < 2) return erro(res, 400, 'Informe seu nome.');
  if (!emailValido(email)) return erro(res, 400, 'E-mail invalido.');
  if (senha.length < 8) return erro(res, 400, 'A senha precisa ter pelo menos 8 caracteres.');
  if (req.body.aceite !== true) return erro(res, 400, 'Aceite os termos de uso e a politica de privacidade.');
  if (db.prepare('SELECT 1 FROM usuarios WHERE email = ?').get(email)) return erro(res, 409, 'E-mail ja cadastrado.');

  const bonus = Number(process.env.BONUS_CADASTRO) || 0;
  const { lastInsertRowid } = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, creditos) VALUES (?, ?, ?, ?)')
    .run(nome, email, await gerarHash(senha), bonus);
  criarSessao(res, Number(lastInsertRowid));
  res.status(201).json({ ok: true });
});

app.post('/api/entrar', limiteAuth, async (req, res) => {
  const email = texto(req.body.email, 120).toLowerCase();
  const u = db.prepare('SELECT id, senha_hash FROM usuarios WHERE email = ?').get(email);
  const ok = u && await conferirSenha(String(req.body.senha ?? ''), u.senha_hash);
  if (!ok) return erro(res, 401, 'E-mail ou senha incorretos.');
  criarSessao(res, u.id);
  res.json({ ok: true });
});

app.post('/api/sair', (req, res) => {
  encerrarSessao(req, res);
  res.json({ ok: true });
});

app.get('/api/eu', (req, res) => res.json({ usuario: req.usuario }));

app.put('/api/eu', exigirLogin, async (req, res) => {
  const nome = texto(req.body.nome, 80);
  if (nome.length < 2) return erro(res, 400, 'Informe seu nome.');

  if (req.body.nova_senha) {
    const atual = db.prepare('SELECT senha_hash FROM usuarios WHERE id = ?').get(req.usuario.id);
    if (!await conferirSenha(String(req.body.senha_atual ?? ''), atual.senha_hash)) return erro(res, 400, 'Senha atual incorreta.');
    if (String(req.body.nova_senha).length < 8) return erro(res, 400, 'A nova senha precisa ter pelo menos 8 caracteres.');
    db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?').run(await gerarHash(String(req.body.nova_senha)), req.usuario.id);
  }
  db.prepare('UPDATE usuarios SET nome = ? WHERE id = ?').run(nome, req.usuario.id);
  res.json({ ok: true });
});

/* ---------- Painel ---------- */

app.get('/api/painel', exigirLogin, (req, res) => {
  const id = req.usuario.id;
  const resumo = db.prepare(`
    SELECT COUNT(*) AS total,
           COALESCE(SUM(sucesso), 0) AS sucesso,
           COALESCE(SUM(custo), 0) AS gastos,
           COALESCE(SUM(criado_em >= datetime('now', '-30 days')), 0) AS mes
    FROM historico WHERE usuario_id = ?`).get(id);
  const porTipo = db.prepare(`
    SELECT consulta, COUNT(*) AS n FROM historico
    WHERE usuario_id = ? GROUP BY consulta ORDER BY n DESC LIMIT 5`).all(id);
  res.json({ usuario: req.usuario, resumo, porTipo });
});

app.get('/api/historico', exigirLogin, (req, res) => {
  const limite = Math.min(Number(req.query.limite) || 50, 200);
  const itens = db.prepare(`
    SELECT id, consulta, alvo, finalidade, custo, sucesso, criado_em
    FROM historico WHERE usuario_id = ? ORDER BY id DESC LIMIT ?`).all(req.usuario.id, limite);
  res.json({ itens });
});

app.get('/api/pedidos', exigirLogin, (req, res) => {
  const itens = db.prepare(`
    SELECT id, plano, creditos, valor_centavos, status, criado_em
    FROM pedidos WHERE usuario_id = ? ORDER BY id DESC LIMIT 50`).all(req.usuario.id);
  res.json({ itens });
});

// Cria pedido pendente. Integre aqui um gateway (Mercado Pago, Asaas, Stripe) e
// libere os creditos no webhook de pagamento confirmado.
// Enquanto isso, aprove manualmente: npm run creditos -- aprovar <id>
app.post('/api/pedidos', exigirLogin, (req, res) => {
  const plano = PLANOS.find((p) => p.id === req.body.plano);
  if (!plano) return erro(res, 400, 'Plano invalido.');
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO pedidos (usuario_id, plano, creditos, valor_centavos) VALUES (?, ?, ?, ?)')
    .run(req.usuario.id, plano.id, plano.creditos, plano.valor_centavos);
  res.status(201).json({ pedido: Number(lastInsertRowid), status: 'pendente' });
});

/* ---------- Contato ---------- */

app.post('/api/contato', limiteAuth, (req, res) => {
  const nome = texto(req.body.nome, 80);
  const email = texto(req.body.email, 120);
  const assunto = texto(req.body.assunto, 80);
  const msg = texto(req.body.texto, 3000);
  if (!nome || !emailValido(email) || !assunto || msg.length < 10) {
    return erro(res, 400, 'Preencha todos os campos (mensagem com pelo menos 10 caracteres).');
  }
  db.prepare('INSERT INTO mensagens (nome, email, assunto, texto) VALUES (?, ?, ?, ?)').run(nome, email, assunto, msg);
  res.status(201).json({ ok: true });
});

/* ---------- Executar consulta ---------- */

const mascarar = (v) => {
  const s = String(v ?? '');
  return s.length <= 5 ? s : s.replace(/^(.{3}).*(.{2})$/, '$1***$2');
};

app.post('/api/consultas/:id', limiteConsulta, async (req, res) => {
  const consulta = consultas.find((c) => c.id === req.params.id);
  if (!consulta) return erro(res, 404, 'Consulta nao encontrada.');

  const entrada = req.body ?? {};
  const usuario = req.usuario;
  const custo = consulta.custo || 0;

  if (custo > 0 && !usuario) return erro(res, 401, 'Entre na sua conta para fazer esta consulta.');
  if (consulta.lgpd && !FINALIDADES.includes(entrada.finalidade)) {
    return erro(res, 400, 'Informe a finalidade da consulta (LGPD, art. 7).');
  }

  // Reserva os creditos antes de chamar o fornecedor; devolve se falhar.
  if (custo > 0) {
    const r = db.prepare('UPDATE usuarios SET creditos = creditos - ? WHERE id = ? AND creditos >= ?')
      .run(custo, usuario.id, custo);
    if (r.changes === 0) return erro(res, 402, `Saldo insuficiente. Esta consulta custa ${custo} creditos.`);
  }

  const alvo = consulta.campos
    .map((c) => (consulta.lgpd ? mascarar(entrada[c.nome]) : texto(entrada[c.nome], 40)))
    .filter(Boolean).join(' ');

  const registrar = (sucesso, cobrado) => db.prepare(`
    INSERT INTO historico (usuario_id, consulta, alvo, finalidade, custo, sucesso, ip)
    VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(usuario?.id ?? null, consulta.id, alvo, consulta.lgpd ? entrada.finalidade : null, cobrado, sucesso ? 1 : 0, req.ip);

  try {
    const dados = await consulta.executar(entrada);
    registrar(true, custo);
    const saldo = usuario ? db.prepare('SELECT creditos FROM usuarios WHERE id = ?').get(usuario.id).creditos : null;
    res.json({ consulta: consulta.id, dados, saldo });
  } catch (err) {
    transacao(() => {
      if (custo > 0) db.prepare('UPDATE usuarios SET creditos = creditos + ? WHERE id = ?').run(custo, usuario.id);
      registrar(false, 0);
    });
    res.status(err.status || 500).json({ erro: err.message || 'Erro na consulta.' });
  }
});

/* ---------- 404 ---------- */

app.use('/api', (_req, res) => erro(res, 404, 'Rota nao encontrada.'));
app.use((_req, res) => res.status(404).sendFile('404.html', { root: 'public' }));

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Consulta360 em http://localhost:${PORT}`));

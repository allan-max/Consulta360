// Administracao de creditos (rode na pasta do projeto):
//   npm run creditos -- pedidos              -> lista pedidos pendentes
//   npm run creditos -- aprovar <id_pedido>  -> marca pago e libera creditos
//   npm run creditos -- somar <email> <qtd>  -> ajuste manual de saldo
import { db, transacao } from '../db.js';

const [cmd, a, b] = process.argv.slice(2);

if (cmd === 'pedidos') {
  console.table(db.prepare(`
    SELECT p.id, u.email, p.plano, p.creditos, p.valor_centavos / 100.0 AS valor, p.criado_em
    FROM pedidos p JOIN usuarios u ON u.id = p.usuario_id
    WHERE p.status = 'pendente' ORDER BY p.id`).all());
} else if (cmd === 'aprovar') {
  transacao(() => {
    const p = db.prepare("SELECT * FROM pedidos WHERE id = ? AND status = 'pendente'").get(Number(a));
    if (!p) throw new Error('Pedido pendente nao encontrado.');
    db.prepare("UPDATE pedidos SET status = 'pago' WHERE id = ?").run(p.id);
    db.prepare('UPDATE usuarios SET creditos = creditos + ? WHERE id = ?').run(p.creditos, p.usuario_id);
    console.log(`Pedido ${p.id} aprovado: +${p.creditos} creditos.`);
  });
} else if (cmd === 'somar') {
  const r = db.prepare('UPDATE usuarios SET creditos = creditos + ? WHERE email = ?')
    .run(Number(b), String(a).toLowerCase());
  console.log(r.changes ? `Saldo ajustado em ${b}.` : 'Usuario nao encontrado.');
} else {
  console.log('Comandos: pedidos | aprovar <id> | somar <email> <qtd>');
}

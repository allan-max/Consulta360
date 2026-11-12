// Layout compartilhado: header, rodape, sessao do usuario e utilitarios.
export const MARCA = 'Consulta360';

/* ---------- Icones (SVG inline) ---------- */
const P = {
  busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  empresa: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4"/>',
  pessoa: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  veiculo: '<path d="M5 17h14M3 13l2-6h14l2 6v4H3z"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>',
  endereco: '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  financeiro: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>',
  fiscal: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  outros: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  raio: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  cadeado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  moeda: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>',
  historico: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  grafico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  config: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  sair: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  copiar: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  imprimir: '<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="7"/>',
  baixar: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  carrinho: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11l2-8H6.3"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  api: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
};
export const icone = (nome, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[nome] || P.outros}</svg>`;

export const CATEGORIAS = {
  Empresas: { icone: 'empresa', texto: 'CNPJ, socios, dominios e corretoras' },
  Pessoas: { icone: 'pessoa', texto: 'Situacao cadastral de CPF' },
  Veiculos: { icone: 'veiculo', texto: 'Placa, restricoes e tabela FIPE' },
  Enderecos: { icone: 'endereco', texto: 'CEP, DDD e municipios IBGE' },
  Financeiro: { icone: 'financeiro', texto: 'Bancos, taxas e cambio' },
  Fiscal: { icone: 'fiscal', texto: 'Classificacao NCM' },
  Outros: { icone: 'outros', texto: 'Feriados, ISBN e mais' },
};
export const iconeCategoria = (cat) => CATEGORIAS[cat]?.icone || 'outros';

// Ilustracao de cada categoria (public/img/ilustracoes, gerada por scripts/gerar-ilustracoes.js).
const ARQ_ILUSTRACAO = {
  Empresas: 'empresas', Pessoas: 'pessoas', Veiculos: 'veiculos', Enderecos: 'enderecos',
  Financeiro: 'financeiro', Fiscal: 'fiscal', Outros: 'outros',
};
export const imagemCategoria = (cat) => `img/ilustracoes/${ARQ_ILUSTRACAO[cat] || 'outros'}.svg`;

/* ---------- Utilitarios ---------- */
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];

export function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// Modo estatico: site publicado sem o servidor Node (GitHub Pages). As consultas
// gratuitas chamam a BrasilAPI direto do navegador; contas e creditos ficam desligados.
// Para testar localmente: abra qualquer pagina com ?estatico=1 (e ?estatico=0 para sair).
function detectarEstatico() {
  try {
    const p = new URLSearchParams(location.search).get('estatico');
    if (p !== null) sessionStorage.setItem('estatico', p);
    const salvo = sessionStorage.getItem('estatico');
    if (salvo !== null) return salvo === '1';
  } catch { /* storage bloqueado: segue pelo dominio */ }
  return location.hostname.endsWith('github.io');
}
export const MODO_ESTATICO = detectarEstatico();

export async function api(caminho, opcoes = {}) {
  if (MODO_ESTATICO) {
    const { apiEstatica } = await import('./estatico.js');
    return apiEstatica(caminho, opcoes);
  }
  const { metodo = 'GET', corpo } = opcoes;
  const r = await fetch(`api${caminho}`, {
    method: metodo,
    headers: corpo ? { 'Content-Type': 'application/json' } : {},
    body: corpo ? JSON.stringify(corpo) : undefined,
    credentials: 'same-origin',
  });
  const dados = await r.json().catch(() => ({ erro: 'Resposta invalida do servidor.' }));
  if (!r.ok) {
    const e = new Error(dados.erro || `Erro ${r.status}`);
    e.status = r.status;
    throw e;
  }
  return dados;
}

export const reais = (centavos) => (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const dataHora = (iso) => new Date(iso.replace(' ', 'T') + 'Z').toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

export const mascaras = {
  cpf: (v) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
  cnpj: (v) => v.replace(/\D/g, '').slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2'),
  cep: (v) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'),
  placa: (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7),
};

export function seloConsulta(c) {
  if (!c.disponivel) return '<span class="selo selo-off">Em breve</span>';
  if (!c.custo) return '<span class="selo selo-gratis">Gratuita</span>';
  return `<span class="selo selo-cred">${c.custo} creditos</span>`;
}

export function cardConsulta(c) {
  return `
    <a class="card card-link card-com-img" href="consulta?id=${encodeURIComponent(c.id)}">
      <div class="card-img">
        <img src="${imagemCategoria(c.categoria)}" alt="" loading="lazy" width="480" height="300">
        <span class="card-img-selo">${seloConsulta(c)}</span>
      </div>
      <div class="card-corpo">
        <div class="card-titulo"><span class="icone-mini">${icone(iconeCategoria(c.categoria))}</span><h3>${esc(c.titulo)}</h3></div>
        <p>${esc(c.descricao)}</p>
        <div class="card-rodape"><span>${esc(c.categoria)}</span><span class="ir">Consultar ${icone('seta')}</span></div>
      </div>
    </a>`;
}

/* ---------- Sessao ---------- */
let usuarioCache;
export async function usuarioAtual() {
  if (usuarioCache !== undefined) return usuarioCache;
  try { usuarioCache = (await api('/eu')).usuario; } catch { usuarioCache = null; }
  return usuarioCache;
}
export function atualizarSaldo(saldo) {
  const el = $('#saldo-topo');
  if (el && saldo != null) el.innerHTML = `${icone('moeda')} ${saldo} creditos`;
}

export async function sair() {
  await api('/sair', { metodo: 'POST' }).catch(() => {});
  location.href = './';
}

/* ---------- Header e rodape ---------- */
// Todos os links sao relativos: o site funciona na raiz (servidor Node) e em
// subpasta (GitHub Pages: usuario.github.io/Consulta360/).

// Logo: icone em imagem + nome em texto (fica legivel no tema claro e no escuro).
const marcaHtml = () => '<img class="marca-icone" src="img/logo-icone.png" alt="" width="38" height="38"><span class="marca-nome">Consulta<b>360</b></span>';

const LINKS = [
  ['', 'Inicio'],
  ['consultas', 'Consultas'],
  ['planos', 'Planos'],
  ['como-funciona', 'Como funciona'],
  ['faq', 'Ajuda'],
  ['contato', 'Contato'],
];

// Nome da pagina atual sem extensao ('' = inicio).
export function paginaAtual() {
  const p = location.pathname.split('/').pop().replace(/\.html$/, '');
  return p === 'index' ? '' : p;
}

// No modo estatico, as paginas de conta mostram um aviso no lugar do formulario.
async function avisoContaEstatico() {
  const { AVISO_ESTATICO } = await import('./estatico.js');
  const main = document.querySelector('main');
  main.className = 'container';
  main.innerHTML = `
    <div class="card" style="max-width:640px;margin:72px auto;text-align:center;padding:40px 28px">
      <img src="img/ilustracoes/painel.svg" alt="" class="vazio-img" width="480" height="300">
      <h1 style="font-size:28px">Area do cliente em breve</h1>
      <p class="muted">${esc(AVISO_ESTATICO)}</p>
      <a class="btn btn-laranja" href="consultas">Fazer uma consulta gratuita</a>
    </div>`;
}

async function montarLayout() {
  const atual = paginaAtual();
  if (MODO_ESTATICO && ['entrar', 'cadastro', 'painel'].includes(atual)) {
    await avisoContaEstatico();
  }

  const header = document.createElement('header');
  header.className = 'topo';
  header.innerHTML = `
    <div class="container">
      <a class="marca" href="./">${marcaHtml()}</a>
      <nav class="menu" id="menu" aria-label="Principal">
        ${LINKS.map(([pag, txt]) => `<a href="${pag || './'}"${pag === atual ? ' aria-current="page"' : ''}>${txt}</a>`).join('')}
      </nav>
      <div class="topo-acoes" id="topo-acoes"></div>
      <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menu" aria-expanded="false">${icone('menu')}</button>
    </div>`;
  document.body.prepend(header);

  $('#menu-toggle').addEventListener('click', (e) => {
    const aberto = $('#menu').classList.toggle('aberto');
    e.currentTarget.setAttribute('aria-expanded', String(aberto));
  });

  const footer = document.createElement('footer');
  footer.className = 'rodape';
  footer.innerHTML = `
    <div class="container">
      <div class="rodape-grade">
        <div>
          <a class="marca" href="./">${marcaHtml()}</a>
          <p class="muted" style="margin-top:14px;font-size:14px">Consultas de CNPJ, CPF, veiculos, enderecos e dados financeiros a partir de fontes oficiais e fornecedores licenciados.</p>
        </div>
        <div><h4>Produto</h4><ul>
          <li><a href="consultas">Todas as consultas</a></li>
          <li><a href="planos">Planos e precos</a></li>
          <li><a href="como-funciona">Como funciona</a></li>
          <li><a href="painel">Minha conta</a></li>
        </ul></div>
        <div><h4>Suporte</h4><ul>
          <li><a href="faq">Perguntas frequentes</a></li>
          <li><a href="contato">Fale conosco</a></li>
          <li><a href="sobre">Sobre nos</a></li>
        </ul></div>
        <div><h4>Legal</h4><ul>
          <li><a href="termos">Termos de uso</a></li>
          <li><a href="privacidade">Politica de privacidade</a></li>
          <li><a href="privacidade#titular">Direitos do titular (LGPD)</a></li>
        </ul></div>
      </div>
      <div class="rodape-base">
        <span>&copy; ${new Date().getFullYear()} ${esc(MARCA)}. Todos os direitos reservados.</span>
        <span>Dados tratados conforme a Lei 13.709/2018 (LGPD).</span>
      </div>
    </div>`;
  document.body.append(footer);

  if (MODO_ESTATICO) {
    $('#topo-acoes').innerHTML = `<a class="btn btn-laranja btn-peq" href="consultas">${icone('busca')} Consultar</a>`;
    return;
  }
  const u = await usuarioAtual();
  $('#topo-acoes').innerHTML = u
    ? `<span class="saldo-chip" id="saldo-topo">${icone('moeda')} ${u.creditos} creditos</span>
       <a class="btn btn-primaria btn-peq" href="painel">${icone('usuario')} Minha conta</a>`
    : `<a class="btn btn-secundaria btn-peq" href="entrar">Entrar</a>
       <a class="btn btn-primaria btn-peq" href="cadastro">Criar conta</a>`;
}

montarLayout();

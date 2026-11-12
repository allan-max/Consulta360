// Gera as ilustracoes SVG do site nas cores da marca Consulta360.
// Uso: node scripts/gerar-ilustracoes.js  (grava em public/img/ilustracoes)
import { mkdirSync, writeFileSync } from 'node:fs';

const C = {
  navy: '#0b2559', azul: '#1660d6', ceu: '#4da3ff', claro: '#e7f0ff', branco: '#ffffff',
  laranja: '#ff6b1a', laranjaClaro: '#ffb27a', cinza: '#c9d6ec', verde: '#22b07d',
};

// Fundo comum: cartao com degrade suave, circulos decorativos e "chao".
function cena(id, conteudo, w = 480, h = 300) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eef4ff"/><stop offset="1" stop-color="#dbe8ff"/>
    </linearGradient>
    <linearGradient id="az-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.ceu}"/><stop offset="1" stop-color="${C.azul}"/>
    </linearGradient>
    <linearGradient id="lj-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.laranjaClaro}"/><stop offset="1" stop-color="${C.laranja}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
  <circle cx="${w * 0.88}" cy="${h * 0.12}" r="70" fill="${C.ceu}" opacity=".18"/>
  <circle cx="${w * 0.08}" cy="${h * 0.9}" r="90" fill="${C.laranja}" opacity=".10"/>
  <ellipse cx="${w / 2}" cy="${h - 34}" rx="${w * 0.36}" ry="14" fill="${C.navy}" opacity=".08"/>
  ${conteudo(id)}
</svg>`;
}

// Lupa da marca, reutilizada em varias cenas.
const lupa = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <line x1="34" y1="34" x2="62" y2="62" stroke="${C.navy}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="44" fill="${C.branco}" stroke="${C.navy}" stroke-width="10"/>
    <rect x="-22" y="-16" width="44" height="7" rx="3.5" fill="${C.cinza}"/>
    <rect x="-22" y="-2" width="44" height="7" rx="3.5" fill="${C.cinza}"/>
    <rect x="-22" y="12" width="30" height="7" rx="3.5" fill="${C.cinza}"/>
  </g>`;

const seta = (id, x, y) => `<path d="M${x} ${y} q 60 -46 130 -20" fill="none" stroke="url(#lj-${id})" stroke-width="9" stroke-linecap="round"/>
  <path d="M${x + 124} ${y - 36} l 22 16 -26 8 z" fill="${C.laranja}"/>`;

const linhas = (x, y, larguras, cor = C.cinza, gap = 16) =>
  larguras.map((l, i) => `<rect x="${x}" y="${y + i * gap}" width="${l}" height="8" rx="4" fill="${cor}"/>`).join('');

const ILUSTRACOES = {
  empresas: (id) => `
    <rect x="120" y="70" width="120" height="190" rx="10" fill="url(#az-${id})"/>
    <rect x="240" y="120" width="110" height="140" rx="10" fill="${C.navy}"/>
    ${[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => `<rect x="${136 + c * 34}" y="${88 + r * 30}" width="22" height="18" rx="3" fill="${C.branco}" opacity="${(r + c) % 3 ? .9 : .45}"/>`).join('')).join('')}
    ${[0, 1, 2].map((r) => [0, 1].map((c) => `<rect x="${258 + c * 40}" y="${140 + r * 32}" width="26" height="18" rx="3" fill="${C.ceu}" opacity=".85"/>`).join('')).join('')}
    <rect x="166" y="226" width="28" height="34" rx="3" fill="${C.navy}"/>
    <rect x="300" y="44" width="120" height="74" rx="10" fill="${C.branco}" stroke="${C.cinza}"/>
    <text x="314" y="68" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="${C.navy}">CNPJ</text>
    ${linhas(314, 80, [90, 64], C.cinza, 14)}
    <circle cx="404" cy="62" r="9" fill="${C.verde}"/><path d="m399 62 4 4 6-7" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,

  pessoas: (id) => `
    <rect x="110" y="60" width="260" height="170" rx="16" fill="${C.branco}" stroke="${C.cinza}" stroke-width="2"/>
    <rect x="110" y="60" width="260" height="40" rx="16" fill="url(#az-${id})"/>
    <rect x="110" y="84" width="260" height="16" fill="url(#az-${id})"/>
    <text x="130" y="86" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#fff">CPF</text>
    <circle cx="170" cy="150" r="32" fill="${C.claro}"/>
    <circle cx="170" cy="140" r="13" fill="${C.azul}"/>
    <path d="M146 172 q24 -26 48 0" fill="${C.azul}"/>
    ${linhas(220, 128, [120, 90, 104], C.cinza, 20)}
    <rect x="220" y="190" width="70" height="20" rx="10" fill="${C.verde}" opacity=".18"/>
    <text x="232" y="204" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="${C.verde}">REGULAR</text>
    <g transform="translate(360 210)">
      <path d="M0 -34 L28 -22 V2 C28 22 14 34 0 40 C-14 34 -28 22 -28 2 V-22 Z" fill="url(#lj-${id})"/>
      <path d="m-11 2 8 8 15 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,

  veiculos: (id) => `
    <path d="M60 240 H420" stroke="${C.cinza}" stroke-width="4" stroke-dasharray="18 14"/>
    <path d="M110 200 l26 -52 q8 -14 24 -14 h120 q16 0 26 12 l40 54 h24 q16 0 16 16 v18 H96 v-18 q0 -16 14 -16 z" fill="url(#az-${id})"/>
    <path d="M150 192 l20 -42 h52 v42 z M234 192 v-42 h48 l30 42 z" fill="${C.branco}" opacity=".85"/>
    <circle cx="160" cy="236" r="26" fill="${C.navy}"/><circle cx="160" cy="236" r="10" fill="${C.cinza}"/>
    <circle cx="320" cy="236" r="26" fill="${C.navy}"/><circle cx="320" cy="236" r="10" fill="${C.cinza}"/>
    <rect x="196" y="210" width="88" height="24" rx="4" fill="#fff" stroke="${C.navy}" stroke-width="2"/>
    <rect x="196" y="210" width="88" height="7" rx="2" fill="${C.azul}"/>
    <text x="240" y="231" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="${C.navy}">ABC1D23</text>
    ${lupa(372, 92, .8)}`,

  enderecos: (id) => `
    <path d="M70 90 l110 -30 120 30 110 -30 v160 l-110 30 -120 -30 -110 30 z" fill="${C.branco}" stroke="${C.cinza}" stroke-width="2"/>
    <path d="M180 60 v160 M300 90 v160" stroke="${C.cinza}" stroke-width="2"/>
    <path d="M90 180 q60 -50 120 -10 t140 -40 q30 -10 50 10" fill="none" stroke="${C.ceu}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 12"/>
    <g transform="translate(240 138)">
      <path d="M0 50 C-30 14 -36 0 -36 -14 a36 36 0 1 1 72 0 C36 0 30 14 0 50 z" fill="url(#lj-${id})"/>
      <circle cx="0" cy="-14" r="13" fill="#fff"/>
    </g>
    <rect x="300" y="40" width="130" height="44" rx="10" fill="${C.navy}"/>
    <text x="316" y="68" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#fff">01310-100</text>`,

  financeiro: (id) => `
    <rect x="80" y="70" width="230" height="170" rx="14" fill="${C.branco}" stroke="${C.cinza}" stroke-width="2"/>
    ${[50, 80, 66, 110, 92, 130].map((v, i) => `<rect x="${104 + i * 32}" y="${220 - v}" width="20" height="${v}" rx="4" fill="${i === 5 ? `url(#lj-${id})` : `url(#az-${id})`}"/>`).join('')}
    <path d="M104 150 L136 128 L168 140 L200 104 L232 116 L264 82" fill="none" stroke="${C.navy}" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(360 150)">
      <circle r="58" fill="url(#lj-${id})"/>
      <circle r="44" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>
      <text y="14" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="800" fill="#fff">R$</text>
    </g>
    <rect x="300" y="226" width="120" height="30" rx="8" fill="${C.navy}"/>
    <text x="360" y="246" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#fff">SELIC  CDI  USD</text>`,

  fiscal: (id) => `
    <rect x="150" y="50" width="180" height="220" rx="12" fill="${C.branco}" stroke="${C.cinza}" stroke-width="2"/>
    <rect x="150" y="50" width="180" height="46" rx="12" fill="url(#az-${id})"/>
    <rect x="150" y="80" width="180" height="16" fill="url(#az-${id})"/>
    <text x="170" y="80" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#fff">NCM</text>
    <text x="170" y="128" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="${C.navy}">8471.30.12</text>
    ${linhas(170, 146, [140, 120, 132, 90], C.cinza, 18)}
    <rect x="170" y="226" width="60" height="22" rx="11" fill="${C.laranja}" opacity=".18"/>
    <text x="200" y="241" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="${C.laranja}">FISCAL</text>
    <rect x="96" y="120" width="44" height="56" rx="6" fill="${C.claro}" stroke="${C.cinza}"/>
    <rect x="340" y="104" width="44" height="56" rx="6" fill="${C.claro}" stroke="${C.cinza}"/>
    ${lupa(370, 200, .7)}`,

  outros: (id) => `
    <rect x="96" y="60" width="200" height="190" rx="14" fill="${C.branco}" stroke="${C.cinza}" stroke-width="2"/>
    <rect x="96" y="60" width="200" height="44" rx="14" fill="url(#lj-${id})"/>
    <rect x="96" y="88" width="200" height="16" fill="url(#lj-${id})"/>
    <circle cx="140" cy="60" r="7" fill="${C.navy}"/><circle cx="252" cy="60" r="7" fill="${C.navy}"/>
    ${[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${112 + c * 36}" y="${118 + r * 32}" width="24" height="20" rx="4" fill="${r === 1 && c === 3 ? C.azul : C.claro}"/>`).join('')).join('')}
    <g transform="translate(340 110)">
      <rect x="0" y="0" width="86" height="116" rx="6" fill="url(#az-${id})"/>
      <rect x="10" y="12" width="66" height="8" rx="4" fill="#fff" opacity=".8"/>
      <rect x="10" y="28" width="46" height="8" rx="4" fill="#fff" opacity=".6"/>
      <rect x="0" y="94" width="86" height="22" fill="${C.navy}" opacity=".35"/>
    </g>`,

  // Mockup de painel para a home
  painel: (id) => `
    <rect x="50" y="34" width="380" height="236" rx="14" fill="${C.branco}" stroke="${C.cinza}" stroke-width="2"/>
    <rect x="50" y="34" width="380" height="34" rx="14" fill="${C.navy}"/>
    <rect x="50" y="54" width="380" height="14" fill="${C.navy}"/>
    <circle cx="72" cy="51" r="5" fill="${C.laranja}"/><circle cx="88" cy="51" r="5" fill="${C.ceu}"/><circle cx="104" cy="51" r="5" fill="#fff" opacity=".6"/>
    ${[0, 1, 2].map((i) => `<rect x="${68 + i * 118}" y="84" width="104" height="56" rx="8" fill="${i === 0 ? `url(#az-${id})` : C.claro}"/>
      <rect x="${80 + i * 118}" y="96" width="44" height="7" rx="3.5" fill="${i === 0 ? '#fff' : C.cinza}"/>
      <text x="${80 + i * 118}" y="128" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="${i === 0 ? '#fff' : C.navy}">${['30', '128', '12'][i]}</text>`).join('')}
    ${[0, 1, 2, 3].map((r) => `<rect x="68" y="${156 + r * 26}" width="340" height="18" rx="5" fill="${r % 2 ? '#f4f7fd' : C.claro}"/>
      <rect x="78" y="${161 + r * 26}" width="${[120, 90, 140, 100][r]}" height="8" rx="4" fill="${C.cinza}"/>
      <rect x="350" y="${159 + r * 26}" width="46" height="12" rx="6" fill="${r === 2 ? C.laranja : C.verde}" opacity=".35"/>`).join('')}
    ${lupa(420, 236, .62)}
    ${seta(id, 300, 30)}`,
};

const destino = 'public/img/ilustracoes';
mkdirSync(destino, { recursive: true });
for (const [nome, fn] of Object.entries(ILUSTRACOES)) {
  writeFileSync(`${destino}/${nome}.svg`, cena(nome, fn));
}
console.log(`${Object.keys(ILUSTRACOES).length} ilustracoes em ${destino}`);

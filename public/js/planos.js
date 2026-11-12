import { icone, esc, reais } from './layout.js';

export function cardPlano(p) {
  const unit = reais(Math.round(p.valor_centavos / p.creditos));
  return `
    <div class="card plano${p.destaque ? ' destaque' : ''}">
      ${p.destaque ? '<span class="plano-tag">Mais escolhido</span>' : ''}
      <h3>${esc(p.nome)}</h3>
      <div class="plano-preco">${reais(p.valor_centavos)}</div>
      <span class="plano-unit">${p.creditos} creditos &middot; ${unit} por credito</span>
      <ul>${p.itens.map((i) => `<li>${icone('check')} ${esc(i)}</li>`).join('')}</ul>
      <a class="btn ${p.destaque ? 'btn-primaria' : 'btn-secundaria'} btn-bloco" href="painel?aba=creditos&plano=${p.id}">Comprar creditos</a>
    </div>`;
}

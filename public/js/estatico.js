// Implementacao da API para o modo estatico (GitHub Pages, sem servidor).
// Consultas gratuitas vao direto para a BrasilAPI pelo navegador.
import { consultas, FINALIDADES, PLANOS, BRASIL_API } from './catalogo.js';

export const AVISO_ESTATICO = 'Contas, creditos e consultas licenciadas estarao disponiveis em breve. As consultas gratuitas ja funcionam.';

function erro(msg, status = 400) {
  const e = new Error(msg);
  e.status = status;
  return e;
}

async function consultar(id, entrada) {
  const c = consultas.find((x) => x.id === id);
  if (!c) throw erro('Consulta nao encontrada.', 404);
  if (!c.caminho) throw erro(AVISO_ESTATICO, 503);

  const caminho = c.caminho(entrada ?? {}); // valida e lanca erro com mensagem amigavel
  const fontes = [`${BRASIL_API}${caminho}`];
  if (c.alternativa) fontes.push(c.alternativa(entrada ?? {}));

  // Tenta cada fonte. Falha de rede/CORS ou erro 5xx/429 passa para a proxima;
  // 4xx (ex.: documento nao encontrado) e resposta definitiva.
  let ultimoErro = erro('Nao foi possivel conectar a fonte de dados. Tente novamente.', 502);
  for (const url of fontes) {
    let r;
    try {
      r = await fetch(url, { signal: AbortSignal.timeout(15000) });
    } catch {
      continue;
    }
    const corpo = await r.json().catch(() => ({}));
    if (r.ok) return { consulta: id, dados: corpo, saldo: null };
    ultimoErro = erro(corpo.message || corpo.errors?.[0]?.message || `Erro ${r.status} na fonte de dados`, r.status === 404 ? 404 : 502);
    if (r.status < 500 && r.status !== 429) break;
  }
  throw ultimoErro;
}

export async function apiEstatica(caminho, { metodo = 'GET', corpo } = {}) {
  if (caminho === '/consultas' && metodo === 'GET') {
    return {
      consultas: consultas.map(({ caminho: _c, ...c }) => ({ ...c, disponivel: Boolean(_c) })),
      finalidades: FINALIDADES,
      planos: PLANOS,
    };
  }
  if (caminho === '/eu') return { usuario: null };

  const m = caminho.match(/^\/consultas\/([\w-]+)$/);
  if (m && metodo === 'POST') return consultar(m[1], corpo);

  throw erro(AVISO_ESTATICO, 503);
}

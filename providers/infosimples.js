// Infosimples (https://infosimples.com/consultas/) - fornecedor licenciado.
// Exige contrato e token. Cada consulta tem custo. Confira o nome exato de cada
// servico no catalogo da Infosimples antes de ativar.
const BASE = 'https://api.infosimples.com/api/v2/consultas';

export function infosimplesAtivo() {
  return Boolean(process.env.INFOSIMPLES_TOKEN);
}

export async function infosimples(servico, params) {
  if (!infosimplesAtivo()) {
    const err = new Error('Consulta indisponivel: configure INFOSIMPLES_TOKEN no arquivo .env.');
    err.status = 503;
    throw err;
  }
  const form = new URLSearchParams({
    token: process.env.INFOSIMPLES_TOKEN,
    timeout: '300',
    ...params,
  });
  const res = await fetch(`${BASE}/${servico}`, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(320000),
  });
  const body = await res.json().catch(() => ({}));
  // Infosimples responde code 200 em sucesso; 6xx = erro de parametro/fonte.
  if (body.code !== 200) {
    const err = new Error(body.code_message || `Erro ${body.code ?? res.status} na Infosimples`);
    err.status = 502;
    throw err;
  }
  return body.data?.length === 1 ? body.data[0] : body.data;
}

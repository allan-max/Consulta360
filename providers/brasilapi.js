// BrasilAPI (https://brasilapi.com.br) - dados publicos, gratuito, sem chave.
const BASE = 'https://brasilapi.com.br/api';

export async function brasilApi(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'User-Agent': 'consulta360/1.0' },
    signal: AbortSignal.timeout(15000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.message || body.errors?.[0]?.message || `Erro ${res.status} na BrasilAPI`;
    const err = new Error(msg);
    err.status = res.status === 404 ? 404 : 502;
    throw err;
  }
  return body;
}

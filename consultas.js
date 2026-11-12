// Execucao das consultas no servidor. As definicoes (campos, validacao, caminhos da
// BrasilAPI) ficam em public/js/catalogo.js, compartilhado com o modo estatico.
import { brasilApi } from './providers/brasilapi.js';
import { infosimples, infosimplesAtivo } from './providers/infosimples.js';
import { consultas as catalogo, digitos, exigir, cpfValido } from './public/js/catalogo.js';

// Consultas licenciadas: so rodam no servidor, com token do fornecedor.
const LICENCIADAS = {
  async cpf({ cpf, nascimento }) {
    cpf = digitos(cpf);
    exigir(cpfValido(cpf), 'CPF invalido.');
    exigir(/^\d{4}-\d{2}-\d{2}$/.test(nascimento ?? ''), 'Informe a data de nascimento.');
    const [a, m, d] = nascimento.split('-');
    return infosimples('receita-federal/cpf', { cpf, birthdate: `${d}/${m}/${a}` });
  },

  async placa({ placa, renavam }) {
    placa = String(placa ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    exigir(/^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(placa), 'Placa invalida.');
    const servico = process.env.INFOSIMPLES_SERVICO_PLACA;
    exigir(servico, 'Defina INFOSIMPLES_SERVICO_PLACA no .env (nome do servico no catalogo Infosimples).');
    const params = { placa };
    if (digitos(renavam)) params.renavam = digitos(renavam);
    return infosimples(servico, params);
  },
};

// Erros de validacao do catalogo viram HTTP 400.
function validar(fn) {
  try {
    return fn();
  } catch (err) {
    err.status ??= 400;
    throw err;
  }
}

export const consultas = catalogo.map((c) => ({
  ...c,
  executar: c.caminho
    ? async (entrada) => brasilApi(validar(() => c.caminho(entrada)))
    : LICENCIADAS[c.id],
}));

export function catalogoPublico() {
  return catalogo.map(({ caminho, ...c }) => ({
    ...c,
    disponivel: c.fonte === 'publica' || infosimplesAtivo(),
  }));
}

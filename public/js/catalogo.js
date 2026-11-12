// Catalogo de consultas do Consulta360, compartilhado entre o servidor (Node) e o
// navegador (modo estatico do GitHub Pages). Nada aqui pode depender do Node.
// fonte: 'publica' = gratis (BrasilAPI); 'licenciada' = fornecedor contratado (so no servidor).
// Consultas publicas tem caminho(entrada): valida a entrada e devolve o caminho na BrasilAPI.

export const BRASIL_API = 'https://brasilapi.com.br/api';

export const FINALIDADES = [
  'Analise de credito',
  'Prevencao a fraude',
  'Cumprimento de obrigacao legal ou contratual',
  'Compra e venda de veiculo',
];

export const PLANOS = [
  { id: 'basico', nome: 'Basico', creditos: 20, valor_centavos: 1990, destaque: false,
    itens: ['20 creditos', 'Historico de consultas', 'Suporte por e-mail'] },
  { id: 'profissional', nome: 'Profissional', creditos: 60, valor_centavos: 4990, destaque: true,
    itens: ['60 creditos', 'Historico de consultas', 'Exportacao em JSON', 'Suporte prioritario'] },
  { id: 'empresarial', nome: 'Empresarial', creditos: 150, valor_centavos: 9990, destaque: false,
    itens: ['150 creditos', 'Historico de consultas', 'Acesso a API', 'Gerente de conta'] },
];

export const digitos = (v) => String(v ?? '').replace(/\D/g, '');

export function exigir(cond, msg) {
  if (!cond) {
    const err = new Error(msg);
    err.status = 400;
    throw err;
  }
}

export function cpfValido(cpf) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const t of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(cpf[i]) * (t + 1 - i);
    const dv = ((soma * 10) % 11) % 10;
    if (dv !== Number(cpf[t])) return false;
  }
  return true;
}

export function cnpjValido(cnpj) {
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (base) => {
    let pos = base.length - 7, soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * pos--;
      if (pos < 2) pos = 9;
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(cnpj.slice(0, 12)) === Number(cnpj[12]) && calc(cnpj.slice(0, 13)) === Number(cnpj[13]);
}

export const consultas = [
  {
    id: 'cnpj', categoria: 'Empresas', titulo: 'CNPJ', fonte: 'publica', custo: 0,
    descricao: 'Razao social, situacao, endereco, CNAE e quadro de socios (Receita Federal).',
    campos: [{ nome: 'cnpj', rotulo: 'CNPJ', mascara: 'cnpj' }],
    caminho({ cnpj }) {
      cnpj = digitos(cnpj);
      exigir(cnpjValido(cnpj), 'CNPJ invalido.');
      return (`/cnpj/v1/${cnpj}`);
    },
    // Reserva no navegador se a BrasilAPI falhar (Minha Receita: mesma base aberta
    // da Receita Federal e os mesmos campos). URL completa.
    alternativa({ cnpj }) {
      return `https://minhareceita.org/${digitos(cnpj)}`;
    },
  },
  {
    id: 'cpf', categoria: 'Pessoas', titulo: 'CPF - Situacao cadastral', fonte: 'licenciada', custo: 2,
    descricao: 'Nome e situacao cadastral na Receita Federal. Exige data de nascimento e finalidade legitima (LGPD).',
    campos: [
      { nome: 'cpf', rotulo: 'CPF', mascara: 'cpf' },
      { nome: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date' },
    ],
    lgpd: true,
  },
  {
    id: 'placa', categoria: 'Veiculos', titulo: 'Veiculo por placa', fonte: 'licenciada', custo: 5,
    descricao: 'Dados do veiculo, restricoes e debitos via fornecedor credenciado. CRV/CRLV so o proprietario emite (Detran / Carteira Digital de Transito).',
    campos: [
      { nome: 'placa', rotulo: 'Placa', mascara: 'placa' },
      { nome: 'renavam', rotulo: 'Renavam (opcional)', opcional: true },
    ],
    lgpd: true,
  },
  {
    id: 'fipe', categoria: 'Veiculos', titulo: 'Tabela FIPE', fonte: 'publica', custo: 0,
    descricao: 'Preco medio do veiculo pelo codigo FIPE.',
    campos: [{ nome: 'codigo', rotulo: 'Codigo FIPE', placeholder: '001004-9' }],
    caminho({ codigo }) {
      codigo = String(codigo ?? '').trim();
      exigir(/^\d{6}-?\d$/.test(codigo), 'Codigo FIPE invalido (ex.: 001004-9).');
      return (`/fipe/preco/v1/${codigo}`);
    },
  },
  {
    id: 'cep', categoria: 'Enderecos', titulo: 'CEP', fonte: 'publica', custo: 0,
    descricao: 'Logradouro, bairro, cidade, UF e coordenadas.',
    campos: [{ nome: 'cep', rotulo: 'CEP', mascara: 'cep' }],
    caminho({ cep }) {
      cep = digitos(cep);
      exigir(cep.length === 8, 'CEP invalido.');
      return (`/cep/v2/${cep}`);
    },
  },
  {
    id: 'ddd', categoria: 'Enderecos', titulo: 'DDD', fonte: 'publica', custo: 0,
    descricao: 'Estado e cidades atendidas por um DDD.',
    campos: [{ nome: 'ddd', rotulo: 'DDD', placeholder: '11' }],
    caminho({ ddd }) {
      ddd = digitos(ddd);
      exigir(ddd.length === 2, 'DDD invalido.');
      return (`/ddd/v1/${ddd}`);
    },
  },
  {
    id: 'banco', categoria: 'Financeiro', titulo: 'Banco', fonte: 'publica', custo: 0,
    descricao: 'Nome e ISPB do banco pelo codigo de compensacao.',
    campos: [{ nome: 'codigo', rotulo: 'Codigo do banco', placeholder: '341' }],
    caminho({ codigo }) {
      codigo = digitos(codigo);
      exigir(codigo.length >= 1 && codigo.length <= 3, 'Codigo invalido.');
      return (`/banks/v1/${Number(codigo)}`);
    },
  },
  {
    id: 'ncm', categoria: 'Fiscal', titulo: 'NCM', fonte: 'publica', custo: 0,
    descricao: 'Descricao de um codigo NCM, ou busca por palavra.',
    campos: [{ nome: 'termo', rotulo: 'Codigo NCM ou palavra', placeholder: '8471.30.12' }],
    caminho({ termo }) {
      termo = String(termo ?? '').trim();
      exigir(termo.length >= 2, 'Informe o codigo ou palavra.');
      const cod = digitos(termo);
      if (cod.length === 8) return (`/ncm/v1/${cod}`);
      return (`/ncm/v1?search=${encodeURIComponent(termo)}`);
    },
  },
  {
    id: 'dominio', categoria: 'Empresas', titulo: 'Dominio .br', fonte: 'publica', custo: 0,
    descricao: 'Disponibilidade e status de um dominio no Registro.br.',
    campos: [{ nome: 'dominio', rotulo: 'Dominio', placeholder: 'exemplo.com.br' }],
    caminho({ dominio }) {
      dominio = String(dominio ?? '').trim().toLowerCase();
      exigir(/^[a-z0-9.-]+\.br$/.test(dominio), 'Informe um dominio .br.');
      return (`/registrobr/v1/${dominio}`);
    },
  },
  {
    id: 'isbn', categoria: 'Outros', titulo: 'ISBN', fonte: 'publica', custo: 0,
    descricao: 'Titulo, autores e editora de um livro.',
    campos: [{ nome: 'isbn', rotulo: 'ISBN', placeholder: '9788545702870' }],
    caminho({ isbn }) {
      isbn = String(isbn ?? '').replace(/[^0-9Xx]/g, '');
      exigir(isbn.length === 10 || isbn.length === 13, 'ISBN invalido.');
      return (`/isbn/v1/${isbn}`);
    },
  },
  {
    id: 'taxas', categoria: 'Financeiro', titulo: 'Taxas SELIC, CDI e IPCA', fonte: 'publica', custo: 0,
    descricao: 'Valor atual das principais taxas e indices oficiais.',
    campos: [{ nome: 'sigla', rotulo: 'Taxa', opcoes: ['SELIC', 'CDI', 'IPCA'] }],
    caminho({ sigla }) {
      exigir(['SELIC', 'CDI', 'IPCA'].includes(sigla), 'Escolha SELIC, CDI ou IPCA.');
      return (`/taxas/v1/${sigla}`);
    },
  },
  {
    id: 'cambio', categoria: 'Financeiro', titulo: 'Cotacao de moeda', fonte: 'publica', custo: 0,
    descricao: 'Cotacao de compra e venda do Banco Central em uma data.',
    campos: [
      { nome: 'moeda', rotulo: 'Moeda', opcoes: ['USD', 'EUR', 'GBP', 'ARS', 'JPY', 'CHF', 'CAD', 'AUD'] },
      { nome: 'data', rotulo: 'Data', tipo: 'date' },
    ],
    caminho({ moeda, data }) {
      exigir(/^[A-Z]{3}$/.test(moeda ?? ''), 'Moeda invalida.');
      exigir(/^\d{4}-\d{2}-\d{2}$/.test(data ?? ''), 'Informe a data.');
      return (`/cambio/v1/cotacao/${moeda}/${data}`);
    },
  },
  {
    id: 'corretora', categoria: 'Financeiro', titulo: 'Corretora CVM', fonte: 'publica', custo: 0,
    descricao: 'Cadastro de corretora de valores na CVM pelo CNPJ.',
    campos: [{ nome: 'cnpj', rotulo: 'CNPJ da corretora', mascara: 'cnpj' }],
    caminho({ cnpj }) {
      cnpj = digitos(cnpj);
      exigir(cnpjValido(cnpj), 'CNPJ invalido.');
      return (`/cvm/corretoras/v1/${cnpj}`);
    },
  },
  {
    id: 'municipios', categoria: 'Enderecos', titulo: 'Municipios por UF', fonte: 'publica', custo: 0,
    descricao: 'Lista de municipios de um estado com codigo IBGE.',
    campos: [{ nome: 'uf', rotulo: 'UF', opcoes: 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ') }],
    caminho({ uf }) {
      exigir(/^[A-Z]{2}$/.test(uf ?? ''), 'UF invalida.');
      return (`/ibge/municipios/v1/${uf}`);
    },
  },
  {
    id: 'feriados', categoria: 'Outros', titulo: 'Feriados nacionais', fonte: 'publica', custo: 0,
    descricao: 'Feriados nacionais de um ano.',
    campos: [{ nome: 'ano', rotulo: 'Ano', placeholder: '2026' }],
    caminho({ ano }) {
      ano = digitos(ano);
      exigir(/^(19|20)\d{2}$/.test(ano), 'Ano invalido.');
      return (`/feriados/v1/${ano}`);
    },
  },
];

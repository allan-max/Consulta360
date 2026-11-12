# Consulta360

Site de consultas multipagina: CNPJ, CPF, veiculos, CEP, FIPE, bancos, taxas e mais.

Roda de dois jeitos:

- **GitHub Pages (modo estatico):** publicado automaticamente a cada push na `main` (`.github/workflows/pages.yml`). As consultas gratuitas chamam a BrasilAPI direto do navegador. Login, creditos, historico, CPF, placa e contato ficam desligados com aviso "em breve".
- **Servidor Node (completo):** contas, creditos pre-pagos, historico, consultas licenciadas e formulario de contato.

Para testar o modo estatico localmente, abra qualquer pagina com `?estatico=1` (volte com `?estatico=0`).

## Rodar

```bash
npm install
cp .env.example .env
npm start
```

Abra http://localhost:3000. Requer Node 22.13+ (usa o SQLite embutido, banco em `data/portal.db`).

## Paginas

| Rota | Conteudo |
|---|---|
| `/` | Home: busca rapida, categorias, populares, como funciona, planos, FAQ |
| `/consultas` | Catalogo com busca e filtros por categoria e preco |
| `/consulta?id=cnpj` | Pagina de cada consulta: formulario, resultado, imprimir/JSON, relacionadas |
| `/planos` | Pacotes de creditos e tabela de precos por consulta |
| `/entrar`, `/cadastro` | Login e criacao de conta |
| `/painel` | Visao geral, historico, compra de creditos, dados da conta |
| `/como-funciona`, `/sobre`, `/faq`, `/contato` | Institucional e suporte |
| `/termos`, `/privacidade` | Modelos base (revisar com advogado) |

## Consultas

| Consulta | Fonte | Custo |
|---|---|---|
| CNPJ, CEP, DDD, Banco, FIPE, NCM, Dominio .br, ISBN, Taxas, Cambio, Corretora CVM, Municipios, Feriados | BrasilAPI | Gratis |
| CPF (situacao cadastral) | Infosimples `receita-federal/cpf` | 2 creditos |
| Veiculo por placa | Infosimples (`INFOSIMPLES_SERVICO_PLACA`) | 5 creditos |

Custos ficam no campo `custo` em `consultas.js`. Creditos so sao descontados em caso de sucesso.

## Creditos e pagamentos

A compra cria um pedido pendente. Ainda nao ha gateway: aprove manualmente.

```bash
npm run creditos -- pedidos
npm run creditos -- aprovar 1
npm run creditos -- somar email@cliente.com 10
```

Para producao, integre Mercado Pago, Asaas ou Stripe em `POST /api/pedidos` (server.js) e libere os creditos no webhook.

## Ativar consultas licenciadas

1. Contrate a Infosimples (ou outro agregador) com CNPJ e finalidade definida.
2. Coloque o token em `INFOSIMPLES_TOKEN` no `.env`.
3. Confira no catalogo da Infosimples o servico de veiculo e coloque em `INFOSIMPLES_SERVICO_PLACA`.

## Catalogo compartilhado

As consultas (campos, validacao e caminho na BrasilAPI), planos e finalidades ficam em `public/js/catalogo.js`, usado pelo servidor e pelo navegador. As consultas licenciadas sao executadas so no servidor (`consultas.js`).

## Personalizar

- Nome do site: `MARCA` em `public/js/layout.js` e os `<title>` das paginas.
- Cores: variaveis no topo de `public/css/site.css`.
- Planos: `PLANOS` em `server.js`.
- E-mails de contato, razao social e CNPJ: `contato.html` e `privacidade.html`.

## LGPD

- Consultas com dados pessoais exigem finalidade e ficam no historico com o documento mascarado.
- Nunca use bases vazadas ou acesso nao autorizado a sistemas do governo.
- CRV/CRLV so pode ser emitido pelo proprietario (Detran / Carteira Digital de Transito).

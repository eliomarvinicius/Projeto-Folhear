# Folhear

Aplicativo em **Ionic + Angular standalone** para explorar livros da [Open Library](https://openlibrary.org): navegue por assunto, busque por título ou autor, veja os detalhes de cada obra e guarde os que quiser ler depois.

Projeto da disciplina de Desenvolvimento Mobile (2ª avaliação).

## Funcionalidades

- **Home:** faixa de abertura com busca, assuntos em português e uma estante com 12 capas em destaque.
- **Livros:** lista numerada por assunto ou por busca, com paginação de 12 livros por página.
- **Detalhes:** capa, autor, século, primeira publicação, descrição e assuntos da obra.
- **Favoritos:** livros marcados com o coração, salvos no navegador (`localStorage`).

## Tecnologias

| Item | Versão |
|---|---|
| Ionic (`@ionic/angular`) | 9 |
| Angular (componentes standalone) | 21 |
| TypeScript | 5.9 |
| ngx-pagination | 6 |
| Fontes (`@fontsource`) | Newsreader e DM Sans |

Sem NgModules, sem `*ngIf`/`*ngFor`: o controle de fluxo usa apenas `@if` e `@for`.

## Como rodar

Pré-requisito: **Node.js 22.12 ou superior** (ou 20.19 ou superior).

```bash
npm install
npm start
```

O app abre em `http://localhost:4200`.

Build de produção (saída em `www/`):

```bash
npm run build
```

O arquivo `.npmrc` (`legacy-peer-deps=true`) evita um erro do npm 10 na resolução de dependências. A primeira instalação baixa cerca de 700 pacotes e pode demorar alguns minutos.

## Requisitos do trabalho

| # | Requisito | Onde está |
|---|---|---|
| 1 | Home + 3 páginas | `src/app/home`, `livros`, `detalhes`, `favoritos`; rotas em `app.routes.ts` e `tabs/tabs.routes.ts` |
| 2 | API com 3 métodos GET | `src/app/services/livros.service.ts`: `getPorAssunto()`, `buscar()`, `getObra()` (+ `getAutor()`) |
| 3 | 2 pipes personalizadas + 2 built-in | Custom: `pipes/autores.pipe.ts`, `pipes/seculo.pipe.ts`. Built-in: `titlecase`, `slice`, `date`, `uppercase` |
| 4 | 2 services | `services/livros.service.ts` (HttpClient) e `services/favoritos.service.ts` (`localStorage`) |
| 5 | 2 diretivas personalizadas + `@if` e `@for` | `directives/destaque.directive.ts` e `directives/favorito.directive.ts` (`@HostListener` e `@HostBinding`); `@if`/`@for` nos templates |
| 6 | Extra: parâmetro por rota | `detalhes/:id` lido com `ActivatedRoute` em `detalhes/detalhes.page.ts`; `?assunto=` e `?q=` na página Livros |

### Pipes personalizadas

- `autores`: remove nomes repetidos, junta como "A, B e C" e resume listas longas (`autores: 1` → "Carlo Collodi e mais 103"). Lista vazia vira "Autor desconhecido".
- `seculo`: converte o ano em século em algarismos romanos (`1899` → "Século XIX").

### Diretivas personalizadas

- `appDestaque`: destaca o livro sob o ponteiro (fundo e barra verdes na lista; a capa sobe na estante).
- `appFavorito`: alterna o favorito ao clicar no coração e marca o estado do botão (`aria-pressed`).

## API

[Open Library](https://openlibrary.org/developers/api): pública, sem chave, somente GET.

| Endpoint | Uso |
|---|---|
| `GET /subjects/{assunto}.json` | Livros por assunto |
| `GET /search.json?q={texto}` | Busca por texto |
| `GET /works/{id}.json` | Detalhes da obra |
| `GET /authors/{id}.json` | Nome do autor |
| `covers.openlibrary.org/b/id/{id}-M.jpg` | Capas |

A busca da Open Library às vezes demora (de 2 a 17 s nos testes). O app mostra um indicador de carregamento e um botão "Tentar de novo" em caso de erro.

## Estrutura

```
src/
  app/
    home/  livros/  detalhes/  favoritos/   páginas
    tabs/                                    navegação por abas
    components/livro-item/                   item de livro reutilizado nas listas
    services/                                livros (API) e favoritos (local)
    pipes/                                   autores e seculo
    directives/                              destaque e favorito
    models/livro.ts                          tipos, assuntos e URL das capas
  global.scss                                estilos do app
  theme/variables.scss                       paleta verde, preto e branco
```

## Segurança

- Nenhuma chave ou token no código.
- Textos da API exibidos com interpolação (`{{ }}`), sem `innerHTML` nem `bypassSecurityTrust*`.
- Texto de busca enviado com `HttpParams`.
- `localStorage` guarda só dados públicos do livro e valida o conteúdo ao ler.

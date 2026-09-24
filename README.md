# ONG Ação Solidária

Site institucional em **Single Page Application (SPA)** desenvolvido como Experiência Prática académica. Apresenta a ONG, campanhas de doação, voluntariado e formulário de engajamento, com validação em tempo real, persistência local e componentes de feedback (badges, alerts, toasts e modal).

**Repositório:** [github.com/matheusmcz/ogn-acao-solidario](https://github.com/matheusmcz/ogn-acao-solidario)  
**Release atual:** `v1.0.0`

---

## Sumário

1. [Visão geral](#visão-geral)
2. [Tecnologias](#tecnologias)
3. [Estrutura de pastas](#estrutura-de-pastas)
4. [Pré-requisitos](#pré-requisitos)
5. [Instalação e execução local](#instalação-e-execução-local)
6. [Build e verificação](#build-e-verificação)
7. [Funcionalidades](#funcionalidades)
8. [Versionamento e GitFlow](#versionamento-e-gitflow)
9. [Pull Requests e releases](#pull-requests-e-releases)
10. [Capturas de ecrã](#capturas-de-ecrã)
11. [Licença e autor](#licença-e-autor)

---

## Visão geral

A aplicação carrega um **shell** (`html/index.html`) com cabeçalho, navegação e rodapé fixos. O conteúdo das vistas é injetado em `<main id="app">` via JavaScript (hash routing `#/`, `#/projetos`, `#/cadastro`, `#/componentes`).

Objetivos pedagógicos cobertos:

- HTML semântico e CSS com design tokens
- SPA com manipulação do DOM
- Templates HTML5 (`<template>` + `cloneNode`)
- Eventos, validação de formulário e feedback visual
- Persistência com `localStorage` + JSON
- Integração de biblioteca externa (Day.js)
- Módulos ES6 (`import` / `export`)
- Controlo de versões com Git/GitHub (GitFlow + Conventional Commits + SemVer)

---

## Tecnologias

| Camada | Tecnologia | Uso |
|--------|------------|-----|
| Marcação | HTML5 | Shell SPA, partials em `html/pages/`, `<template>` |
| Estilos | CSS3 | Variáveis `:root`, Grid/Flexbox, componentes de feedback |
| Lógica | JavaScript (ES6 Modules) | Roteamento, formulário, templates, storage |
| Bundler | [Vite](https://vitejs.dev/) 6 + esbuild | Dev server, bundle e minificação HTML/CSS/JS |
| Datas | [Day.js](https://day.js.org/) (npm) | Formatação de `enviadoEm` no histórico |
| Imagens | sharp | Compressão JPEG na build |
| Persistência | Web Storage (`localStorage`) | Cadastros em JSON (`ong_cadastros`) |
| Servidor local | Vite / Python 3 (`http.server`) | Dev e preview; Python como alternativa |
| Versionamento | Git + GitHub | Branches, PRs, tags SemVer |

> A dependência de runtime **dayjs** é instalada via npm e empacotada pelo Vite. Em desenvolvimento sem build, use `npm run dev`.

---

## Estrutura de pastas

```
ogn-acao-solidario/
├── html/                 # Shell SPA e redirecionamentos
│   ├── index.html        # Entrada da aplicação
│   ├── pages/            # Fragments carregados pelo router
│   └── *.html            # Atalhos → hash routes
├── css/
│   └── styles.css        # Design system + layout + feedback
├── js/
│   ├── main.js           # Router SPA (orquestração)
│   ├── data.js           # Dados estáticos dos projetos
│   ├── templates.js      # Clonagem de <template>
│   ├── form.js           # Validação e UI do cadastro
│   ├── storage.js        # localStorage (set/get/parse)
│   └── dates.js          # Day.js (formatação)
├── images/               # Imagens e favicon SVG
├── docs/capturas/        # Evidências visuais (badges, alerts, toast, modal)
├── servir.sh             # Script auxiliar do servidor local
├── index.html            # Redirect para html/index.html
├── favicon.ico
└── README.md
```

---

## Pré-requisitos

- **Git** (clonar o repositório)
- **Navegador moderno** (Chrome, Firefox, Edge ou Safari atualizados)
- **Python 3** (servidor HTTP estático) — já incluído no macOS/Linux na maioria dos casos  
  Alternativas: `npx serve`, extensão Live Server (VS Code), etc.

> **Importante:** não abra o HTML via `file://`. ES Modules e `fetch` são bloqueados por CORS nesse protocolo.

---

## Instalação e execução local

### 1. Clonar o repositório

```bash
git clone https://github.com/matheusmcz/ogn-acao-solidario.git
cd ogn-acao-solidario
```

### 2. (Opcional) Verificar a release

```bash
git checkout main
git pull origin main
git checkout v1.0.0   # tag da entrega estável, se desejar
```

### 3. Subir o servidor local

Na **raiz** do projeto:

```bash
python3 -m http.server 8080
```

Ou use o script:

```bash
./servir.sh
# ou: ./servir.sh 3000
```

### 4. Abrir no navegador

Aceda a:

**http://localhost:8080/html/index.html**

Rotas da SPA (após carregar o shell):

| Hash | Vista |
|------|--------|
| `#/` | Início |
| `#/projetos` | Doações e voluntariado (cards via template) |
| `#/cadastro` | Formulário + histórico `localStorage` |
| `#/componentes` | Vitrine de badges, alerts, toasts e modal |

### 5. Encerrar

No terminal do servidor: `Ctrl+C`.

---

## Build e verificação

### Desenvolvimento com Vite

```bash
npm install
npm run dev
```

Abre o servidor de desenvolvimento (hot reload) em `http://localhost:5173/html/index.html`.

### Build de produção (minificação)

```bash
npm run build
```

O **Vite** (`vite.config.js`) gera a pasta `dist/` com:

- HTML minificado (`html/index.html`)
- JavaScript e CSS empacotados e minificados (`assets/*-[hash].*`, via **esbuild**)
- Partials SPA copiados (`html/pages/`)
- Imagens otimizadas com **sharp** (script `scripts/optimize-images.mjs`, qualidade JPEG ~72)

Pré-visualizar a build:

```bash
npm run preview
```

Checklist manual (alternativa académica sem suite de testes):

1. Abrir `dist` via `npm run preview`
2. Navegar pelas rotas hash sem erros no Console
3. Validar formulário, `localStorage` e alto contraste

Servidor estático simples (sem Vite), ainda válido para estudo:

```bash
python3 -m http.server 8080
# http://localhost:8080/html/index.html
```

---

## Funcionalidades

- **SPA** com interceptação de `a[data-link]` e `hashchange`
- **Templates** HTML5 para cards e badges (`js/templates.js` + `js/data.js`)
- **Validação** preventiva (`required`, `type`, `pattern`) com feedback visual
- **localStorage** chave `ong_cadastros` (array JSON)
- **Day.js** para datas do histórico
- **Feedback UI:** badges, alerts, toast e modal (ver `docs/capturas/`)
- **Acessibilidade:** skip link, `aria-*`, foco em campos inválidos

---

## Versionamento e GitFlow

### Conventional Commits

Mensagens padronizadas no formato:

```text
feature: descrição curta da alteração
```

Exemplos reais no histórico: `feature: add assets`, `feature: create html files for all pages and content`.

### GitFlow (adaptado)

| Branch | Papel |
|--------|--------|
| `main` | Código de **lançamento** (merges via Pull Request) |
| `feature/*` | Novas funcionalidades isoladas por domínio |
| `hotfix/*` | (Reservado) correções urgentes sobre `main` |

Features utilizadas:

- `feature/assets/add_assets`
- `feature/html/create_html_structure_for_spa_concept`
- `feature/javascript/create_files_to_control_aplication`
- `feature/styles/create_all_css_styles`

Fluxo: criar `feature/...` → commits → Push → **Pull Request** para `main` → merge.

### Versionamento semântico (SemVer)

Tags anotadas:

| Tag | Significado |
|-----|-------------|
| `v0.1.0` | Estrutura base |
| `v0.2.0` | Assets (PR #1) |
| `v0.3.0` | HTML/SPA (PR #2) |
| `v0.4.0` | JavaScript (PR #3) |
| `v1.0.0` | Release completa com CSS (PR #4) |

Convenção: **MINOR** (`0.x.0`) por bloco de funcionalidade; **MAJOR** `1.0.0` na primeira entrega integral.

```bash
git tag -l
git show v1.0.0
```

---

## Pull Requests e releases

Integração sempre via PR (mesmo em trabalho individual):

| PR | Título | Destino |
|----|--------|---------|
| #1 | feature: add assets | `main` |
| #2 | feature: create html files for all pages and content | `main` |
| #3 | feature: create javascript files to control aplication | `main` |
| #4 | feature: create all css styles | `main` |

Cada PR documenta o motivo da alteração antes do merge e alimenta a rastreabilidade das tags SemVer.

---

## Capturas de ecrã

Evidências dos componentes de feedback em `docs/capturas/`:

- `01-badges.png` — etiquetas semânticas
- `02-alerts.png` — caixas de alerta
- `03-toast.png` — notificações
- `04-modal.png` — diálogo confirmativo

---

## Licença e autor

Projeto académico — Experiência Prática.  
Autor: **Matheus** ([@matheusmcz](https://github.com/matheusmcz))

Para dúvidas de execução, priorize `npm run dev` ou o servidor HTTP local conforme [Instalação e execução local](#instalação-e-execução-local).

---

## Deploy (GitHub Pages)

A publicação em produção usa **GitHub Pages** com o workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml):

1. Push para `main` (ou *Run workflow* manual)
2. A Action executa `npm ci` + `npm run build`
3. O conteúdo de `dist/` é publicado automaticamente

**URL esperada:** `https://matheusmcz.github.io/ogn-acao-solidario/`

Em *Settings → Pages → Source*, selecione **GitHub Actions** na primeira configuração.

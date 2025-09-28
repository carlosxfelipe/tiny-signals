# Tiny-signals

Uma mini-lib **signals + JSX runtime** super simples (`tiny-signals.ts`) com `createSignal`, `createMemo`, `createEffect`, `batch`, `onCleanup`, `createRoot`, e um runtime JSX minimalista com `h`, `Fragment` e `mount` (HTML/SVG, eventos e estilos reativos).

## Requisitos

- Deno 2.5 ou superior (`deno --version`)

## Instalação

Instale o runtime do **Deno** no seu sistema usando um dos comandos abaixo.  
Há diversas maneiras de instalar o Deno — uma lista completa pode ser encontrada [aqui](https://docs.deno.com/runtime/manual/getting_started/installation).

### Shell (Mac, Linux)

```sh
curl -fsSL https://deno.land/install.sh | sh
```

### PowerShell (Windows)

```powershell
irm https://deno.land/install.ps1 | iex
```

### [Homebrew](https://formulae.brew.sh/formula/deno) (Mac)

```sh
brew install deno
```

### [Chocolatey](https://chocolatey.org/packages/deno) (Windows)

```powershell
choco install deno
```

### [WinGet](https://winstall.app/apps/DenoLand.Deno) (Windows)

```powershell
winget install --id=DenoLand.Deno
```

## Extensão para VSCode

Recomenda-se instalar a extensão [**Deno for VSCode (denoland.vscode-deno)**](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno).

### Benefícios da extensão:

- **Suporte a TypeScript e JSX:** fornece tipagem aprimorada e melhor autocompletar.  
- **Linting e formatação automática:** ajuda a manter um padrão de código consistente.  
- **Execução integrada:** permite rodar e depurar projetos Deno diretamente do VSCode.  
- **Importações otimizadas:** detecta módulos de forma nativa, simplificando o desenvolvimento.  
- **Melhor experiência com hooks e JSX do tiny-vdom:** aumenta a produtividade no uso da mini-lib.

## Começo rápido

```bash
deno task start
# abre http://localhost:8000
```

## JSX (opcional)

O projeto está configurado com **JSX clássico** e `jsxFactory: "h"` no `deno.json`.

- Dentro deste repositório, a pragma é **opcional**.
- Para portabilidade (ex.: arquivo isolado em CDN), você pode usar:

```tsx
/** @jsx h */
```

Também é possível escrever **sem JSX**, usando `h("div", ...)`.

## Recursos

- **Signals e computações reativas**
  - `createSignal(initial)`, `createMemo(calc)`, `createEffect(fn)`, `onCleanup(cb)`, `batch(f)`, `createRoot(dispose => ...)`.
- **Runtime JSX minimalista**
  - `h(tag | Component, props, ...children)`, `Fragment`, `mount(node, container)`.
  - **Eventos** via props `on*` (ex.: `onClick`), alias `className` → `class`.
  - **Atributos dinâmicos e children reativos**: você pode passar funções **sem argumentos** (`() => ...`) e o runtime cuida das atualizações.
  - **`style` objeto reativo**: valores podem ser string/number **ou funções** (`() => value`) aplicadas com `createEffect`.
  - **SVG** suportado (criação via `createElementNS` para tags conhecidas).
- **Router e store no exemplo do app**
  - Router hash-based (`#/` etc.) com `useRoute`, `navigate`, preservação/restauração de scroll.
  - Store simples em `src/store/` (persistente com `localStorage`) construída sobre `tiny-signals`.

### Tipos

- `JSX.Element` é `Node`; `JSX.IntrinsicElements` aceita atributos genéricos.
- `style` aceita `string` **ou** `StyleObject` (`Record<string, string | number | (() => string | number | null | undefined) | ...>`).
- `key` e `ref` estão declarados em `tiny-signals/jsx.d.ts`.

## Produção

- Gere o bundle e publique tudo que estiver em `dist/`.
- Em CDNs/edge (ou armazenamento de arquivos estáticos), faça upload do conteúdo de `dist/`.

## Licença

Este projeto é licenciado sob os termos da **GNU General Public License v3.0 or later**.

Você pode acessar a licença diretamente [aqui](https://www.gnu.org/licenses/gpl-3.0.txt).

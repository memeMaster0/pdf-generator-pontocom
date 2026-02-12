# Organização do projeto

Este documento descreve a estrutura atual e boas práticas para manter o diretório limpo e previsível.

---

## 1. Estrutura (raiz enxuta)

```
pdf_generator/
├── config/             # Configurações de build (Vite, TypeScript, Tailwind, PostCSS)
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── tsconfig.electron.json
│   └── tsconfig.node.json
├── docs/                # Documentação do projeto
│   └── ORGANIZATION.md
├── electron/            # Código-fonte do processo principal Electron (apenas .ts)
├── pdf_export/          # Gerador de PDF (Python + PyInstaller)
├── public/              # Assets estáticos (servidos pelo Vite)
├── resources/           # Modelo Excel (copiado no instalador)
├── scripts/             # Scripts de build one-off (ex.: ícones)
├── src/                 # Frontend React
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

Pastas geradas (ocultas no Explorer via .vscode/settings): `node_modules/`, `dist/`, `dist-electron/`, `build/`, `release/`, `pdf_export/build/`, `pdf_export/dist/`.

---

## 2. O que não versionar

- **node_modules/** — dependências (reinstalar com `npm install`)
- **dist/, dist-electron/** — build do front e do Electron
- **build/** — ícone .ico gerado por `npm run build:icons`
- **release/** — instalador e .exe portátil
- **pdf_export/build/, pdf_export/dist/** — saída do PyInstaller
- **\*.tsbuildinfo** — cache do TypeScript
- **electron/\*.js, electron/\*.d.ts** — compilado vai para dist-electron/

---

## 3. Regras para manter o diretório limpo

| Regra | Motivo |
|-------|--------|
| **Configs em config/** | Menos arquivos na raiz; um só lugar para Vite, TS, Tailwind, PostCSS |
| **Documentação em docs/** | README na raiz (convenção); demais docs em docs/ |
| **Um componente por arquivo** | Evita arquivos > 200–300 linhas |
| **screens/** = uma tela por arquivo | Navegação em App.tsx fica óbvia |
| **utils/** = funções puras, sem React | Testáveis e reutilizáveis |
| **Scripts em scripts/** | build-icons.js; evite novos scripts na raiz |
| **Python do PDF em pdf_export/** | Isola xlwings/Excel; .exe gerado ali |

---

## 4. Documentação

- **README.md** (raiz) — como instalar, rodar e gerar instalador.
- **docs/ORGANIZATION.md** — este arquivo (estrutura e regras).

Atualize o README quando mudar comandos ou requisitos.

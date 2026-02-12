# Verificação: dev e app instalável

Use este checklist após alterações na estrutura (config/, docs/, scripts) para garantir que tudo funciona.

---

## 1. Modo desenvolvimento

1. **Na raiz do projeto**, abra o terminal e rode:
   ```bash
   npm run electron:dev
   ```
2. **Esperado:**
   - O Vite sobe em `http://localhost:5173` (sem erros no terminal).
   - A janela do Electron abre e carrega a interface (Home com botão "Cobertura Premium").
   - Navegação: Home → Cobertura Premium → Informações do Cliente → Resumo.
   - Na tela de resumo, o botão **"Gerar PDF"** abre o diálogo "Salvar como" (em dev pode usar o .exe ou o script Python, conforme disponível).

3. **Se algo falhar:**
   - Confirme que `dist-electron/main.js` e `dist-electron/preload.js` existem (gerados por `tsc -p config/tsconfig.electron.json`).
   - Confirme que não há erro ao subir o Vite (config em `config/vite.config.ts`, `config/postcss.config.js`, `config/tailwind.config.js`).
   - Ícone: se a janela abrir sem ícone, rode `npm run build:icons` (gera `build/icon.ico`).

---

## 2. Build do frontend e do Electron

1. Rode:
   ```bash
   npm run build
   ```
2. **Esperado:** saída sem erros; pasta `dist/` na raiz com `index.html` e `dist/assets/*.js`, `*.css`.
3. Confirme que existe `dist-electron/main.js` e `dist-electron/preload.js` (se já rodou `electron:dev` ou `tsc -p config/tsconfig.electron.json` antes).

---

## 3. App instalável (Windows)

1. Gere o instalador:
   ```bash
   npm run electron:build:win
   ```
2. **Esperado:**
   - `npm run build:icons` gera `build/icon.ico`.
   - `pdf_export\build_exe.bat` gera `pdf_export/dist/fill_and_export_pdf.exe`.
   - TypeScript compila o Electron em `dist-electron/`.
   - Vite gera `dist/`.
   - electron-builder gera a pasta `release/` com o instalador e o portable.

3. **Teste do instalado:**
   - Instale a partir de `release/*.exe` (ou use o .exe portátil).
   - Abra o app: a janela deve abrir com a interface e o ícone.
   - Faça um fluxo completo até "Gerar PDF" e salve um PDF (é necessário **Microsoft Excel** instalado).
   - O PDF deve abrir após a geração e conter os dados e a data no formato dd/mm/yyyy.

---

## 4. Caminhos que não dependem de `config/`

- **Electron** (`electron/main.ts`): usa apenas `__dirname` (dist-electron), `app.getAppPath()`, `path.join(..., 'dist', ...)`, `path.join(..., 'resources', ...)`, `path.join(..., 'pdf_export', ...)`. Nenhum caminho aponta para `config/`.
- **package.json** `main`: `"dist-electron/main.js"` (na raiz do app).
- **electron-builder** `files`: `dist/**/*`, `dist-electron/**/*`; `extraResources`: `pdf_export/dist/...`, `resources/...`, `build/icon.ico` (todos relativos à raiz do projeto).
- **build-icons.js**: usa `path.join(__dirname, '..')` como raiz; não usa `config/`.

Ou seja: a mudança para `config/` e `docs/` não altera o comportamento do Electron nem do app instalado, apenas onde ficam os arquivos de configuração de build.

---

## 5. Resumo rápido

| O quê              | Comando / Onde verificar |
|--------------------|---------------------------|
| Dev sobe e abre   | `npm run electron:dev`    |
| Build front + TS  | `npm run build`           |
| Instalador        | `npm run electron:build:win` → `release/` |
| PDF no instalado  | Excel instalado; data em dd/mm/yyyy no PDF |

Se todos os passos acima passarem, **dev e app instalável** estão funcionando normalmente.

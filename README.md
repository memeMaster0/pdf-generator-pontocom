# PDF Generator

Desktop app for **generating complete PDFs** for a metallurgy company. The goal is to **streamline the sales team's workflow**: from quote setup and client data entry to exporting a ready-to-send proposal as PDF. Built with Electron + React + TypeScript; dark UI with yellow accents.

## Requirements

- **Node.js** (LTS recommended, e.g. 20.x or 22.x) — required to install dependencies and run the project.
- **To generate PDF** (end user): **Microsoft Excel** installed on Windows. The PDF generator is a bundled .exe — **Python does not need to be installed** on the user's machine.

## Installing Node.js on Windows

1. Go to the official site: **[https://nodejs.org](https://nodejs.org)**  
2. Download the **LTS** version (recommended for most users).  
3. Run the installer (`.msi`) and follow the steps.  
   - If prompted, check **"Automatically install the necessary tools"** (includes useful tools).  
   - Restart the terminal (or computer) after installation.  
4. Confirm installation by opening a new **PowerShell** or **Command Prompt** and running:

   ```bash
   node -v
   npm -v
   ```

   You should see the Node version (e.g. `v20.10.0`) and npm version (e.g. `10.2.0`).

## PDF generation (no Python on the user's machine)

The app uses a **bundled .exe** that fills the Excel template and exports to PDF. End users **do not need Python**.

- **On the user's PC**: only **Microsoft Excel** is required (Windows). The app installer includes the generator (`fill_and_export_pdf.exe`).
- **Excel fields**: each template uses **placeholders** replaced by the script (e.g. `[Nome do Cliente]`, `[Data Atual]`, `[Valor Total]`, `[Valor p/ Forma de Pagamento]`). The mapping per product is in `pdf_export/fill_and_export_pdf.py` (`FIELD_PLACEHOLDER_REPLACE`, `FIELD_PLACEHOLDER_REPLACE_PERGOLADO`, `FIELD_PLACEHOLDER_REPLACE_COBERTURA_RETRATIL`).
- **Templates**: the following .xlsx files must be in the project's **`resources/`** folder (they are copied into the installer):
  - **`PROPOSTA  - COBERTURA PREMIUM.xlsx`** — Cobertura Premium
  - **`PROPOSTA  - PERGOLADO.xlsx`** — Pergolado
  - **`PROPOSTA  - COBERTURA RETRÁTIL.xlsx`** — Cobertura Retrátil

### Building the installer (.exe)

**Python** is required on the machine only to build the installer. A single command does everything:

```bash
npm run electron:build:win
```

It runs, in order: icon generation (`build/icon.ico`), PDF generator build (`pdf_export/build_exe.bat` → `pdf_export/dist/fill_and_export_pdf.exe`), Electron and frontend build, and packaging with electron-builder. The installer and portable .exe are output to `release/`.

Anyone **installing** the app does not need Python — only **Microsoft Excel** (for the generator to export PDF).

## Running the project

After installing Node.js:

1. Open a terminal in the project folder (`pdf_generator`).

2. Install dependencies:

   ```bash
   npm install
   ```

3. For **development** (run the app in dev mode):

   ```bash
   npm run electron:dev
   ```

   The Electron app will open and the UI will load from Vite (hot reload).

4. To **build the installer/.exe** (Windows):

   ```bash
   npm run electron:build:win
   ```

   The installer and portable executable will be in the `release/` folder.

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run electron:dev` | Runs the Electron app in development mode (Vite + hot reload) |
| `npm run electron:build:win` | Builds the Windows installer and portable .exe (icons + PDF .exe + app build) |
| `npm run build` | Frontend build only (TypeScript + Vite) |
| `npm run dev` | Vite dev server only (no Electron) |
| `npm run preview` | Preview the frontend build |
| `npm run build:icons` | Generates `build/icon.ico` from `public/icon.svg` |

## Project structure

- **config/** — Build configuration (Vite, TypeScript, Tailwind, PostCSS).
- **docs/** — Documentation (`ORGANIZATION.md`, `VERIFICACAO.md`).
- **electron/**, **src/**, **pdf_export/**, **public/**, **resources/**, **scripts/** — Source code and assets.
- The root contains only `package.json`, `index.html`, `README.md`, `.gitignore`, and a `tsconfig.json` that extends `config/`.
- Generated folders (`node_modules`, `dist`, `build`, `release`, etc.) are hidden in the Explorer (see `.vscode/settings.json`).

## Screen flow

1. **Home** — Choice of product: **Cobertura Premium** (active), **Pergolado** (active), **Cobertura Retrátil** (active), **Porta** (inactive).
2. **Quote (product-specific)**  
   - **Cobertura Premium**: five-step selection (type, pillar, color/paint, thermal tile, PVC lining), then form (dimensions, price/m², pillar if applicable, travel cost).  
   - **Pergolado**: type and color of polycarbonate, tube dimension (or manual), then dimensions and optional price/m².  
   - **Cobertura Retrátil**: type of cover (thermal tile or polycarbonate); if thermal tile, then upper/lower colour and structure colour; then opening mode (manual/automated). After that, form with dimensions, price/m², optional automated opening cost, travel cost.
3. **Client information** — Name, CPF/CNPJ, address, city, phone (formatted and validated). Same for all products.
4. **Summary** — Carousel with quote and client summary; **"Generate PDF"** opens the save dialog and runs the generator (.exe or Python script in dev). The script selects the correct Excel template by product, fills placeholders (and the D43 description for Cobertura Premium and Cobertura Retrátil), then exports to PDF via Excel.

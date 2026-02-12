import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow(): void {
  // Ícone: no empacotado use process.resourcesPath (pasta onde extraResources são copiados)
  let iconPath: string;
  if (app.isPackaged) {
    const resourcesDir =
      typeof process.resourcesPath === 'string'
        ? process.resourcesPath
        : path.join(path.dirname(process.execPath), 'resources');
    iconPath = path.join(resourcesDir, 'build', 'icon.ico');
  } else {
    iconPath = path.join(__dirname, '..', 'build', 'icon.ico');
  }
  const iconOption = fs.existsSync(iconPath) ? { icon: iconPath } : {};

  const mainWindow = new BrowserWindow({
    width: 960,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    ...iconOption,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0d0d0d',
    show: false,
  });

  ipcMain.on('window:close', () => mainWindow.close());
  ipcMain.on('window:minimize', () => mainWindow.minimize());
  ipcMain.on('window:maximize', () => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });

  ipcMain.handle('generate-pdf', async (_, data: Record<string, unknown>) => {
    const appPath = app.getAppPath();
    // No app empacotado: recursos ficam ao lado do .exe do app (pasta resources/)
    const installResourcesPath = app.isPackaged
      ? path.join(path.dirname(process.execPath), 'resources')
      : appPath;
    const templatePath = app.isPackaged
      ? path.join(installResourcesPath, 'resources', 'PROPOSTA  - COBERTURA PREMIUM.xlsx')
      : path.join(appPath, 'resources', 'PROPOSTA  - COBERTURA PREMIUM.xlsx');

    const exeName = process.platform === 'win32' ? 'fill_and_export_pdf.exe' : 'fill_and_export_pdf';
    const exePath = app.isPackaged
      ? path.join(installResourcesPath, 'pdf_export', exeName)
      : path.join(appPath, 'pdf_export', exeName);
    const scriptPath = path.join(appPath, 'pdf_export', 'fill_and_export_pdf.py');

    const nomeCliente = (data.nomeCliente as string) || '';
    const palavras = nomeCliente.trim().split(/\s+/).filter(Boolean);
    const nomeParaArquivo = palavras.length > 3 ? palavras.slice(0, 2).join(' ') : nomeCliente.trim();
    const nomeSeguro = (nomeParaArquivo || 'Cliente').replace(/[\\/:*?"<>|]/g, '').trim() || 'Cliente';
    const defaultPath = `Orçamento - ${nomeSeguro}.pdf`;

    const { filePath: outputPath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Salvar PDF como',
      defaultPath,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });

    if (canceled || !outputPath) {
      return { success: false, error: 'canceled' };
    }

    const dataPath = path.join(os.tmpdir(), `cobertura-data-${Date.now()}.json`);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

    const runExe = (execPath: string, args: string[]) =>
      new Promise<{ success: boolean; error?: string }>((resolve) => {
        const child = spawn(execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
        let stderr = '';
        child.stderr?.on('data', (chunk) => { stderr += chunk.toString(); });
        child.on('close', (code) => {
          try { fs.unlinkSync(dataPath); } catch { /* ignore */ }
          if (code === 0) resolve({ success: true });
          else resolve({ success: false, error: stderr.trim() || `Código de saída ${code}` });
        });
        child.on('error', (err) => resolve({ success: false, error: err.message }));
      });

    const args = ['--template', templatePath, '--data', dataPath, '--output', outputPath];

    const runAndOpen = (result: { success: boolean; error?: string }) => {
      if (result.success) {
        import('electron').then(({ shell }) => shell.openPath(outputPath).catch(() => {}));
        return { success: true, path: outputPath };
      }
      return { success: false, error: result.error || 'Erro ao gerar PDF.' };
    };

    // Em desenvolvimento (não empacotado): priorizar o script Python para sempre usar o código atual
    if (!app.isPackaged) {
      let lastError = '';
      const pythonCommands = process.platform === 'win32' ? ['py', 'python'] : ['python3', 'python'];
      for (const py of pythonCommands) {
        const pyArgs = py === 'py' ? ['-3', scriptPath] : [scriptPath];
        const result = await runExe(py, [...pyArgs, ...args]);
        if (result.success) return runAndOpen(result);
        lastError = result.error ?? lastError;
      }
      if (fs.existsSync(exePath)) {
        const result = await runExe(exePath, args);
        return runAndOpen(result);
      }
      return {
        success: false,
        error: lastError || 'Gerador de PDF não encontrado. Instale Python ou gere o .exe com: cd pdf_export && pyinstaller fill_and_export_pdf.spec',
      };
    }

    // App empacotado: só o .exe está disponível
    if (fs.existsSync(exePath)) {
      const result = await runExe(exePath, args);
      return runAndOpen(result);
    }
    return {
      success: false,
      error: 'Gerador de PDF não encontrado. Reinstale o aplicativo ou entre em contato com o suporte.',
    };
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

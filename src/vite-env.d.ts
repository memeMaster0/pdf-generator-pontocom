/// <reference types="vite/client" />

interface ElectronAPI {
  closeWindow: () => void;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  generatePdf: (data: Record<string, unknown>) => Promise<{ success: boolean; path?: string; error?: string }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};

const { contextBridge, ipcRenderer } = require('electron');

// ── Expose Haxys Hub API to renderer ──────────────────────────────
contextBridge.exposeInMainWorld('haxyshub', {
  minimize: () => ipcRenderer.send('window:minimize'),
  close: () => ipcRenderer.send('window:close'),
  // Hard reload (= Ctrl+Shift+R) — usado pela tela de erro/manutenção
  // (global-error.tsx) para recarregar o app após um deploy.
  hardReload: () => ipcRenderer.send('window:hardReload'),
  // Restaura/foca a janela — chamado ao clicar numa notificação nativa do SO.
  show: () => ipcRenderer.send('window:show'),
  // Contador de não-lidas no ícone da taskbar. `dataUrl` = PNG da bolinha (o web
  // app desenha), `count` = número (0 limpa).
  setOverlayBadge: (dataUrl, count) => ipcRenderer.send('window:overlay', { dataUrl, count }),
});

// ── Bridge p/ abrir links externos no navegador do sistema ─────────
// O frontend (lib/openExternal) chama window.electronAPI.openExternal,
// que abre via shell.openExternal no main — sem navegar/substituir a janela.
contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
});

// ── Inject custom CSS on page load ─────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Thin dark scrollbars */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* Smooth scroll */
    html {
      scroll-behavior: smooth;
    }
  `;
  document.head.appendChild(style);
});

/**
 * Auto-updater module for Haxys Hub.
 */
function initAutoUpdater(mainWindow) {
  try {
    const { autoUpdater } = require('electron-updater');

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    // Check for updates on init
    autoUpdater.checkForUpdatesAndNotify();

    // Check every 4 hours
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 4 * 60 * 60 * 1000);

    autoUpdater.on('update-available', (info) => {
      console.log('[HaxysHub] Update available:', info.version);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('[HaxysHub] Update downloaded:', info.version);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.executeJavaScript(`
          var appUpdateBtn = document.getElementById('app-update-btn');
          if (appUpdateBtn) appUpdateBtn.style.display = 'block';
        `).catch(()=>{});
      }
    });

    autoUpdater.on('error', (err) => {
      console.log('[HaxysHub] Auto-updater error (expected without server):', err.message);
    });
  } catch (err) {
    console.log('[HaxysHub] Auto-updater not available:', err.message);
  }
}

module.exports = { initAutoUpdater };

import { BrowserWindow, Menu, app, screen } from 'electron';
import log from 'electron-log';

import { WindowOpenHandler } from '../../getWindowOpenHandler';
import { getTrayQuitOption } from '../../tray';
import { State } from '../../types';
import { getOrCreateBrowserWindow, isLinux, loadUrl } from '../../utils';

const getOrCreateHqWindow = async (
  state: State,
  preloadPath: string,
  siteUrl: string,
  windowOpenHandler: WindowOpenHandler
): Promise<BrowserWindow> => {
  return getOrCreateBrowserWindow(state, `hq`, async () => {
    const primaryDisplay = screen.getPrimaryDisplay();

    const hqWindow = new BrowserWindow({
      autoHideMenuBar: isLinux(),
      backgroundColor: `#ffffff`,
      focusable: true,
      frame: !isLinux(),
      height: primaryDisplay.workArea.height,
      hiddenInMissionControl: false,
      skipTaskbar: false,
      webPreferences: { preload: preloadPath },
      width: primaryDisplay.workArea.width,
      x: primaryDisplay.workArea.x,
      y: primaryDisplay.workArea.y,
    });

    hqWindow.webContents.setWindowOpenHandler(windowOpenHandler);

    // Don't allow the user to close the HQ window - they can open it again
    // from the tray icon menu
    hqWindow.on(`close`, (event) => {
      log.info(`HQ window close event received`);

      if (hqWindow.isDestroyed()) {
        log.info(`HQ window destroyed, not closing`);
      } else if (!state.allowQuit) {
        log.info(`allowQuit=false, preventing HQ window from closing`);
        event.preventDefault();
        hqWindow.hide();
      } else {
        log.info(`Closing HQ window...`);
      }
    });

    // Show the HQ window when user clicks on dock on Mac
    app.on(`activate`, async () => {
      log.info(`App activate event received`);

      const window = await getOrCreateHqWindow(
        state,
        preloadPath,
        siteUrl,
        windowOpenHandler
      );

      log.info(`Showing HQ window`);
      window.show();
    });

    // The home page will redirect the user to their company's HQ page
    await loadUrl(`${siteUrl}/`, hqWindow, state);

    if (state.tray) {
      const contextMenu = Menu.buildFromTemplate([
        {
          label: `Open Swivvel`,
          type: `normal`,
          click: async (): Promise<void> => {
            log.info(`Received "Open Swivvel" click from tray menu`);

            const window = await getOrCreateHqWindow(
              state,
              preloadPath,
              siteUrl,
              windowOpenHandler
            );

            log.info(`Showing HQ window...`);
            window.show();
          },
        },
        getTrayQuitOption(state),
      ]);

      state.tray.setContextMenu(contextMenu);
    }

    return hqWindow;
  });
};

export default getOrCreateHqWindow;

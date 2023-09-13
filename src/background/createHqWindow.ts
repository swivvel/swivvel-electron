import { BrowserWindow, app, screen } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { isLinux, loadUrl, makeBrowserWindow } from './utils';

export default async (
  state: State,
  preloadPath: string,
  siteUrl: string
): Promise<BrowserWindow> => {
  log.info(`Creating HQ window...`);

  const primaryDisplay = screen.getPrimaryDisplay();

  const hqWindow = makeBrowserWindow(siteUrl, {
    browserWindowOptions: {
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
    },
  });

  // Don't allow the user to close the HQ window - they can open it again
  // from the tray icon menu
  hqWindow.on(`close`, (event) => {
    if (!state.allowQuit) {
      event.preventDefault();
      hqWindow.hide();
    }
  });

  // Show the HQ window when user clicks on dock on Mac
  app.on(`activate`, () => {
    if (!hqWindow.isDestroyed()) {
      hqWindow.show();
    }
  });

  // The home page will redirect the user to their company's HQ page
  await loadUrl(`${siteUrl}/`, hqWindow, state);

  log.info(`Created HQ window`);

  return hqWindow;
};

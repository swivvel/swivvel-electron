import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { getBaseWindowOpenHandler } from '../utils';

export default (
  transparentWindow: BrowserWindow,
  siteUrl: string,
  callbacks: {
    onLogInPageOpened: () => void;
  }
): void => {
  log.info(`Configuring window open handler...`);

  transparentWindow.webContents.setWindowOpenHandler(({ url }) => {
    log.info(`Caught URL opened by transparent window: ${url}`);

    // When the transparent window opens, it detects if the user is not logged
    // in and opens this special URL. We catch the URL and open a new Electron
    // window with the log in page.
    if (url === `${siteUrl}/electron/login`) {
      log.info(`Log in page requested`);
      callbacks.onLogInPageOpened();
      return { action: `deny` };
    }

    return getBaseWindowOpenHandler(url, siteUrl);
  });
};

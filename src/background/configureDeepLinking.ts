import { app, BrowserWindow } from 'electron';
import { Deeplink } from 'electron-deeplink';

import { isProduction } from './utils';

/**
 * Configure URL protocol used for deep linking to the desktop app.
 */
export default (transparentWindow: BrowserWindow): void => {
  const protocol = isProduction() ? `swivvel` : `swivvel-dev`;

  const deeplink = new Deeplink({
    app,
    mainWindow: transparentWindow,
    protocol,
    isDev: !isProduction,
  });

  deeplink.on(`received`, (link) => {
    // todo
  });
};

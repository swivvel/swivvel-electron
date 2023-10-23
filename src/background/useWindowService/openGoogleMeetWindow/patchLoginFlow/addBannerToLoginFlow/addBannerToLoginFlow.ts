import path from 'path';

import { BrowserWindow } from 'electron';

import { Log, loadRawJsFromFile } from '../../../utils';

export default async (window: BrowserWindow, log: Log): Promise<boolean> => {
  if (!window.webContents.getURL().includes(`https://accounts.google.com/`)) {
    log(`User is not in the login flow, cannot add banner`);
    return false;
  }

  log(`Adding banner to login flow...`);

  const insertBannerJs = loadRawJsFromFile(
    path.join(__dirname, `insertBanner.js`)
  );

  if (!insertBannerJs) {
    log(`Could not find contents of insertBanner.js`);
    return false;
  }

  window.webContents.executeJavaScript(`(${insertBannerJs})()`);

  return true;
};

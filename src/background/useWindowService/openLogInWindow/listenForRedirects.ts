import { BrowserWindow, shell } from 'electron';
import log from 'electron-log';

import { isProduction, removeQueryParams } from '../../utils';
import openTransparentWindow from '../openTransparentWindow';

import { OpenLogInWindowArgs } from './types';

export default (
  logInWindow: BrowserWindow,
  args: OpenLogInWindowArgs
): void => {
  logInWindow.webContents.on(`will-redirect`, async (event) => {
    const { url } = event;
    log.info(`Caught redirect in log in window: ${removeQueryParams(url)}`);

    if (url.includes(`auth0.com/authorize`)) {
      // The `swivvel://` protocol doesn't work in development environments,
      // so we have to perform the log in flow within Electron
      if (!isProduction()) {
        log.info(`Skipping redirect to browser - development environment`);
      } else {
        log.info(`User is logging in, sending to browser for Google SSO`);
        event.preventDefault();
        shell.openExternal(url);
        return;
      }
    }

    // The log in window should never display the HQ page. Instead, Electron
    // should open the HQ page in the HQ window.
    //
    // This redirect happens during the log in flow. After the user successfully
    // logs in, they are redirected to the home page, which redirects them to
    // the HQ page.
    //
    // See main repo README for description of desktop log in flow.
    if (url.startsWith(`${args.siteUrl}/office/`)) {
      log.info(`Preventing redirect to HQ page from log in page`);
      event.preventDefault();

      // When the transparent window reloads the user will now be authenticated,
      // so the page will open the HQ window
      const transparentWindow = await openTransparentWindow(args);

      log.info(`Reloading transparent window...`);
      transparentWindow.reload();

      log.info(`Closing log in window...`);
      logInWindow.destroy();

      return;
    }

    log.info(`Proceeding with redirect in log in window`);
  });
};

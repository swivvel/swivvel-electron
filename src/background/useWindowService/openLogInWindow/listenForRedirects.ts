import { BrowserWindow, shell } from 'electron';
import log from 'electron-log';

import { State } from '../../types';
import { getSiteUrl, isProduction, removeQueryParams } from '../../utils';
import openTransparentWindow from '../openTransparentWindow';

import { OpenLogInWindowArgs } from './types';

export default (
  logInWindow: BrowserWindow,
  args: OpenLogInWindowArgs,
  state: State
): void => {
  logInWindow.webContents.on(`will-redirect`, async (event) => {
    const { url } = event;
    log.info(`Caught redirect in log in window: ${removeQueryParams(url)}`);

    if (
      url.includes(`auth0.com/authorize`) ||
      url.includes(`auth.swivvel.io/authorize`)
    ) {
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
    if (url.startsWith(`${getSiteUrl()}/office/`)) {
      log.info(`Preventing redirect to HQ page from log in page`);
      event.preventDefault();

      // Remove the log in window's custom menu items because we are about to
      // open the HQ window and that will add its own custom menu items
      args.trayService.resetTray();

      // When the transparent window reloads the user will now be authenticated,
      // so the page will open the HQ window
      const transparentWindow = await openTransparentWindow(args);

      log.info(`Reloading transparent window...`);
      transparentWindow.reload();

      // When closing the log in window, We were getting an error that the
      // `/api/auth/callback` URL failed to load, even though we know that at
      // this point it must have succeeded. To work around this, we're flagging
      // that authentication is complete so that we don't throw an error if the
      // URL fails to load.
      log.info(`Setting state.logInFlowCompleted = true`);
      state.logInFlowCompleted = true;

      log.info(`Closing log in window...`);
      logInWindow.destroy();

      return;
    }

    log.info(`Proceeding with redirect in log in window`);
  });
};

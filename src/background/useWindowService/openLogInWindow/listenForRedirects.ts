import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { getSiteUrl, removeQueryParams } from '../../utils';
import openTransparentWindow from '../openTransparentWindow';
import { Log } from '../utils';

import { OpenLogInWindowArgs } from './types';

export default (
  logInWindow: BrowserWindow,
  args: OpenLogInWindowArgs,
  state: State,
  log: Log
): void => {
  logInWindow.webContents.on(`will-redirect`, async (event) => {
    const { url } = event;
    log(`Caught redirect in log in window: ${removeQueryParams(url)}`);
    // The log in window should never display the HQ page. Instead, Electron
    // should open the HQ page in the HQ window.
    //
    // This redirect happens during the log in flow. After the user successfully
    // logs in, they are redirected to the home page, which redirects them to
    // the HQ page.
    //
    // See main repo README for description of desktop log in flow.
    if (url.startsWith(`${getSiteUrl()}/office/`)) {
      log(`Preventing redirect to HQ page from log in page`);
      event.preventDefault();

      // When the transparent window reloads the user will now be authenticated,
      // so the page will open the HQ window
      const transparentWindow = await openTransparentWindow(args);

      log(`Reloading transparent window...`);
      transparentWindow.reload();

      log(`Closing log in window...`);
      logInWindow.destroy();

      return;
    }

    log(`Proceeding with redirect in log in window`);
  });
};

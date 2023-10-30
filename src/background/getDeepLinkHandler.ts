import log from 'electron-log';

import { State } from './types';
import { WindowService } from './useWindowService';
import { loadUrl } from './utils';
import { net } from 'electron';

const convertDeepLinkUrlToHttps = (url: string): string => {
  return url.replace(/^swivvel:\/\//, `https://`);
};

export default (
  state: State,
  windowService: WindowService
): ((url: string) => Promise<void>) => {
  return async (url) => {
    // See main repo README for description of desktop log in flow
    if (url.includes(`/api/auth/callback`)) {
      log.info(`Running log in callback handler...`);

      const transparentWindow = await windowService.openTransparentWindow();
      const deepLinkUrl = convertDeepLinkUrlToHttps(url);

      const requests = net.request({
        method: `GET`,
        url: deepLinkUrl,
        session: transparentWindow.webContents.session,
        useSessionCookies: true,
      });

      log.info(`Proxying request to ${deepLinkUrl}...`);

      requests.on(`response`, (resp) => {
        transparentWindow.reload();
      });

      requests.on(`redirect`, (code, method, url) => {
        console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        console.log(`OPENING URL: ${url}`);
        // shell.openExternal(url);
        // requests.abort();
      });

      requests.on(`error`, (err) => {
        console.log(`xxxxxxxxxxxx`);
        console.log(err);
      });

      requests.end();

      // log.info(`Loading OAuth callback URL into log in window...`);
      // await loadUrl(deepLinkUrl, logInWindow, state, log.info, {
      //   // There is no easy way to recover if the OAuth callback URL fails to
      //   // load, so just close the app so that the user is re-prompted to log
      //   // in when they open it again.
      //   onError: `warnAndQuitApp`,
      // });
      // log.info(`Loaded OAuth callback URL into log in window`);

      // After the OAuth URL loads, the log in window will catch a redirect
      // to the HQ page and refresh the transparent window to update the
      // transparent window state and trigger the the HQ page to open
    }
  };
};

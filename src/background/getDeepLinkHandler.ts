import log from 'electron-log';

import { State } from './types';
import { WindowService } from './useWindowService';
import { loadUrl } from './utils';

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

      const logInWindow = await windowService.openLogInWindow();
      const deepLinkUrl = convertDeepLinkUrlToHttps(url);

      // log.info(logInWindow.webContents.session.cookies);
      // await logInWindow.webContents.session.clearStorageData({
      //   storages: [`cookies`],
      // });
      log.info(`Cleared cookies and local storage for log in window`);
      log.info(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);

      log.info(`Loading OAuth callback URL into log in window...`);
      await loadUrl(deepLinkUrl, logInWindow, state, log.info, {
        // There is no easy way to recover if the OAuth callback URL fails to
        // load, so just close the app so that the user is re-prompted to log
        // in when they open it again.
        onError: `warnAndQuitApp`,
      });
      log.info(`Loaded OAuth callback URL into log in window`);

      // After the OAuth URL loads, the log in window will catch a redirect
      // to the HQ page and refresh the transparent window to update the
      // transparent window state and trigger the the HQ page to open
    }
  };
};

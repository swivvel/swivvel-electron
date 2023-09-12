import path from 'path';

import { app } from 'electron';
import log from 'electron-log';

import { ErrorCode, showGenericErrorMessage } from './utils';

/**
 * Configure URL protocol used for deep linking to the desktop app.
 *
 * Note: registering the `swivvel://` protocol only works on production.
 */
export default (deepLinkHandler: (url: string) => void): void => {
  log.info(`Configuring deep linking...`);

  if (process.defaultApp) {
    log.info(`process.defaultApp=true`);
    if (process.argv.length >= 2) {
      log.info(`Using argument ${process.argv[1]}`);
      app.setAsDefaultProtocolClient(`swivvel`, process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    log.info(`process.defaultApp=false`);
    app.setAsDefaultProtocolClient(`swivvel`);
  }

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on(`second-instance`, (event, commandLine, workingDirectory) => {
      const url = commandLine?.pop()?.slice(0, -1);

      log.info(`Deep link detected from second-instance: ${url}`);
      log.info(`commandLine=${commandLine}`);
      log.info(`workingDirectory=${workingDirectory}`);
      log.info(`url=${url}`);

      if (!url) {
        showGenericErrorMessage({
          errorCode: ErrorCode.UrlMissingOnSecondInstanceDeepLink,
        });
      } else {
        deepLinkHandler(url);
      }
    });

    app.on(`open-url`, (event, url) => {
      log.info(`Deep link detected from open-url: ${url}`);
      deepLinkHandler(url);
    });
  }

  log.info(`Configured deep linking`);
};

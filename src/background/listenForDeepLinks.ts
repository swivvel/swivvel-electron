import path from 'path';

import { app } from 'electron';
import log from 'electron-log';

import { ErrorCode, removeQueryParams, showGenericErrorMessage } from './utils';

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

      // Query params can be sensitive (e.g. OAuth codes)
      const urlForLog = url ? removeQueryParams(url) : null;

      log.info(`Deep link detected from second-instance: ${urlForLog}`);
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
      // Query params can be sensitive (e.g. OAuth codes)
      const urlForLog = url ? removeQueryParams(url) : null;

      log.info(`Deep link detected from open-url: ${urlForLog}`);

      deepLinkHandler(url);
    });
  }

  log.info(`Configured deep linking`);
};

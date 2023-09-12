import path from 'path';

import { app, dialog } from 'electron';
import log from 'electron-log';

/**
 * Configure URL protocol used for deep linking to the desktop app.
 */
export default async (): Promise<void> => {
  log.info(`Configuring deep linking...`);

  if (process.defaultApp) {
    log.info(`  process.defaultApp=true`);
    if (process.argv.length >= 2) {
      log.info(`  Using argument ${process.argv[1]}`);
      app.setAsDefaultProtocolClient(`swivvel`, process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    log.info(`  process.defaultApp=false`);
    app.setAsDefaultProtocolClient(`swivvel`);
  }

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on(`second-instance`, (event, commandLine, workingDirectory) => {
      console.log(`!!!!!!!!!! second-instance`);
      console.log(event);
      console.log(commandLine);
      console.log(workingDirectory);
      dialog.showErrorBox(
        `Welcome Back`,
        `You arrived from: ${commandLine?.pop()?.slice(0, -1)}`
      );
    });

    // Handle the protocol. In this case, we choose to show an Error Box.
    app.on(`open-url`, (event, url) => {
      dialog.showErrorBox(`Welcome Back`, `You arrived from: ${url}`);
    });
  }

  log.info(`Configured deep linking`);
};

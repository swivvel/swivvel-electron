import fs from 'fs';
import path from 'path';

import { BrowserWindow } from 'electron';
import log from 'electron-log';

export default async (meetWindow: BrowserWindow): Promise<void> => {
  log.info(`Patching getDisplayMedia...`);

  const filesContents = fs.readFileSync(
    path.join(__dirname, `getDisplayMedia.js`),
    `utf-8`
  );
  const matches = filesContents.match(/(async [\S\s]*);/);

  if (!matches) {
    throw new Error(`Could not find contents of getDisplayMedia.js`);
  }

  // The && 'force' is needed to prevent the following error:
  // UnhandledPromiseRejectionWarning: Error: An object could not be cloned.
  const patchCommand = `(window.navigator.mediaDevices.getDisplayMedia = ${matches[1]}) && 'force'`;

  await meetWindow.webContents.executeJavaScript(patchCommand);
};

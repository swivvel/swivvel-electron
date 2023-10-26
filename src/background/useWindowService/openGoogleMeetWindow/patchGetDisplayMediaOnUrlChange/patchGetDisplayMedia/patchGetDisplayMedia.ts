import path from 'path';

import { BrowserWindow } from 'electron';

import { Log, loadRawJsFromFile } from '../../../utils';

export default async (meetWindow: BrowserWindow, log: Log): Promise<void> => {
  log(`Patching getDisplayMedia...`);

  const fileContents = loadRawJsFromFile(
    path.join(__dirname, `getDisplayMedia.js`)
  );

  if (!fileContents) {
    throw new Error(`Could not find contents of getDisplayMedia.js`);
  }

  if (meetWindow.isDestroyed()) {
    log(`Google Meet window destroyed; not patching getDisplayMedia`);
    return;
  }

  // The && 'force' is needed to prevent the following error:
  // UnhandledPromiseRejectionWarning: Error: An object could not be cloned.
  const patchCommand = `(window.navigator.mediaDevices.getDisplayMedia = ${fileContents}) && 'force'`;

  await meetWindow.webContents.executeJavaScript(patchCommand);
};

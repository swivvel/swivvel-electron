import fs from 'fs';

import { BrowserWindow } from 'electron';
import log from 'electron-log';


export default async (meetWindow: BrowserWindow): Promise<void> => {
  log.info(`Patching getDisplayMedia...`);

  const filesContents = fs.readFileSync(`${__dirname}/getDisplayMedia.js`, `utf-8`);
  const matches = filesContents.match(/(async [\S\s]*);/);

  if (!matches) {
    throw new Error(`Could not find contents of getDisplayMedia.js`);
  }

  // Need to format the string like this to get the browser to execute it
  const patchCommand = `(window.navigator.mediaDevices.getDisplayMedia = ${matches[1]}) && 'force'`;

  meetWindow.webContents.executeJavaScript(patchCommand);
};

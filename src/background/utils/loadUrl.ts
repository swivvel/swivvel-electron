import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../types';

import quitApp from './quitApp';
import removeQueryParams from './removeQueryParams';
import showErrorMessage from './showErrorMessage';

export default async (
  url: string,
  browserWindow: BrowserWindow,
  state: State
): Promise<void> => {
  log.info(`Loading URL: ${url}`);

  try {
    await browserWindow.loadURL(url);
  } catch (err) {
    const urlNoParams = removeQueryParams(url);

    log.error(`Failed to load URL: ${urlNoParams}`);

    quitApp(state);
    showErrorMessage({
      description: `Unable to load page:\n${urlNoParams}\n\nCheck your internet connection and try again.`,
    });
  }
};

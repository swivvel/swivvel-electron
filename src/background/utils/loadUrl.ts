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
    log.error(`Failed to load URL: ${removeQueryParams(url)}`);
    quitApp(state);
    showErrorMessage({
      description: `Error while loading ${removeQueryParams(url)}`,
    });
  }
};

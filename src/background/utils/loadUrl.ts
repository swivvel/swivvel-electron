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

    // Eventually we may want to have better error handling if a URL fails to
    // load, but this is usually a fatal error so for now we're just killing
    // the app so that it doesn't exist in a broken state
    quitApp(state);

    showErrorMessage({
      description: `Unable to load page:\n${urlNoParams}\n\nCheck your internet connection and try again.`,
    });
  }
};

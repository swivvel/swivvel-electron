import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../types';

import getBrowserWindowName from './getBrowserWindowName';
import quitApp from './quitApp';
import removeQueryParams from './removeQueryParams';
import showErrorMessage from './showErrorMessage';

export default async (
  url: string,
  browserWindow: BrowserWindow,
  state: State
): Promise<void> => {
  const urlNoParams = removeQueryParams(url);

  const windowName = getBrowserWindowName(state, browserWindow.id);

  log.info(`Loading URL into window '${windowName}': ${urlNoParams}`);

  try {
    await browserWindow.loadURL(url);
  } catch (err) {
    log.error(`Failed to load URL into window '${windowName}': ${urlNoParams}`);

    // The user might have quit the app in the middle of the page load, in
    // which case we don't want to show the error message. Note that `quitApp`
    // sets `state.allowQuit`, so we have to read the value before we call
    // `quitApp`.
    //
    // The user might also have already completed authentication, at which point
    // it doesn't matter if the log in window encounters an error while loading
    // a URL.
    const isFatal =
      !state.allowQuit && (windowName !== `logIn` || !state.logInFlowCompleted);

    log.info(`Window name is ${windowName}`);
    log.info(`State allowQuit is ${state.allowQuit}`);
    log.info(`State logInFlowCompleted is ${state.logInFlowCompleted}`);

    if (!isFatal) {
      log.info(`Ignoring error because it is not fatal`);
      return;
    }

    log.error(`Error is fatal, quitting app and showing error message...`);

    // Eventually we may want to have better error handling if a URL fails to
    // load, but this is usually a fatal error so for now we're just killing
    // the app so that it doesn't exist in a broken state
    quitApp(state);

    showErrorMessage({
      description: `Unable to load page:\n${urlNoParams}\n\nCheck your internet connection and try again.`,
    });
  }
};

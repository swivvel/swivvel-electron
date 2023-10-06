import { BrowserWindow } from 'electron';
import log from 'electron-log';
import ms from 'ms';

import { State } from '../types';

import getBrowserWindowName from './getBrowserWindowName';
import quitApp from './quitApp';
import removeQueryParams from './removeQueryParams';
import showErrorMessage from './showErrorMessage';
import sleep from './sleep';

const loadUrl = async (
  url: string,
  browserWindow: BrowserWindow,
  state: State,
  options?: { retry: boolean },
  retryState?: { retryCount: number; retryCurrentBackoffMs: number }
): Promise<void> => {
  const urlNoParams = removeQueryParams(url);

  const windowName = getBrowserWindowName(state, browserWindow.id);

  log.info(`Loading URL into window '${windowName}': ${urlNoParams}`);

  try {
    await browserWindow.loadURL(url);
  } catch (err) {
    log.error(`Failed to load URL into window '${windowName}': ${urlNoParams}`);

    if (options?.retry) {
      if (browserWindow.isDestroyed()) {
        log.info(`Skipping retry: window '${windowName}' is destroyed`);
      } else {
        let retryCount = retryState?.retryCount || 0;
        let retryCurrentBackoffMs =
          retryState?.retryCurrentBackoffMs || ms(`1 second`);

        // It is common for the URL to have temporary errors, such as when a
        // user's computer wakes up after being suspended. Perform the retries
        // in a tight loop in the beginning so that the window loads more
        // quickly if the error is temporary, then back off to a slower retry
        // rate to avoid putting too much load on our servers or the user's
        // system.
        retryCount += 1;
        retryCurrentBackoffMs =
          retryCount > 60 ? ms(`1 minute`) : ms(`5 seconds`);

        log.info(
          `Retrying load URL in ${
            retryCurrentBackoffMs / 1000
          } seconds (retryCount=${retryCount})...`
        );

        await sleep(retryCurrentBackoffMs);
        await loadUrl(
          url,
          browserWindow,
          state,
          { retry: true },
          {
            retryCount,
            retryCurrentBackoffMs,
          }
        );

        return;
      }
    }

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

export default loadUrl;

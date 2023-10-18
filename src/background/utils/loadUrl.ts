import { BrowserWindow } from 'electron';
import ms from 'ms';

import { State } from '../types';

import getBrowserWindowName from './getBrowserWindowName';
import quitApp from './quitApp';
import removeQueryParams from './removeQueryParams';
import showErrorMessage from './showErrorMessage';
import sleep from './sleep';

type OnError =
  | `retry`
  | `destroyWindow`
  | `warnAndDestroyWindow`
  | `warnAndQuitApp`;

const loadUrl = async (
  url: string,
  browserWindow: BrowserWindow,
  state: State,
  log: (msg: string) => void,
  options: { onError: OnError },
  retryState?: { retryCount: number; retryCurrentBackoffMs: number }
): Promise<void> => {
  const urlNoParams = removeQueryParams(url);

  const windowName = getBrowserWindowName(state, browserWindow.id);

  log(`Loading URL: ${urlNoParams}`);

  try {
    await browserWindow.loadURL(url);
  } catch (err) {
    log(`Failed to load URL: ${urlNoParams}`);
    log(`onError=${options.onError}`);

    if (browserWindow.isDestroyed()) {
      log(`Skipping error handling: window is destroyed`);
      return;
    }

    if (options.onError === `retry`) {
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

      log(
        `Retrying load URL in ${
          retryCurrentBackoffMs / 1000
        } seconds (retryCount=${retryCount})...`
      );

      await sleep(retryCurrentBackoffMs);
      await loadUrl(url, browserWindow, state, log, options, {
        retryCount,
        retryCurrentBackoffMs,
      });

      return;
    }

    if (options.onError === `destroyWindow`) {
      log(`Destroying window`);
      browserWindow.destroy();
      if (windowName) {
        state.windows[windowName] = null;
      }
      return;
    }

    if (options.onError === `warnAndDestroyWindow`) {
      log(`Warning and closing window`);
      browserWindow.destroy();
      if (windowName) {
        state.windows[windowName] = null;
      }
      showErrorMessage({
        description: `Unable to load page:\n${urlNoParams}\n\nCheck your internet connection and try again.`,
      });
      return;
    }

    if (options.onError === `warnAndQuitApp`) {
      // The user might have quit the app in the middle of the page load, in
      // which case we don't want to show the error message. Note that `quitApp`
      // sets `state.allowQuit`, so we have to read the value before we call
      // `quitApp`.
      //
      // The user might also have already completed authentication, at which
      // point it doesn't matter if the log in window encounters an error while
      // loading a URL.
      const isFatal =
        !state.allowQuit &&
        (windowName !== `logIn` || !state.logInFlowCompleted);

      log(`state.allowQuit=${state.allowQuit}`);
      log(`state.logInFlowCompleted=${state.logInFlowCompleted}`);

      if (!isFatal) {
        log(`Ignoring error because it is not fatal`);
        return;
      }

      log(`Error is fatal, quitting app and showing error message...`);

      // Eventually we may want to have better error handling if a URL fails to
      // load, but this is usually a fatal error so for now we're just killing
      // the app so that it doesn't exist in a broken state
      quitApp(state);

      showErrorMessage({
        description: `Unable to load page:\n${urlNoParams}\n\nCheck your internet connection and try again.`,
      });

      return;
    }

    const exhaustiveCheck: never = options.onError;
    return exhaustiveCheck;
  }
};

export default loadUrl;

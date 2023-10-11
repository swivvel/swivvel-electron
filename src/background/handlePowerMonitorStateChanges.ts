import { powerMonitor } from 'electron';
import log from 'electron-log';
import ms from 'ms';

import { State } from './types';
import { WindowService } from './useWindowService';
import { quitApp } from './utils';

const TEN_MIN_MS = ms(`10 minutes`);

export default (state: State, windowService: WindowService): void => {
  // Closing the windows 10 minutes after lock/sleep and re-opening
  // them (if already closed) on resume solves (or attempts to solve) a
  // handful of issues:
  //
  // 1. We have observed (in a very small subset of users) the app getting into
  //    a weird state when a Mac is locked overnight. Opening the developer
  //    tools shows blank Elements and Console tabs, and clicking the "Join"
  //    button shows the spinner but hangs.
  // 2. We have received various error alerts at late times of the night that
  //    seem to indicate that the app is unable to fetch data from our back end.
  //    Our assumption is that the computer is asleep and this is causing some
  //    kind of connectivity problem.
  // 3. Many users keep their computer on overnight, but in sleep mode or
  //    locked. Closing and re-opening the windows can make sure that the client
  //    has the latest version of the web app code when the user unlocks/resumes
  //    their computer in the morning.
  // 4. If a user has no activity over the weekend, Auth0 will expire their
  //    session. We don't currently handle this very well - the app can end
  //    up displaying an "Access Denied" page. Closing and re-opening the
  //    windows will make sure that an unauthenticated user is presented with
  //    the log in page when they unlock/resume their computer on Monday
  //    morning.
  //

  let timeout: NodeJS.Timeout | null = null;

  powerMonitor.on(`lock-screen`, () => {
    log.info(`Power monitor: lock-screen detected`);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      windowService.closeAllWindows();

      timeout = null;
    }, TEN_MIN_MS);
  });
  powerMonitor.on(`suspend`, () => {
    log.info(`Power monitor: suspend detected`);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      windowService.closeAllWindows();

      timeout = null;
    }, TEN_MIN_MS);
  });
  powerMonitor.on(`unlock-screen`, () => {
    log.info(`Power monitor: unlock-screen detected`);

    if (timeout) {
      clearTimeout(timeout);
    } else {
      windowService.openTransparentWindow();
    }
  });
  powerMonitor.on(`resume`, () => {
    log.info(`Power monitor: resume detected`);

    if (timeout) {
      clearTimeout(timeout);
    } else {
      windowService.openTransparentWindow();
    }
  });

  // Without this, Macs would hang when trying to shut down because the
  // Swivvel app would never quit
  powerMonitor.on(`shutdown`, () => {
    log.info(`Power monitor: shutdown detected`);
    quitApp(state);
  });
};

import { State } from '../types';
import { TrayService } from '../useTrayService';
import { getSiteUrl, loadUrl } from '../utils';

import { WindowOpenRequestHandler } from './getWindowOpenRequestHandler';
import openHqWindow from './openHqWindow';

interface Args {
  state: State;
  trayService: TrayService;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

/**
 * Load the settings page URL into the HQ window.
 */
export default async ({
  state,
  trayService,
  windowOpenRequestHandler,
}: Args): Promise<void> => {
  const hqWindow = await openHqWindow({
    show: true,
    state,
    trayService,
    windowOpenRequestHandler,
  });

  await loadUrl(
    `${getSiteUrl()}/?p=/office/<companyId>/settings/users`,
    hqWindow,
    state,
    // Since the settings page is opened from a user action, we must display
    // an error message to inform the user that their action failed. We
    // destroy the window so that it gets recreated when the user tries to
    // open it again.
    { onError: `warnAndDestroyWindow` }
  );
};

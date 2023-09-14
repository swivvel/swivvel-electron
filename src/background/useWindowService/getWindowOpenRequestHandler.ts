import { shell } from 'electron';
import log from 'electron-log';

import {
  getSiteUrl,
  removeQueryParams,
  shouldOpenUrlInBrowser,
} from '../utils';

export type WindowOpenRequestHandler = ({
  url,
}: {
  url: string;
}) => { action: `allow` } | { action: `deny` };

/**
 * Handle requests from the renderer process to open a specific Electron window.
 */
export default (callbacks: {
  onHqPageRequested: () => void;
  onLogInPageRequested: () => void;
}): WindowOpenRequestHandler => {
  return ({ url }) => {
    log.info(`Caught URL opened by window: ${url}`);

    const siteUrl = getSiteUrl();

    // See main repo README for description of desktop log in flow
    if (removeQueryParams(url) === `${siteUrl}/electron/login`) {
      log.info(`Log in page requested`);
      callbacks.onLogInPageRequested();
      return { action: `deny` };
    }

    if (removeQueryParams(url) === `${siteUrl}/electron/hq`) {
      log.info(`HQ page requested`);
      callbacks.onHqPageRequested();
      return { action: `deny` };
    }

    if (shouldOpenUrlInBrowser(url)) {
      log.info(`Opening URL in browser`);
      shell.openExternal(url);
      return { action: `deny` };
    }

    log.info(`Opening URL in Electron`);
    return { action: `allow` };
  };
};

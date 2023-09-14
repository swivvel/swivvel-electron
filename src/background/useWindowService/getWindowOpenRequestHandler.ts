import { shell } from 'electron';
import log from 'electron-log';

import { removeQueryParams } from '../utils';

export type WindowOpenRequestHandler = ({
  url,
}: {
  url: string;
}) => { action: `allow` } | { action: `deny` };

/**
 * Handle requests from the renderer process to open a specific Electron window.
 */
export default (
  siteUrl: string,
  callbacks: {
    onHqPageRequested: () => void;
    onLogInPageRequested: () => void;
  }
): WindowOpenRequestHandler => {
  return ({ url }) => {
    log.info(`Caught URL opened by log in window: ${url}`);

    if (url.startsWith(siteUrl)) {
      log.info(`User opening internal URL`);

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

      // We are temporarily serving some HTML static files for support pages.
      // Eventually these will move to the public site but for now we want to
      // make sure they open in the browser.
      if (url.endsWith(`.html`)) {
        log.info(`Is HTML page, opening in browser`);
        shell.openExternal(url);
        return { action: `deny` };
      }

      log.info(`Opening internally`);
      return { action: `allow` };
    }

    log.info(`User opening external URL, opening in browser`);

    // Open all external URLs in the browser since we don't want users doing
    // general web browsing in the desktop app.
    shell.openExternal(url);
    return { action: `deny` };
  };
};

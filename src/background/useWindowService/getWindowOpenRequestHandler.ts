import { shell } from 'electron';
import log from 'electron-log';

import {
  getSiteUrl,
  parseQueryParams,
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
  onGoogleMeetRequested: (
    podId: string | null,
    meetingUrl: string | null
  ) => void;
  onHqPageRequested: () => void;
  onLogInPageRequested: () => void;
  onSettingsPageRequested: () => void;
  onSetupPageRequested: () => void;
}): WindowOpenRequestHandler => {
  return ({ url }) => {
    log.info(`Caught URL opened by window: ${url}`);

    const siteUrl = getSiteUrl();

    if (removeQueryParams(url) === `${siteUrl}/electron/google-meet`) {
      log.info(`Create Google Meet page requested`);
      const urlParams = parseQueryParams(url);
      log.info(`URL params=${JSON.stringify(urlParams)}`);
      const podId = urlParams.podId;
      log.info(`Pod ID=${podId}`);
      const meetingUrl = urlParams.meetingUrl;
      log.info(`Meeting URL=${meetingUrl}`);
      callbacks.onGoogleMeetRequested(podId, meetingUrl || null);
      return { action: `deny` };
    }

    if (removeQueryParams(url) === `${siteUrl}/electron/hq`) {
      log.info(`HQ page requested`);
      callbacks.onHqPageRequested();
      return { action: `deny` };
    }

    // See main repo README for description of desktop log in flow
    if (removeQueryParams(url) === `${siteUrl}/electron/login`) {
      log.info(`Log in page requested`);
      callbacks.onLogInPageRequested();
      return { action: `deny` };
    }

    if (removeQueryParams(url) === `${siteUrl}/electron/settings`) {
      log.info(`Settings page requested`);
      callbacks.onSettingsPageRequested();
      return { action: `deny` };
    }

    if (removeQueryParams(url) === `${siteUrl}/electron/setup`) {
      log.info(`Setup page requested`);
      callbacks.onSetupPageRequested();
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

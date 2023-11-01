import { shell } from 'electron';

import {
  getSiteUrl,
  parseQueryParams,
  removeQueryParams,
  shouldOpenUrlInBrowser,
} from '../utils';

import { Log } from './utils';

export type WindowOpenRequestHandler = (
  url: string,
  log: Log
) => { action: `allow` } | { action: `deny` };

/**
 * Handle requests from the renderer process to open a specific Electron window.
 */
export default (callbacks: {
  onGoogleMeetRequested: (
    podId: string | null,
    meetingUrl: string | null
  ) => void;
  onHqRequested: () => void;
  onScreenShareRequested: (
    companyId: string,
    employeeId: string,
    employeeName: string | null,
    podId: string
  ) => void;
  onSettingsRequested: () => void;
  onSetupRequested: () => void;
}): WindowOpenRequestHandler => {
  return (url, log) => {
    log(`Caught URL opened by window: ${url}`);

    const siteUrl = getSiteUrl();

    if (removeQueryParams(url) === `${siteUrl}/electron/google-meet`) {
      log(`Google Meet requested`);
      const urlParams = parseQueryParams(url);
      const podId = urlParams.get(`podId`) || null;
      const meetingUrl = urlParams.get(`meetingUrl`) || null;
      log(`podId=${podId}`);
      log(`meetingUrl=${meetingUrl}`);
      callbacks.onGoogleMeetRequested(podId, meetingUrl);
      return { action: `deny` };
    }

    if (removeQueryParams(url) === `${siteUrl}/electron/hq`) {
      log(`HQ page requested`);
      callbacks.onHqRequested();
      return { action: `deny` };
    }

    if (removeQueryParams(url) === `${siteUrl}/electron/screen-share`) {
      log(`Screen share page requested`);
      const urlParams = parseQueryParams(url);
      const companyId = urlParams.get(`companyId`);
      const employeeId = urlParams.get(`employeeId`);
      const employeeName = urlParams.get(`employeeName`) || null;
      const podId = urlParams.get(`podId`);
      log(`companyId=${companyId}`);
      log(`employeeId=${employeeId}`);
      log(`employeeName=${employeeName}`);
      log(`podId=${podId}`);
      if (!companyId || !employeeId || !podId) {
        throw new Error(`Missing required query params`);
      }
      callbacks.onScreenShareRequested(
        companyId,
        employeeId,
        employeeName,
        podId
      );
      return { action: `deny` };
    }

    if (removeQueryParams(url) === `${siteUrl}/electron/settings`) {
      log(`Settings page requested`);
      callbacks.onSettingsRequested();
      return { action: `deny` };
    }

    if (removeQueryParams(url) === `${siteUrl}/electron/setup`) {
      log(`Setup page requested`);
      callbacks.onSetupRequested();
      return { action: `deny` };
    }

    if (shouldOpenUrlInBrowser(url)) {
      log(`Opening URL in browser`);
      shell.openExternal(url);
      return { action: `deny` };
    }

    log(`Opening URL in Electron`);
    return { action: `allow` };
  };
};

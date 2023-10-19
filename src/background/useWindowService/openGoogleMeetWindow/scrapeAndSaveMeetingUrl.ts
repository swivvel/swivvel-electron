import { BrowserWindow } from 'electron';

import { Log } from '../utils';

export default (window: BrowserWindow, log: Log): Promise<string> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (window.isDestroyed()) {
        log(`Create Google Meet window destroyed, stopping interval`);
        clearInterval(interval);
        reject();
        return;
      }

      let rawMeetingUrl: unknown;

      // Sometimes the user is prompted to sign in to their Google account
      // before the `/getalink` page loads. If this happens, the document
      // will not containing the meeting link and the JS will throw an error.
      try {
        rawMeetingUrl = await window.webContents.executeJavaScript(
          `document.querySelector('[data-meeting-link]').dataset.meetingLink`
        );
      } catch (err) {
        rawMeetingUrl = null;
      }

      if (rawMeetingUrl && typeof rawMeetingUrl === `string`) {
        const meetingUrl = rawMeetingUrl.startsWith(`http`)
          ? rawMeetingUrl
          : `https://${rawMeetingUrl}`;

        clearInterval(interval);
        resolve(meetingUrl);
      }
    }, 50);
  });
};

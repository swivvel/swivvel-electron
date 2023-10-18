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

      const rawMeetingUrl = await window.webContents.executeJavaScript(
        `document.querySelector('[data-meeting-link]').dataset.meetingLink`
      );

      if (rawMeetingUrl) {
        const meetingUrl = rawMeetingUrl.startsWith(`http`)
          ? rawMeetingUrl
          : `https://${rawMeetingUrl}`;

        resolve(meetingUrl);

        clearInterval(interval);
      }
    }, 50);
  });
};

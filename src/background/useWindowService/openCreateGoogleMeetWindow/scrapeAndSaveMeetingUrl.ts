import { BrowserWindow } from 'electron';
import log from 'electron-log';

export default (
  window: BrowserWindow,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (window.isDestroyed()) {
        log.info(`Create Google Meet window destroyed, stopping interval`);
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

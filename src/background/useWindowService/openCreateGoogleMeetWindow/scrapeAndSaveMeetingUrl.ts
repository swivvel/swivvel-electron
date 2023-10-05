import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../../types';

export default (window: BrowserWindow, state: State, podId: string): void => {
  log.info(`Scraping and saving meeting URL for pod ${podId}...`);

  const interval = setInterval(async () => {
    if (window.isDestroyed()) {
      log.info(`Create Google Meet window destroyed, stopping interval`);
      clearInterval(interval);
      return;
    }

    const rawMeetingUrl = await window.webContents.executeJavaScript(
      `document.querySelector('[data-meeting-link]').dataset.meetingLink`
    );

    if (rawMeetingUrl) {
      const meetingUrl = rawMeetingUrl.startsWith(`http`)
        ? rawMeetingUrl
        : `https://${rawMeetingUrl}`;

      log.info(`Found meeting URL for pod ${podId}: ${meetingUrl}`);

      if (state.windows.transparent) {
        log.info(`Sending meeting URL to transparent window...`);
        state.windows.transparent.webContents.send(
          `meetBreakoutUrlCreatedForPod`,
          podId,
          meetingUrl
        );
      } else {
        log.info(`Transparent window not found, could not save meeting URL`);
      }

      log.info(`Clicking join...`);
      await window.webContents.executeJavaScript(
        `[...document.querySelectorAll('button')].find(button => button.textContent.toLowerCase().includes('join now'))?.click()`
      );

      log.info(`Closing window...`);
      window.close();

      clearInterval(interval);
    }
  }, 50);
};

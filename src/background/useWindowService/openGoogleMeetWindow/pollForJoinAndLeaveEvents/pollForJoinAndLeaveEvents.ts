import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../../../types';

import isInMeeting from './isInMeeting';
import triggerMeetingJoinedEvent from './triggerMeetingJoinedEvent';
import triggerMeetingLeftEvent from './triggerMeetingLeftEvent';

export default (googleMeetWindow: BrowserWindow, state: State): void => {
  let currentMeetingUrl: string | null = null;

  const interval = setInterval(async () => {
    if (googleMeetWindow.isDestroyed()) {
      log.info(`Google meeting window destroyed; stopping polling for events`);
      clearInterval(interval);
      if (currentMeetingUrl) {
        triggerMeetingLeftEvent(state, currentMeetingUrl);
        currentMeetingUrl = null;
      }
      return;
    }

    const inMeeting = await isInMeeting(googleMeetWindow);

    if (inMeeting && !currentMeetingUrl) {
      currentMeetingUrl = googleMeetWindow.webContents.getURL();
      triggerMeetingJoinedEvent(state, currentMeetingUrl);
    } else if (!inMeeting && currentMeetingUrl) {
      triggerMeetingLeftEvent(state, currentMeetingUrl);
      currentMeetingUrl = null;
    }
  }, 1000);
};

import { BrowserWindow } from 'electron';

import { State } from '../../../types';
import { Log } from '../../utils';

import isInMeeting from './isInMeeting';
import triggerMeetingJoinedEvent from './triggerMeetingJoinedEvent';
import triggerMeetingLeftEvent from './triggerMeetingLeftEvent';

export default (
  googleMeetWindow: BrowserWindow,
  state: State,
  log: Log
): void => {
  let currentMeetingUrl: string | null = null;

  const interval = setInterval(async () => {
    if (googleMeetWindow.isDestroyed()) {
      log(`Google meeting window destroyed; stopping polling for events`);
      clearInterval(interval);
      if (currentMeetingUrl) {
        triggerMeetingLeftEvent(state, currentMeetingUrl, log);
        currentMeetingUrl = null;
      }
      return;
    }

    const inMeeting = await isInMeeting(googleMeetWindow);

    if (inMeeting && !currentMeetingUrl) {
      currentMeetingUrl = googleMeetWindow.webContents.getURL();
      triggerMeetingJoinedEvent(state, currentMeetingUrl, log);
    } else if (!inMeeting && currentMeetingUrl) {
      triggerMeetingLeftEvent(state, currentMeetingUrl, log);
      currentMeetingUrl = null;
    }
  }, 1000);
};

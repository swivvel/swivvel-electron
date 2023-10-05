import { loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getCreateGoogleMeetWindowBrowserOptions from './getCreateGoogleMeetWindowBrowserOptions';
import patchGetDisplayMedia from './patchGetDisplayMedia';
import pollForJoinAndLeaveEvents from './pollForJoinAndLeaveEvents';
import scrapeAndSaveMeetingUrl from './scrapeAndSaveMeetingUrl';
import triggerMeetingCreatedEvent from './triggerMeetingCreatedEvent';
import { OpenGoogleMeetWindow } from './types';

const openGoogleMeetWindow: OpenGoogleMeetWindow = async (args) => {
  const { podId, meetingUrl, state, windowOpenRequestHandler } = args;

  const options = getCreateGoogleMeetWindowBrowserOptions();

  return openBrowserWindow(
    state,
    `createGoogleMeet`,
    options,
    async (window) => {
      window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

      window.webContents.on(`will-navigate`, async (event) => {
        // Prevent click of rejoin button from opening in new tab
        if (event.url.startsWith(window.webContents.getURL())) {
          event.preventDefault();
          await loadUrl(event.url, window, state);
          await patchGetDisplayMedia(window);
        }
      });

      configureCloseHandler(window, state);

      let meetingUrlToOpen: string | null = meetingUrl;

      if (!meetingUrlToOpen) {
        await loadUrl(`https://meet.google.com/getalink`, window, state);

        meetingUrlToOpen = await scrapeAndSaveMeetingUrl(window);

        if (podId){
          triggerMeetingCreatedEvent(state, podId, meetingUrlToOpen);
        }
      }

      await loadUrl(
        meetingUrlToOpen,
        window,
        state
      );

      // The get a link window will try to resize itself to be small, so we
      // need to create the window with a minimum size equal to the desired
      // size. Once we've loaded the meeting we can lower the minimum size
      // to something reasonable
      window.setMinimumSize(200, 200);

      pollForJoinAndLeaveEvents(window, state);

      //TODO - if everyone leaves, call ends, after 60 seconds i am taken to
      // home screen which pops a new tab and is annoying

      await patchGetDisplayMedia(window);

      return window;
    }
  );
};

export default openGoogleMeetWindow;

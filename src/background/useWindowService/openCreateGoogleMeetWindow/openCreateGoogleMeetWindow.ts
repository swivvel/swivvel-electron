import { loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getCreateGoogleMeetWindowBrowserOptions from './getCreateGoogleMeetWindowBrowserOptions';
import scrapeAndSaveMeetingUrl from './scrapeAndSaveMeetingUrl';
import { OpenCreateGoogleMeetWindow } from './types';

const openCreateGoogleMeetWindow: OpenCreateGoogleMeetWindow = async (args) => {
  const { podId, state, windowOpenRequestHandler } = args;

  const options = getCreateGoogleMeetWindowBrowserOptions();

  return openBrowserWindow(
    state,
    `createGoogleMeet`,
    options,
    async (window) => {
      window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

      configureCloseHandler(window, state);

      await loadUrl(`https://meet.google.com/getalink`, window, state);

      scrapeAndSaveMeetingUrl(window, state, podId);

      return window;
    }
  );
};

export default openCreateGoogleMeetWindow;

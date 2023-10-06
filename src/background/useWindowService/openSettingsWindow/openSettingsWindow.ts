import { getSiteUrl, loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import getSettingsWindowBrowserOptions from './getSettingsWindowBrowserOptions';
import { OpenHqWindow } from './types';

const openSettingsWindow: OpenHqWindow = async (args) => {
  const { companyId, state, windowOpenRequestHandler } = args;

  const options = getSettingsWindowBrowserOptions();

  return openBrowserWindow(state, `settings`, options, async (window) => {
    window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    await loadUrl(
      `${getSiteUrl()}/office/${companyId}/settings/users`,
      window,
      state
    );

    return window;
  });
};

export default openSettingsWindow;

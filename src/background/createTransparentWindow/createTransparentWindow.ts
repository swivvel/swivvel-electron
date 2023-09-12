import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../types';
import { isLinux, loadInternalUrl, sleep } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import configureWindowOpenHandler from './configureWindowOpenHandler';
import makeBrowserWindow from './makeBrowserWindow';
import pollForMouseEvents from './pollForMouseEvents';
import showOnAllWorkspaces from './showOnAllWorkspaces';

export default async (
  state: State,
  preloadPath: string,
  siteUrl: string,
  callbacks: {
    onLogInPageOpened: () => void;
  }
): Promise<BrowserWindow> => {
  log.info(`Creating transparent window...`);

  // Transparent windows don't work on Linux without some hacks
  // like this short delay
  // See: https://github.com/electron/electron/issues/15947
  if (isLinux()) {
    await sleep(1000);
  }

  const transparentWindow = makeBrowserWindow(preloadPath);

  showOnAllWorkspaces(transparentWindow);
  configureWindowOpenHandler(transparentWindow, siteUrl, callbacks);
  configureCloseHandler(transparentWindow, state);
  pollForMouseEvents(transparentWindow);

  await loadInternalUrl(transparentWindow, siteUrl, `/notifications`);

  log.info(`Created transparent window`);

  return transparentWindow;
};

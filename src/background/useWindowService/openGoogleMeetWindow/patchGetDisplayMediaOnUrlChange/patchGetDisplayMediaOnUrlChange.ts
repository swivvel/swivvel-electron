import { BrowserWindow } from 'electron';

import { Log } from '../../utils';

import patchGetDisplayMedia from './patchGetDisplayMedia';

export default async (window: BrowserWindow, log: Log): Promise<void> => {
  // Out of the box, screen-sharing within the Meet does not work. To get around
  // this, we need to patch the window.getDisplayMedia function, which is
  // called when screen-sharing is requested. The patched function will invoke
  // a custom Electron IPC handler, exposed in the preload script, which will
  // then invoke the native Electron getDesktopSources function. That will
  // return a list of shareable windows, which will be passed back to
  // the Meet window, which will then display them in the screen-sharing
  // dialog. We injected the dialog into the DOM as a part of the patch to
  // getDisplayMedia.
  // Inspired by: https://github.com/nativefier/nativefier/issues/927
  await patchGetDisplayMedia(window, log);

  // Make sure we continue to patch getDisplayMedia if the page reloads or if
  // the user is taken to another page (e.g. login page)
  window.webContents.on(`did-finish-load`, async () => {
    await patchGetDisplayMedia(window, log);
  });
};

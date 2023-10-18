import { BrowserWindow } from 'electron';

import { Log } from '../utils';

export default (transparentWindow: BrowserWindow, log: Log): void => {
  log(`Configuring transparent window to show on all workspaces...`);

  transparentWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
    // See: https://github.com/electron/electron/issues/25368
    skipTransformProcessType: true,
  });
};

import { BrowserWindow } from 'electron';
import log from 'electron-log';

export default (transparentWindow: BrowserWindow): void => {
  log.info(`Configuring transparent window to show on all workspaces...`);

  transparentWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
    // See: https://github.com/electron/electron/issues/25368
    skipTransformProcessType: true,
  });
};

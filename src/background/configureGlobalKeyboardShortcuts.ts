import { globalShortcut } from 'electron';
import log from 'electron-log';

import { State } from './types';

export default (state: State): void => {
  log.info(`Registering mute toggle shortcut (Alt+Shift+U)...`);

  const muteToggleRegistered = globalShortcut.register(`Alt+Shift+U`, () => {
    log.info(`Keyboard shortcut pressed: Alt+Shift+U`);
    const transparentWindow = state.windows.transparent;

    if (transparentWindow && !transparentWindow.isDestroyed()) {
      log.info(`Sending 'muteToggled' event to transparent window`);
      transparentWindow.webContents.send(`muteToggled`);
    }
  });

  if (muteToggleRegistered) {
    log.info(`Registered mute toggle shortcut`);
  } else {
    log.info(`Failed to register mute toggle shortcut`);
  }
};

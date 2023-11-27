import { globalShortcut } from 'electron';
import log from 'electron-log';

import { State } from './types';

export default (state: State): void => {
  log.info(`Registering mute toggle shortcut (Alt+Shift+U)...`);

  // We reference this shortcut in the Mute/Unmute button tooltip, so it's
  // important that if we change this shortcut we also update the tooltip there
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

import log from 'electron-log';

import { State } from '../../types';

export default (
  state: State,
  browserWindowName: keyof State['windows']
): void => {
  log.info(`Close window: ${browserWindowName}`);

  const existingWindow = state.windows[browserWindowName];

  if (!existingWindow) {
    log.info(`No existing window found: ${browserWindowName}`);
    return;
  }

  if (existingWindow.isDestroyed()) {
    log.info(`Window already destroyed: ${browserWindowName}`);
    state.windows[browserWindowName] = null;
    return;
  }

  log.info(`Destroying window: ${browserWindowName}`);
  existingWindow.destroy();
  state.windows[browserWindowName] = null;
};

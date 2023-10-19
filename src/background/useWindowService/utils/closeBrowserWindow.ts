import log from 'electron-log';

import { State } from '../../types';

export default (
  state: State,
  browserWindowName: keyof State['windows']
): void => {
  log.info(`[${browserWindowName}] Close window`);

  const existingWindow = state.windows[browserWindowName];

  if (!existingWindow) {
    log.info(`[${browserWindowName}] No existing window found`);
    return;
  }

  if (existingWindow.isDestroyed()) {
    log.info(`[${browserWindowName}] Window already destroyed`);
    state.windows[browserWindowName] = null;
    return;
  }

  log.info(`[${browserWindowName}] Destroying window`);
  existingWindow.destroy();
  state.windows[browserWindowName] = null;
};

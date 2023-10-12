import { app } from 'electron';
import log from 'electron-log';

import { isProduction } from './utils';

export default (): void => {
  // Electron stores everything related to the app (cache, local storage,
  // databases, logs, etc.) in a directory in the user's home directory.
  // Prevent dev from colliding with prod by adding a suffix.
  if (!isProduction()) {
    app.setPath(`userData`, `${app.getPath(`userData`)}-development`);
  }

  log.info(`User Data: ${app.getPath(`userData`)}`);
};

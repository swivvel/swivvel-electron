import path from 'path';

import { app } from 'electron';
import log from 'electron-log';

import { isProduction } from './utils';

export default (): void => {
  if (!isProduction()) {
    // Electron stores everything related to the app (cache, local storage,
    // databases, logs, etc.) in a directory in the user's home directory.
    // Prevent dev from colliding with prod by adding a suffix.
    app.setPath(`userData`, `${app.getPath(`userData`)}-development`);

    // Make sure the main logger writes to the new user data path
    log.transports.file.resolvePath = (): string => {
      return path.join(app.getPath(`userData`), `logs`, `main.log`);
    };
  }
};

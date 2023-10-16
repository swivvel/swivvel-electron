import path from 'path';

import { app } from 'electron';
import log from 'electron-log';

import { isProduction } from './utils';

export default (): void => {
  if (!isProduction()) {
    const userDataProd = app.getPath(`userData`);
    const logsProd = app.getPath(`logs`);

    // The paths that Electron uses for storing app data are derived from
    // the app name, Swivvel. To prevent development data from colliding
    // with prod data, we add a suffix.
    const userDataDev = userDataProd.replace(`Swivvel`, `Swivvel-development`);
    const logsDev = logsProd.replace(`Swivvel`, `Swivvel-development`);

    app.setPath(`userData`, userDataDev);
    app.setPath(`logs`, logsDev);

    // Make sure the main logger writes to the new log path
    log.transports.file.resolvePath = (): string => {
      return path.join(logsDev, `main.log`);
    };
  }
};

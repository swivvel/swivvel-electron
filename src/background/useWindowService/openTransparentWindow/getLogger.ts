import path from 'path';

import { app } from 'electron';
import log from 'electron-log';

let globalLogger: log.ElectronLog | null = null;

/**
 * Get a logger that writes to a different file than the main logger.
 */
export default (name: string): log.ElectronLog => {
  if (!globalLogger) {
    log.info(`Initializing logger: ${name}`);

    globalLogger = log.create(name);
    globalLogger.transports.console.level = false;
    globalLogger.transports.file.resolvePath = (): string => {
      return path.join(app.getPath(`userData`), `logs`, `${name}.log`);
    };
  }

  return globalLogger;
};

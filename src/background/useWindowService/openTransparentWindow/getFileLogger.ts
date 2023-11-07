import path from 'path';

import { app } from 'electron';
import log from 'electron-log';

const isFileTransport = (
  transport: log.Transport
): transport is log.FileTransport => {
  return Boolean((transport as log.FileTransport).resolvePathFn);
};

let globalLogger: log.Logger | null = null;

/**
 * Get a logger that writes to a different file than the main logger.
 */
export default (name: string): log.Logger => {
  if (!globalLogger) {
    const logPath = path.join(app.getPath(`logs`), `${name}.log`);

    log.info(`Initializing logger '${name}' at path ${logPath}`);

    globalLogger = log.create({ logId: name });

    if (globalLogger.transports.console) {
      globalLogger.transports.console.level = false;
    }

    if (
      globalLogger.transports.file &&
      isFileTransport(globalLogger.transports.file)
    ) {
      globalLogger.transports.file.resolvePathFn = (): string => {
        return logPath;
      };
    }
  }

  return globalLogger;
};

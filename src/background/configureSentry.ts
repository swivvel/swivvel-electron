import path from 'path';

import * as Sentry from '@sentry/electron/main';
import log from 'electron-log';

import { isProduction } from './utils';

export default (): void => {
  Sentry.init({
    dsn: isProduction()
      ? `https://2dc312dd96e84f3ca06fa0e5e3f96c5e@o4504796289433600.ingest.sentry.io/4504796469657600`
      : `https://c63ffcba511c4cdebd5365c4cb2990f6@o4504796289433600.ingest.sentry.io/4504796459171840`,
  });

  Sentry.setTag(`swivvel.service`, `electron`);

  // Attach the log files to every Sentry alert
  Sentry.addGlobalEventProcessor((event, hint) => {
    log.info(`Sentry addGlobalEventProcessor called`);

    // It is important for the Sentry alert to still get reported even if
    // we fail to attach the log files
    try {
      log.info(`Reading all log files...`);

      const allLogs = log.transports.file.readAllLogs();
      const paths = allLogs.map((logFile) => {
        return logFile.path;
      });

      if (!isProduction()) {
        log.info(
          `Not attaching log files in development: ${JSON.stringify(paths)}`
        );
      } else {
        log.info(`Attaching log files: ${JSON.stringify(paths)}`);

        hint.attachments = allLogs.map((logFile) => {
          return {
            filename: path.basename(logFile.path),
            data: logFile.lines.join(`\n`),
          };
        });
      }
    } catch (err) {
      log.error(`Error reading log files: ${err}`);
    }

    return event;
  });
};

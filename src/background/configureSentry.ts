import fs from 'fs';

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
    log.info(`Sentry addGlobalEventProcessor called; attaching log files`);

    const logFilePath = log.transports.file.getFile().path;

    log.info(`Reading log file: ${logFilePath}`);
    const logFileContents = fs.readFileSync(logFilePath).toString();

    hint.attachments = [{ filename: `main.log`, data: logFileContents }];
    return event;
  });
};

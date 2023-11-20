import path from 'path';

import * as Sentry from '@sentry/electron/main';
import log from 'electron-log';

import { isProduction } from './utils';

export default (): void => {
  Sentry.init({
    dsn: isProduction()
      ? `https://2dc312dd96e84f3ca06fa0e5e3f96c5e@o4504796289433600.ingest.sentry.io/4504796469657600`
      : `https://c63ffcba511c4cdebd5365c4cb2990f6@o4504796289433600.ingest.sentry.io/4504796459171840`,
    beforeSend: (event) => {
      // It is very common for the auto-updater to encounter an error when
      // checking for updates. It turns out that end users tend to have lots of
      // sporadic network issues which can cause problems for an app that is
      // always running. Examples of network errors we have seen include
      // ERR_NETWORK_IO_SUSPENDED (which happens when the user's machine goes
      // to sleep), ERR_NETWORK_CHANGED (which happens when the user's network
      // settings have changed), and ERR_INTERNET_DISCONNECTED (which happens
      // when the user's network is disconnected).
      //
      // Most of these errors are outside of our control, so we are willing to
      // swallow the error without sending an alert to Sentry. Some errors, such
      // as missing files in our release, are actionable, but would likely be
      // caught by someone on the team because we would notice that we're not
      // getting updated to the latest version. Also, even though the errors
      // aren't sent to Sentry, they are still logged, so we would be bound to
      // see the error at some point when reviewing log files.
      if (event.tags?.autoUpdateError) {
        const errorMessage = event.exception?.values
          ?.map((value) => {
            return value.value;
          })
          .filter(Boolean)
          .join(`, `);

        log.info(`Auto-update error detected, ignoring: ${errorMessage}`);

        return null;
      }

      return event;
    },
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

import * as Sentry from '@sentry/electron/main';
import { v4 as uuidv4 } from 'uuid';

export default (errorMessage: string): void => {
  Sentry.withScope((scope) => {
    // Use a unique fingerprint to avoid grouping in Sentry so that we
    // don't accidentally miss an alert about a manual bug report
    scope.setFingerprint([uuidv4()]);

    const userEmail = scope.getUser()?.email || `no user`;
    const now = new Date().toISOString();
    const message = `${errorMessage} - ${userEmail} - ${now}`;
    Sentry.captureException(new Error(message));
  });
};

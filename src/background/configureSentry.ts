import * as Sentry from '@sentry/electron/main';

import { isProduction } from './utils';

export default (): void => {
  Sentry.init({
    dsn: isProduction()
      ? `https://2dc312dd96e84f3ca06fa0e5e3f96c5e@o4504796289433600.ingest.sentry.io/4504796469657600`
      : `https://c63ffcba511c4cdebd5365c4cb2990f6@o4504796289433600.ingest.sentry.io/4504796459171840`,
  });

  Sentry.setTag(`swivvel.service`, `electron`);
};

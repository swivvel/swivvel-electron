import electronAppUniversalProtocolClient from 'electron-app-universal-protocol-client';
import log from 'electron-log';

import { isProduction } from './utils';

/**
 * Configure URL protocol used for deep linking to the desktop app.
 */
export default async (): Promise<void> => {
  log.info(`Configuring deep linking...`);
  Promise<void>;

  electronAppUniversalProtocolClient.on(`request`, (requestUrl) => {
    console.log(`electronAppUniversalProtocolClient`);
    console.log(requestUrl);
  });

  await electronAppUniversalProtocolClient.initialize({
    protocol: `swivvel`,
    mode: isProduction() ? `production` : `development`,
  });

  log.info(`Configured deep linking`);
};

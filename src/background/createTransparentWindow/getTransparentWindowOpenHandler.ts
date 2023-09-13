import log from 'electron-log';

import { WindowOpenHandler, removeQueryParams } from '../utils';

export default (
  siteUrl: string,
  callbacks: {
    onLogInPageOpened: () => void;
  }
): WindowOpenHandler => {
  return (url) => {
    // See main repo README for description of desktop log in flow
    if (removeQueryParams(url) === `${siteUrl}/electron/login`) {
      log.info(`Log in page requested`);
      callbacks.onLogInPageOpened();
      return { action: `deny` };
    }

    return null;
  };
};

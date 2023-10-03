import { BrowserWindowConstructorOptions } from 'electron';

import { getPreloadPath } from '../../utils';

export default (): BrowserWindowConstructorOptions => {
  return {
    webPreferences: { preload: getPreloadPath() },
  };
};

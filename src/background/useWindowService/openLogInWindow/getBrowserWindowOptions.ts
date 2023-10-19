import { BrowserWindowConstructorOptions } from 'electron';

import { getPreloadPath } from '../../utils';

export default (): BrowserWindowConstructorOptions => {
  return {
    height: 700,
    webPreferences: { preload: getPreloadPath() },
    width: 720,
  };
};

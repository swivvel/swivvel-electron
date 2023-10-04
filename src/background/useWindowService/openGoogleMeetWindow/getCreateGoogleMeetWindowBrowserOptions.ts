import { BrowserWindowConstructorOptions } from 'electron';

import { getPreloadPath } from '../../utils';

export default (): BrowserWindowConstructorOptions => {
  const height = 1000;
  const width = 1400;

  return {
    height,
    minHeight: height,
    minWidth: width,
    webPreferences: {
      preload: getPreloadPath(),
    },
    width,
  };
};

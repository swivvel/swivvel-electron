import { BrowserWindowConstructorOptions } from 'electron';

import { getPreloadPath } from '../../utils';

export default (): BrowserWindowConstructorOptions => {
  const height = 1000;
  const width = 1400;

  // Set min height/width to prevent the window from trying to auto-resize
  // itself on the getalink page.
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

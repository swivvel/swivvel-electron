import { BrowserWindowConstructorOptions, screen } from 'electron';

import { getPreloadPath } from '../../utils';

export default (show: boolean): BrowserWindowConstructorOptions => {
  const primaryDisplay = screen.getPrimaryDisplay();

  return {
    backgroundColor: `#ffffff`,
    height: Math.min(primaryDisplay.workArea.height, 800),
    show,
    webPreferences: { preload: getPreloadPath() },
    width: Math.min(primaryDisplay.workArea.width, 1400),
  };
};

import { BrowserWindowConstructorOptions, screen } from 'electron';

import { isLinux } from '../../utils';

export default (preloadPath: string): BrowserWindowConstructorOptions => {
  const primaryDisplay = screen.getPrimaryDisplay();

  return {
    autoHideMenuBar: isLinux(),
    backgroundColor: `#ffffff`,
    focusable: true,
    frame: !isLinux(),
    height: primaryDisplay.workArea.height,
    hiddenInMissionControl: false,
    skipTaskbar: false,
    webPreferences: { preload: preloadPath },
    width: primaryDisplay.workArea.width,
    x: primaryDisplay.workArea.x,
    y: primaryDisplay.workArea.y,
  };
};

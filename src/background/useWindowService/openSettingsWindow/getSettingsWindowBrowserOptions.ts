import { BrowserWindowConstructorOptions, screen } from 'electron';

import { getPreloadPath, isLinux } from '../../utils';

export default (): BrowserWindowConstructorOptions => {
  const primaryDisplay = screen.getPrimaryDisplay();

  return {
    autoHideMenuBar: isLinux(),
    backgroundColor: `#ffffff`,
    focusable: true,
    frame: !isLinux(),
    height: 800,
    hiddenInMissionControl: false,
    skipTaskbar: false,
    webPreferences: { preload: getPreloadPath() },
    width: 920,
    x: primaryDisplay.workArea.x,
    y: primaryDisplay.workArea.y,
  };
};

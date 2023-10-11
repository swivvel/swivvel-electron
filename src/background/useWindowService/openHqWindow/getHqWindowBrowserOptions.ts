import { BrowserWindowConstructorOptions, screen } from 'electron';

import { getPreloadPath, isLinux } from '../../utils';

export default (show: boolean): BrowserWindowConstructorOptions => {
  const primaryDisplay = screen.getPrimaryDisplay();

  return {
    autoHideMenuBar: isLinux(),
    backgroundColor: `#ffffff`,
    focusable: true,
    frame: !isLinux(),
    height: primaryDisplay.workArea.height,
    hiddenInMissionControl: false,
    show,
    skipTaskbar: false,
    webPreferences: { preload: getPreloadPath() },
    width: primaryDisplay.workArea.width,
    x: primaryDisplay.workArea.x,
    y: primaryDisplay.workArea.y,
  };
};

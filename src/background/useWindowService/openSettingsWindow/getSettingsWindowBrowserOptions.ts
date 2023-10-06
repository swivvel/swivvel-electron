import { BrowserWindowConstructorOptions } from 'electron';

import { getPreloadPath, isLinux } from '../../utils';

export default (): BrowserWindowConstructorOptions => {
  return {
    autoHideMenuBar: isLinux(),
    backgroundColor: `#ffffff`,
    focusable: true,
    frame: !isLinux(),
    height: 850,
    hiddenInMissionControl: false,
    skipTaskbar: false,
    webPreferences: { preload: getPreloadPath() },
    width: 1200,
  };
};

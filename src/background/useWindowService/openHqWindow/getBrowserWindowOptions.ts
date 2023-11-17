import { BrowserWindowConstructorOptions } from 'electron';

import { getPrimaryDisplayWorkAreaBounds, getPreloadPath } from '../../utils';
import { Log } from '../utils';

export default (show: boolean, log: Log): BrowserWindowConstructorOptions => {
  const { height, width, x, y } = getPrimaryDisplayWorkAreaBounds(log);

  return {
    backgroundColor: `#ffffff`,
    center: true,
    height,
    show,
    webPreferences: { preload: getPreloadPath() },
    width,
    x,
    y,
  };
};

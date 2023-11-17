import { BrowserWindowConstructorOptions } from 'electron';

import { getFullscreenBounds, getPreloadPath } from '../../utils';
import { Log } from '../utils';

export default async (
  show: boolean,
  log: Log
): Promise<BrowserWindowConstructorOptions> => {
  const { height, width, x, y } = await getFullscreenBounds(log);

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

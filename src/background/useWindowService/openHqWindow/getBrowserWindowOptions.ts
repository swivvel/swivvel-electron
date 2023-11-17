import { BrowserWindowConstructorOptions } from 'electron';

import { getFullscreenBounds, getPreloadPath } from '../../utils';
import { Log } from '../utils';

export default async (
  windowExists: boolean,
  show: boolean,
  log: Log
): Promise<BrowserWindowConstructorOptions> => {
  let bounds: { height: number; width: number; x: number; y: number } | null;

  // The bounds are slow to compute on Linux, so don't compute them if they
  // won't be needed because the existing window is going to be displayed.
  if (windowExists) {
    bounds = null;
  } else {
    bounds = await getFullscreenBounds(log);
  }

  return {
    backgroundColor: `#ffffff`,
    center: true,
    show,
    webPreferences: { preload: getPreloadPath() },
    ...bounds,
  };
};

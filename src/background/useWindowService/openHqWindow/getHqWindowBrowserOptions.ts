import { BrowserWindowConstructorOptions } from 'electron';

import { getFullscreenBounds, getPreloadPath } from '../../utils';

export default (show: boolean): BrowserWindowConstructorOptions => {
  const { height, width, x, y } = getFullscreenBounds();

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

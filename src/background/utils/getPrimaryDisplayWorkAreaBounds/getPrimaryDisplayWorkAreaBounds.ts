import isLinux from '../isLinux';

// import getLinuxBounds from './getLinuxBounds';
import getNonLinuxBounds from './getNonLinuxBounds';
import { Bounds } from './types';

/**
 * Return the work area bounds of the display on which the widget should
 * appear. The work area bounds contain the area in which a window can
 * be placed, i.e. the full screen minus any OS bars.
 */
export default (log: (msg: string) => void): Bounds => {
  log(`Getting fullscreen bounds: isLinux=${isLinux()}`);

  return getNonLinuxBounds(log);

  // There is a lot of variability in how the work area bounds are reported
  // on various Linux systems, so we can't rely on the bounds reported by
  // the OS.
  // return isLinux() ? getLinuxBounds(log) : getNonLinuxBounds(log);
};

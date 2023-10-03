import { screen } from 'electron';

import { isLinux } from '../../../utils';

// We are unlikely to have any Linux users, so we're optimizing for Ubuntu for
// now. The top bar may be different heights on other Linux distros, but we can
// implement something more robust if that ever becomes a problem.
const UBUNTU_TOP_BAR_HEIGHT = 27;

interface Bounds {
  height: number;
  width: number;
  x: number;
  y: number;
}

export default (): Bounds => {
  const primaryDisplay = screen.getPrimaryDisplay();

  const x = 0;
  const width = primaryDisplay.workArea.width;

  if (isLinux()) {
    // The work area is supposed to be the display size minus the OS bar height.
    // If both heights are equal, then the work area is not taking into account
    // the OS bar. This has been observed to happen on Ubuntu 23.04, and is
    // documented in this issue: https://github.com/electron/electron/issues/8069
    const workAreaHeightIsWrong =
      primaryDisplay.bounds.height === primaryDisplay.workArea.height;

    const height = workAreaHeightIsWrong
      ? primaryDisplay.bounds.height - UBUNTU_TOP_BAR_HEIGHT
      : primaryDisplay.workArea.height;

    const y = primaryDisplay.workArea.y;

    return {
      height,
      width,
      x,
      y,
    };
  }

  const height = primaryDisplay.workArea.height;
  const y = primaryDisplay.workArea.y;

  return {
    height,
    width,
    x,
    y,
  };
};

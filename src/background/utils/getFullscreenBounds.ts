import { screen } from 'electron';

import getUbuntuVersion from './getUbuntuVersion';
import isLinux from './isLinux';
import isUbuntuVersionGreaterOrEqual from './isUbuntuVersionGreaterOrEqual';

// We have observed that the working area bounds reported to Electron on Ubuntu
// do not take into account the OS top bar, so we have to manually subtract it.
// Ubuntu increased the size of their top bar from 27px to 32px in v23.10.
const UBUNTU_TOP_BAR_HEIGHT_LTE_23_04 = 27;
const UBUNTU_TOP_BAR_HEIGHT_GTE_23_10 = 32;

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

    let height: number;

    if (!workAreaHeightIsWrong) {
      height = primaryDisplay.workArea.height;
    } else {
      const ubuntuVersion = getUbuntuVersion();

      let osTopBarHeight: number;

      if (!ubuntuVersion) {
        osTopBarHeight = 0;
      } else if (isUbuntuVersionGreaterOrEqual(ubuntuVersion, [23, 10])) {
        osTopBarHeight = UBUNTU_TOP_BAR_HEIGHT_GTE_23_10;
      } else {
        osTopBarHeight = UBUNTU_TOP_BAR_HEIGHT_LTE_23_04;
      }

      height = primaryDisplay.bounds.height - osTopBarHeight;
    }

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

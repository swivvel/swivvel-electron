import { BrowserWindow, screen } from 'electron';

import isLinux from './isLinux';

interface Bounds {
  height: number;
  width: number;
  x: number;
  y: number;
}

/**
 * Return the work area bounds of the display on which the widget should
 * appear. The work area bounds contain the area in which a window can
 * be placed, i.e. the full screen minus any OS bars.
 */
export default async (log: (msg: string) => void): Promise<Bounds> => {
  if (!isLinux()) {
    const primaryDisplay = screen.getPrimaryDisplay();

    log(`Getting fullscreen bounds for non-Linux: using work area bounds`);
    log(`Primary display ID: ${primaryDisplay.id}`);
    log(`WorkArea bounds: ${JSON.stringify(primaryDisplay.workArea)}`);

    return primaryDisplay.workArea;
  }

  // After just the first few handful of Ubuntu users (spanning versions from
  // 22.04 to 23.10), it's clear that the work area bounds are not reliable.
  // In many cases, the work area would fail to take into account the top bar
  // or the Dock. Sometimes it would be correct for one display but incorrect
  // for a second display.
  //
  // At first we tried to guess the bounds by looking at the version of Ubuntu
  // and accounting for any observed issues with the work area values. However,
  // there are many different ways each version can be configured (not to
  // mention the variety of other distros), so it isn't tenable to create
  // workarounds for every possible configuration.
  //
  // We attempted to sidestep this problem completely by simply maximizing the
  // transparent window. However, the window wouldn't maximize because we set
  // the `type=splash` and for some reason this blocks maximization. We tried
  // removing the `type` field, but then the `alwaysOnTop` behavior stopped
  // working. We attempted a variety of other configurations, but we could not
  // get the transparent window to maximize without introducing other bugs.
  //
  // The only working approach we have found is to calculate the work area
  // bounds by creating a temporary window, maximizing it, then reading the
  // size and position of that window. This way we don't have to tweak any
  // config options on the transparent window but we can still use OS-level
  // window maximization to get the correct bounds for every possible version
  // and configuration of Linux.

  log(`Getting fullscreen bounds for Linux: using maximized window strategy`);

  return new Promise((resolve) => {
    log(`Creating temp window to determine work area bounds`);

    const tempBrowserWindow = new BrowserWindow({
      closable: false,
      frame: false,
      transparent: true,
    });

    tempBrowserWindow.setIgnoreMouseEvents(true);

    const initialBounds = tempBrowserWindow.getBounds();
    log(`Temp window initial bounds: ${JSON.stringify(initialBounds)}`);

    log(`Setting first timeout for temp window`);

    // For some reason, the window would get un-maximized immediately after we
    // called `maximize()` unless we wrapped it in a `setTimeout()`. We don't
    // know the most efficient timeout value, so we tried to pick something
    // small enough that it won't be too impactful to app startup time but not
    // so small that the window will fail to maximize.
    setTimeout(() => {
      log(`Reached first timeout for temp window`);

      log(`Maximizing temp window`);
      tempBrowserWindow.maximize();

      log(`Setting second timeout for temp window`);

      // We also needed to use a timeout after the window was maximized, or
      // else the bounds would be the un-maximized values. This might be due
      // to the window animating, or possibly it's a bug in Electron. Since
      // we don't know the root cause, we don't know how long the timeout
      // should be, so we just guessed.
      setTimeout(() => {
        log(`Reached second timeout for temp window`);

        const bounds = tempBrowserWindow.getBounds();
        log(`Temp window maximized bounds: ${JSON.stringify(bounds)}`);

        log(`Destroying temp window`);
        tempBrowserWindow.destroy();

        resolve(bounds);
      }, 2000);
    }, 2000);
  });
};

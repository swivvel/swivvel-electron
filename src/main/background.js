/* eslint-disable prefer-const */
const path = require(`path`);
const {
  app,
  BrowserWindow,
  Menu,
  powerMonitor,
  screen,
  Tray,
} = require(`electron`);
const log = require(`electron-log`);
const { autoUpdater } = require(`electron-updater`);

const isProduction = app.isPackaged;
const isLinux = process.platform === `linux`;

// Since Swivvel has a tray icon, we don't want the app to quit unless the user
// explicitly quits the app from the tray menu
const allowQuit = { current: false };

/**
 * Perform the necessary steps to quit the app.
 */
const quitApp = (mainWindow, notificationsWindow, options) => {
  const quitAndInstall = Boolean(options && options.quitAndInstall);

  log.info(`Preparing to quit app (quitAndInstall=${quitAndInstall})...`);
  allowQuit.current = true;
  app.removeAllListeners(`window-all-closed`);
  mainWindow.removeAllListeners(`close`);
  notificationsWindow.removeAllListeners(`close`);

  // `close()` wasn't successfully closing the app on Mac so we're
  // using `destroy()` instead
  log.info(`Closing windows...`);
  mainWindow.destroy();
  notificationsWindow.destroy();

  if (quitAndInstall) {
    log.info(`Quitting app and installing updates`);
    autoUpdater.quitAndInstall();
  } else {
    log.info(`Quitting app`);
    app.quit();
  }
};

/**
 * Configure the global app settings.
 */
const configureApp = () => {
  log.info(`Configuring app...`);

  // Electron stores everything related to the app (cache, local storage,
  // databases, logs, etc.) in a directory in the user's home directory.
  // Prevent dev from colliding with prod by adding a suffix.
  if (!isProduction) {
    app.setPath(`userData`, `${app.getPath(`userData`)}-development`);
  }

  // Transparent windows don't work in Linux without these settings
  // See: https://github.com/electron/electron/issues/15947
  if (isLinux) {
    app.commandLine.appendSwitch(`enable-transparent-visuals`);
    app.commandLine.appendSwitch(`disable-gpu`);
    app.disableHardwareAcceleration();
  }

  // Configure the app to open automatically when the user logs in to their OS
  app.setLoginItemSettings({ openAtLogin: true });

  app.on(`window-all-closed`, () => {
    if (allowQuit.current) {
      app.quit();
    }
  });

  log.info(`Configured app`);
};

/**
 * Create the main window that contains the web app.
 */
const createMainWindow = async () => {
  log.info(`Creating main window...`);

  const primaryDisplay = screen.getPrimaryDisplay();

  const mainWindow = new BrowserWindow({
    autoHideMenuBar: isLinux,
    backgroundColor: `#ffffff`,
    focusable: true,
    frame: !isLinux,
    height: primaryDisplay.workAreaSize.height,
    hiddenInMissionControl: false,
    skipTaskbar: false,
    width: primaryDisplay.workAreaSize.width,
    x: primaryDisplay.workAreaSize.x,
    y: primaryDisplay.workAreaSize.y,
  });

  mainWindow.on(`close`, (event) => {
    if (!allowQuit.current) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Show the main window when user clicks on dock on Mac
  app.on(`activate`, () => {
    mainWindow.show();
  });

  if (isProduction) {
    await mainWindow.loadURL(`https://app.swivvel.io/`);
  } else {
    await mainWindow.loadURL(`${process.env.ELECTRON_APP_DEV_URL}/`);
    mainWindow.webContents.openDevTools();
  }

  log.info(`Created main window`);

  return mainWindow;
};

/**
 * Pause execution for the given number of milliseconds.
 */
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Support mouse events on the transparent notification window.
 *
 * The transparent notification window is always on top of all other windows,
 * so we need to ignore mouse events by default. When the user's cursor moves
 * over an element that we rendered in the notification window, we need to stop
 * ignoring mouse events so that the user can interact with the element.
 *
 * There are a few strategies to accomplish this, but the most reliable we found
 * was https://github.com/electron/electron/issues/1335#issuecomment-1585787243.
 * This works by periodically capturing a 1x1 image of the pixel at the user's
 * current cursor position. If the pixel is transparent, then the user's cursor
 * is over a transparent part of the window and we should ignore mouse events.
 * If the pixel is not transparent, then the user's cursor is over a non-
 * transparent part of the window and we should not ignore mouse events.
 */
const pollForNotificationsMouseEvents = (notificationsWindow) => {
  const interval = setInterval(async () => {
    if (notificationsWindow.isDestroyed()) {
      clearInterval(interval);
      return;
    }

    const point = screen.getCursorScreenPoint();
    const [x, y] = notificationsWindow.getPosition();
    const [w, h] = notificationsWindow.getSize();

    if (point.x > x && point.x < x + w && point.y > y && point.y < y + h) {
      const mouseX = point.x - x;
      const mouseY = point.y - y;

      // Capture 1x1 image of mouse position
      const capture = { x: mouseX, y: mouseY, width: 1, height: 1 };
      const image = await notificationsWindow.webContents.capturePage(capture);
      const buffer = image.getBitmap();
      const mouseIsOverTransparent = buffer[3] === 0;
      notificationsWindow.setIgnoreMouseEvents(mouseIsOverTransparent);
    }
  }, 50);
};

/**
 * Create the transparent window for displaying notifications.
 */
const createNotificationsWindow = async () => {
  log.info(`Creating notifications window...`);

  // Transparent windows don't work on Linux without some hacks
  // like this short delay
  // See: https://github.com/electron/electron/issues/15947
  if (isLinux) {
    await sleep(1000);
  }

  const primaryDisplay = screen.getPrimaryDisplay();

  const notificationsWindow = new BrowserWindow({
    alwaysOnTop: true,
    autoHideMenuBar: true,
    closable: false,
    // On Mac, the window needs to be focusable for the mouse cursor to appear
    // as a pointer. On Linux, the mouse cursor appears as a pointer on a
    // non-focusable window, but if the window is focusable then it appears
    // when using alt+tab to switch between windows.
    focusable: !isLinux,
    frame: false,
    hasShadow: false,
    height: primaryDisplay.workAreaSize.height,
    hiddenInMissionControl: true,
    maximizable: false,
    minimizable: false,
    resizable: false,
    roundedCorners: false,
    skipTaskbar: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, `preloadNotifications.js`),
    },
    width: primaryDisplay.workAreaSize.width,
    x: 0,
    y: 0,
  });

  notificationsWindow.setIgnoreMouseEvents(true, { forward: true });
  notificationsWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
    // See: https://github.com/electron/electron/issues/25368
    skipTransformProcessType: true,
  });

  notificationsWindow.on(`close`, (event) => {
    if (!allowQuit.current) {
      event.preventDefault();
      notificationsWindow.hide();
    }
  });

  // See: https://github.com/electron/electron/issues/1335#issuecomment-1585787243
  pollForNotificationsMouseEvents(notificationsWindow);

  if (isProduction) {
    await notificationsWindow.loadURL(`https://app.swivvel.io/notifications`);
  } else {
    await notificationsWindow.loadURL(
      `${process.env.ELECTRON_APP_DEV_URL}/notifications`
    );
  }

  log.info(`Created notifications window`);

  return notificationsWindow;
};

/**
 * Add the Swivvel icon to the OS system tray.
 */
const createTray = (mainWindow, notificationsWindow) => {
  log.info(`Creating tray...`);

  const tray = new Tray(path.join(__dirname, `logoTemplate.png`));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Open Swivvel`,
      type: `normal`,
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: `Quit`,
      type: `normal`,
      click: () => {
        quitApp(mainWindow, notificationsWindow);
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  log.info(`Created tray`);
};

/**
 * Check if there are any updates available for the app. If so, download
 * the update and send an OS notification informing the user that a new
 * version is available and can be installed by restarting the app.
 */
const pollForUpdates = () => {
  autoUpdater.checkForUpdatesAndNotify();

  return setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 1000 * 60);
};

/**
 * Configure automatic updates of the app.
 */
const configureAutoUpdates = (mainWindow, notificationsWindow) => {
  let checkForUpdatesInterval;

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = `info`;

  autoUpdater.on(`update-available`, () => {
    log.info(`Update available`);
  });

  autoUpdater.on(`update-not-available`, () => {
    log.info(`Update not available`);
  });

  autoUpdater.on(`error`, (err) => {
    log.info(`Error in auto-updater: ${err}`);
  });

  autoUpdater.on(`download-progress`, (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
    log.info(logMessage);
  });

  autoUpdater.on(`update-downloaded`, () => {
    log.info(`Update downloaded`);

    if (checkForUpdatesInterval) {
      clearInterval(checkForUpdatesInterval);
    }

    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    log.info(`Scheduling app relaunch for ${midnight.toISOString()}...`);

    setTimeout(() => {
      log.info(`Installing new version and relaunching app...`);
      // See: https://github.com/electron-userland/electron-builder/issues/1604
      setImmediate(() => {
        quitApp(mainWindow, notificationsWindow, { quitAndInstall: true });
      });
    }, msUntilMidnight);
  });

  checkForUpdatesInterval = pollForUpdates();
};

/**
 * Make sure the app quits when the OS shuts down.
 */
const handleSystemShutdown = (mainWindow, notificationsWindow) => {
  powerMonitor.on(`shutdown`, () => {
    log.info(`System shutdown detected`);
    quitApp(mainWindow, notificationsWindow);
  });
};

/**
 * Initialization
 */
(async () => {
  log.info(`App starting...`);

  configureApp();
  await app.whenReady();
  const mainWindow = await createMainWindow();
  const notificationsWindow = await createNotificationsWindow();
  createTray(mainWindow, notificationsWindow);
  configureAutoUpdates(mainWindow, notificationsWindow);
  handleSystemShutdown(mainWindow, notificationsWindow);

  log.info(`App started`);
})();

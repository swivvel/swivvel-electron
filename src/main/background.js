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
const Store = require(`electron-store`);
const { autoUpdater } = require(`electron-updater`);

const isProduction = app.isPackaged;
const isLinux = process.platform === `linux`;

const allowQuit = { current: false };

const quitApp = (mainWindow, notificationsWindow, options) => {
  const quitAndInstall = Boolean(options && options.quitAndInstall);

  log.info(`Preparing to quit app (quitAndInstall=${quitAndInstall})...`);
  allowQuit.current = true;
  app.removeAllListeners(`window-all-closed`);
  mainWindow.removeAllListeners(`close`);
  notificationsWindow.removeAllListeners(`close`);

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

const configureApp = () => {
  log.info(`Configuring app...`);

  if (!isProduction) {
    app.setPath(`userData`, `${app.getPath(`userData`)} (development)`);
  }

  // See: https://github.com/electron/electron/issues/15947
  if (isLinux) {
    app.commandLine.appendSwitch(`enable-transparent-visuals`);
    app.commandLine.appendSwitch(`disable-gpu`);
    app.disableHardwareAcceleration();
  }

  app.setLoginItemSettings({ openAtLogin: true });

  app.on(`window-all-closed`, () => {
    if (allowQuit.current) {
      app.quit();
    }
  });

  powerMonitor.on(`shutdown`, () => {
    log.info(`System shutdown detected`);
    quitApp();
  });

  log.info(`Configured app`);
};

const createWindow = (windowName, options) => {
  const key = `window-state`;
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win;

  const restore = () => {
    return store.get(key, defaultSize);
  };

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return {
      ...defaultSize,
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    };
  };

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const browserOptions = {
    ...state,
    ...options,
  };
  win = new BrowserWindow(browserOptions);

  win.on(`close`, saveState);

  return win;
};

const createMainWindow = async () => {
  log.info(`Creating main window...`);

  const primaryDisplay = screen.getPrimaryDisplay();

  const mainWindow = createWindow(`main`, {
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

  if (isProduction) {
    await mainWindow.loadURL(`https://app.swivvel.io/`);
  } else {
    await mainWindow.loadURL(`${process.env.ELECTRON_APP_DEV_URL}/`);
    mainWindow.webContents.openDevTools();
  }

  log.info(`Created main window`);

  return mainWindow;
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const handleNotificationsMouseEvents = (notificationsWindow) => {
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
  }, 300);
};

const createNotificationsWindow = async () => {
  log.info(`Creating notifications window...`);

  // See: https://github.com/electron/electron/issues/15947
  if (isLinux) {
    await sleep(1000);
  }

  const primaryDisplay = screen.getPrimaryDisplay();

  const notificationsWindow = createWindow(`notifications`, {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    closable: false,
    focusable: false,
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
  handleNotificationsMouseEvents(notificationsWindow);

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

const pollForUpdates = () => {
  log.info(`Checking for updates...`);
  autoUpdater.checkForUpdatesAndNotify();

  return setInterval(() => {
    log.info(`Checking for updates...`);
    autoUpdater.checkForUpdatesAndNotify();
  }, 1000 * 60);
};

const handleUpdates = (mainWindow, notificationsWindow) => {
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

(async () => {
  log.info(`App starting...`);

  configureApp();
  await app.whenReady();
  const mainWindow = await createMainWindow();
  const notificationsWindow = await createNotificationsWindow();
  createTray(mainWindow, notificationsWindow);
  handleUpdates(mainWindow, notificationsWindow);

  log.info(`App started`);
})();

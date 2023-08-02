/* eslint-disable prefer-const */
const path = require(`path`);
const { app, BrowserWindow, Menu, screen, Tray } = require(`electron`);
const log = require(`electron-log`);
const Store = require(`electron-store`);
const { autoUpdater } = require(`electron-updater`);

const isProduction = app.isPackaged;
const isLinux = process.platform === `linux`;

let allowQuit = false;

const configureApp = () => {
  log.verbose(`Configuring app...`);

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
    if (allowQuit) {
      app.quit();
    }
  });

  log.verbose(`Configured app`);
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
  log.verbose(`Creating main window...`);

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
    if (!allowQuit) {
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

  log.verbose(`Created main window`);

  return mainWindow;
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const handleNotificationsMouseEvents = (notificationsWindow) => {
  setInterval(async () => {
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
  log.verbose(`Creating notifications window...`);

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
    if (!allowQuit) {
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

  log.verbose(`Created notifications window`);

  return notificationsWindow;
};

const createTray = (mainWindow, notificationsWindow) => {
  log.verbose(`Creating tray...`);

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
        allowQuit = true;
        mainWindow.destroy();
        notificationsWindow.destroy();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  log.verbose(`Created tray`);
};

const checkForUpdates = () => {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = `verbose`;

  autoUpdater.on(`checking-for-update`, () => {
    log.verbose(`Checking for update...`);
  });

  autoUpdater.on(`update-available`, () => {
    log.verbose(`Update available.`);
  });

  autoUpdater.on(`update-not-available`, () => {
    log.verbose(`Update not available.`);
  });

  autoUpdater.on(`error`, (err) => {
    log.verbose(`Error in auto-updater. ${err}`);
  });

  autoUpdater.on(`download-progress`, (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
    log.verbose(logMessage);
  });

  autoUpdater.on(`update-downloaded`, () => {
    log.verbose(`Update downloaded`);
  });

  log.verbose(`Checking for updates...`);

  autoUpdater.checkForUpdatesAndNotify();
};

(async () => {
  log.info(`App starting...`);

  configureApp();
  await app.whenReady();
  const mainWindow = await createMainWindow();
  const notificationsWindow = await createNotificationsWindow();
  createTray(mainWindow, notificationsWindow);
  checkForUpdates();

  log.info(`App started`);
})();

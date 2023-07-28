/* eslint-disable prefer-const */
const path = require(`path`);
const { app, BrowserWindow, Menu, screen, Tray } = require(`electron`);
const Store = require(`electron-store`);

const isProduction = app.isPackaged;

if (!isProduction) {
  app.setPath(`userData`, `${app.getPath(`userData`)} (development)`);
}

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
    webPreferences: {
      contextIsolation: false,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);

  win.on(`close`, saveState);

  return win;
};

let tray = null;
let allowQuit = false;

(async () => {
  await app.whenReady();

  const primaryDisplay = screen.getPrimaryDisplay();

  const mainWindow = createWindow(`main`, {
    autoHideMenuBar: true,
    frame: false,
    height: primaryDisplay.workAreaSize.height,
    width: primaryDisplay.workAreaSize.width,
    x: primaryDisplay.workAreaSize.x,
    y: primaryDisplay.workAreaSize.y,
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes(`meetingAssistantNotification=`)) {
      return {
        action: `allow`,
        overrideBrowserWindowOptions: {
          alwaysOnTop: true,
          autoHideMenuBar: true,
          closable: false,
          frame: false,
          fullscreenable: false,
          height: 200,
          maximizable: false,
          minimizable: false,
          width: 300,
          x: primaryDisplay.workAreaSize.width - 350,
          y: 50,
        },
      };
    }

    return { action: `allow` };
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
    await mainWindow.loadURL(process.env.ELECTRON_APP_DEV_URL);
    mainWindow.webContents.openDevTools();
  }

  tray = new Tray(path.join(__dirname, `logoTemplate.png`));

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
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
})();

app.on(`window-all-closed`, () => {
  if (allowQuit) {
    app.quit();
  }
});
import log from 'electron-log';
import { BrowserWindow, screen } from 'electron';

export default async () => {
  log.info(`Creating HQ window...`);

  const primaryDisplay = screen.getPrimaryDisplay();

  const hqWindow = new BrowserWindow({
    //autoHideMenuBar: isLinux,
    backgroundColor: `#ffffff`,
    focusable: true,
    frame: !isLinux,
    height: primaryDisplay.workAreaSize.height,
    hiddenInMissionControl: false,
    skipTaskbar: false,
    //webPreferences: { preload: path.join(__dirname, `preload.js`) },
    width: primaryDisplay.workAreaSize.width,
    x: primaryDisplay.workAreaSize.x,
    y: primaryDisplay.workAreaSize.y,
  });

  hqWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Google Meet is showing "No video camera found", so we're opening it in
    // the user's default browser for now
    if (url.includes(`meet.google.com`)) {
      shell.openExternal(url);
      return { action: `deny` };
    }

    return { action: `allow` };
  });

  hqWindow.on(`close`, (event) => {
    if (!state.allowQuit) {
      event.preventDefault();
      hqWindow.hide();
    }
  });

  // Show the HQ window when user clicks on dock on Mac
  app.on(`activate`, () => {
    hqWindow.show();
  });

  if (isProduction) {
    await hqWindow.loadURL(`https://app.swivvel.io/`);
  } else {
    await hqWindow.loadURL(`${process.env.ELECTRON_APP_DEV_URL}/`);
    hqWindow.webContents.openDevTools();
  }

  log.info(`Created HQ window`);

  return hqWindow;
};

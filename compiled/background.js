"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable prefer-const */
const path = require(`path`);
const { app, BrowserWindow, ipcMain, Menu, powerMonitor, screen, shell, systemPreferences, Tray, } = require(`electron`);
const { Deeplink } = require(`electron-deeplink`);
const log = require(`electron-log`);
const { autoUpdater } = require(`electron-updater`);
const isProduction = app.isPackaged;
const isLinux = process.platform === `linux`;
const protocol = isProduction ? `swivvel` : `swivvel-dev`;
/**
 * Perform the necessary steps to quit the app.
 */
const prepareToQuitApp = (hqWindow, notificationsWindow) => {
    log.info(`Preparing to quit app...`);
    state.allowQuit = true;
    app.removeAllListeners(`window-all-closed`);
    hqWindow.removeAllListeners(`close`);
    notificationsWindow.removeAllListeners(`close`);
    // `close()` wasn't successfully closing the app on Mac so we're
    // using `destroy()` instead
    log.info(`Closing windows...`);
    hqWindow.destroy();
    notificationsWindow.destroy();
};
const quitApp = (hqWindow, notificationsWindow, options) => {
    prepareToQuitApp(hqWindow, notificationsWindow);
    const quitAndInstall = Boolean(options && options.quitAndInstall);
    if (quitAndInstall) {
        log.info(`Quitting app and installing updates`);
        autoUpdater.quitAndInstall();
    }
    else {
        log.info(`Quitting app`);
        app.quit();
    }
};
/**
 * Configure the global app settings.
 */
const configureApp = (state) => {
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
        if (state.allowQuit) {
            app.quit();
        }
    });
    log.info(`Configured app`);
};
/**
 * Create the HQ window that contains the HQ page of the web app.
 */
const createHqWindow = () => __awaiter(void 0, void 0, void 0, function* () {
    log.info(`Creating HQ window...`);
    const primaryDisplay = screen.getPrimaryDisplay();
    const hqWindow = new BrowserWindow({
        autoHideMenuBar: isLinux,
        backgroundColor: `#ffffff`,
        focusable: true,
        frame: !isLinux,
        height: primaryDisplay.workAreaSize.height,
        hiddenInMissionControl: false,
        skipTaskbar: false,
        webPreferences: { preload: path.join(__dirname, `preload.js`) },
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
        yield hqWindow.loadURL(`https://app.swivvel.io/`);
    }
    else {
        yield hqWindow.loadURL(`${process.env.ELECTRON_APP_DEV_URL}/`);
        hqWindow.webContents.openDevTools();
    }
    log.info(`Created HQ window`);
    return hqWindow;
});
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
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
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
            const image = yield notificationsWindow.webContents.capturePage(capture);
            const buffer = image.getBitmap();
            const mouseIsOverTransparent = buffer[3] === 0;
            notificationsWindow.setIgnoreMouseEvents(mouseIsOverTransparent);
        }
    }), 50);
};
/**
 * Create the transparent window for displaying notifications.
 */
const createNotificationsWindow = (state) => __awaiter(void 0, void 0, void 0, function* () {
    log.info(`Creating notifications window...`);
    // Transparent windows don't work on Linux without some hacks
    // like this short delay
    // See: https://github.com/electron/electron/issues/15947
    if (isLinux) {
        yield sleep(1000);
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
        webPreferences: { preload: path.join(__dirname, `preload.js`) },
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
        if (!state.allowQuit) {
            event.preventDefault();
            notificationsWindow.hide();
        }
    });
    // See: https://github.com/electron/electron/issues/1335#issuecomment-1585787243
    pollForNotificationsMouseEvents(notificationsWindow);
    if (isProduction) {
        yield notificationsWindow.loadURL(`https://app.swivvel.io/notifications`);
    }
    else {
        yield notificationsWindow.loadURL(`${process.env.ELECTRON_APP_DEV_URL}/notifications`);
    }
    log.info(`Created notifications window`);
    return notificationsWindow;
});
/**
 * Add the Swivvel icon to the OS system tray.
 */
const createTray = (hqWindow, notificationsWindow) => {
    log.info(`Creating tray...`);
    const tray = new Tray(path.join(__dirname, `logoTemplate.png`));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Open Swivvel`,
            type: `normal`,
            click: () => {
                hqWindow.show();
            },
        },
        {
            label: `Quit`,
            type: `normal`,
            click: () => {
                quitApp(hqWindow, notificationsWindow);
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
const configureAutoUpdates = (hqWindow, notificationsWindow) => {
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
                quitApp(hqWindow, notificationsWindow, { quitAndInstall: true });
            });
        }, msUntilMidnight);
    });
    checkForUpdatesInterval = pollForUpdates();
};
/**
 * Tell the web app when the user is idle.
 */
const pollForIdleTime = (notificationsWindow) => {
    let isIdle = false;
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        if (notificationsWindow.isDestroyed()) {
            clearInterval(interval);
            return;
        }
        const newIsIdle = powerMonitor.getSystemIdleTime() > 30;
        if (newIsIdle !== isIdle) {
            isIdle = newIsIdle;
            notificationsWindow.webContents.send(`isIdle`, isIdle);
        }
    }), 1000);
};
/**
 * Make sure the app quits when the OS shuts down.
 */
const handleSystemShutdown = (hqWindow, notificationsWindow) => {
    powerMonitor.on(`shutdown`, () => {
        log.info(`System shutdown detected`);
        quitApp(hqWindow, notificationsWindow);
    });
};
/**
 * Initialization
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    log.info(`App starting...`);
    const state = {
        // Since Swivvel has a tray icon, we don't want the app to quit unless the
        // user explicitly quits the app from the tray menu
        allowQuit: false,
        // The transparent, always-on-top window
        transparentWindow: null,
        // The window that displays the HQ page of the web app
        hqWindow: null,
        // The window that displays the desktop app setup page
        setupWindow: null,
    };
    configureApp(state);
    yield app.whenReady();
    if (systemPreferences.askForMediaAccess) {
        yield systemPreferences.askForMediaAccess(`microphone`);
    }
    const notificationsWindow = yield createNotificationsWindow(state);
    const deeplink = new Deeplink({
        app,
        mainWindow: notificationsWindow,
        protocol,
        isDev: !isProduction,
    });
    createTray(notificationsWindow, hqWindow);
    configureAutoUpdates(notificationsWindow, hqWindow);
    pollForIdleTime(notificationsWindow);
    handleSystemShutdown(notificationsWindow, hqWindow);
    ipcMain.on(`createHqWindow`, createHqWindow);
    // Make sure the app closes if someone clicks "Quit" from the OS top bar
    // or from the app icon in the dock
    app.on(`before-quit`, () => {
        prepareToQuitApp(notificationsWindow, hqWindow);
    });
    log.info(`App started`);
}))();

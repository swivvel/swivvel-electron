import {
  BrowserWindow,
  app,
  desktopCapturer,
  ipcMain,
  systemPreferences,
} from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import configureIpcHandlers from './configureIpcHandlers';
import getDeepLinkHandler from './getDeepLinkHandler';
import handleSystemShutdown from './handleSystemShutdown';
import listenForDeepLinks from './listenForDeepLinks';
import pollForIdleTime from './pollForIdleTime';
import { State } from './types';
import useTrayService from './useTrayService';
import useWindowService from './useWindowService';
import { getPreloadPath, isProduction } from './utils';

const promisify = (fnString: string): string => {
  return `new Promise((resolve, reject) => { resolve(${fnString}); });`;
};

const fooJsSlim = `setTimeout(() => console.log('foo'), 3000)`;

const foo2 = `
window.navigator.mediaDevices.getDisplayMedia =
  async (): Promise<MediaStream> => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('getDisplayMedia called');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
    // const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] })

    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });

    return stream;
  }
`;

const foo3 = `window.navigator.mediaDevices.getDisplayMedia = () => window.navigator.mediaDevices.getUserMedia({audio:false,video:true})`;

const fooBefore = `console.log('before')`;
const foo4 = `window.navigator.mediaDevices.getDisplayMedia = () => window.navigator.mediaDevices.getUserMedia({audio:false,video:{mandatory:{chromeMediaSource: 'desktop',chromeMediaSourceId: 'screen:1:0'}}})`;
const fooAfter = `console.log('after')`;

const fooJs = `
console.log('setting window.navigator.mediaDevices.getDisplayMedia');
window.navigator.mediaDevices.getDisplayMedia =
  async (): Promise<MediaStream> => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('getDisplayMedia called');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
    // const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] })

    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });

    return stream;
  };
  console.log('window.navigator.mediaDevices.getDisplayMedia:');
  console.log(window?.navigator?.mediaDevices?.getDisplayMedia);
`;

const run = async (): Promise<void> => {
  log.info(`App v=${app.getVersion()} starting...`);

  const state: State = {
    allowQuit: false,
    logInFlowCompleted: false,
    tray: null,
    windows: {
      hq: null,
      logIn: null,
      setup: null,
      transparent: null,
    },
  };

  const trayService = useTrayService(state);
  const windowService = useWindowService(state, trayService);

  // todo
  app.disableHardwareAcceleration();

  configureApp();
  configureAppQuitHandling(state);
  listenForDeepLinks(state, getDeepLinkHandler(state, windowService));

  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  // const transparentWindow = await windowService.openTransparentWindow();

  trayService.createTray();
  // configureIpcHandlers(windowService);
  // configureAutoUpdates(state);
  // pollForIdleTime(transparentWindow);
  handleSystemShutdown(state);

  log.info(`Creating Google Meet window`);
  app.commandLine.appendSwitch(`enable-features`, `WebRTCPipeWireCapturer`);
  const foo = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      experimentalFeatures: true,
      // contextIsolation: false,
      // webSecurity: false,
      preload: getPreloadPath(),
    },
  });
  foo.webContents.setWindowOpenHandler(({ url }) => {
    console.log(url);
    // if (url.includes(`meet.google.com`)) {
    //   log.info(`Opening url in foo`);
    //   foo.loadURL(url);
    //   log.info(`Denying navigation`);
    //   return { action: `deny` };
    // }
    return { action: `allow` };
  });
  console.log(`=====================`);
  const sources = await desktopCapturer.getSources({
    types: [`screen`, `window`],
  });
  console.log(sources);
  await foo.loadURL(`https://meet.google.com/zec-feoq-gdv?authuser=0&hl=en`);
  // await foo.loadURL(`https://www.google.com`);
  // await foo.loadURL(`https://app.localhost.architect.sh/meet`);
  foo.webContents.openDevTools();
  await foo.webContents.executeJavaScript(promisify(fooBefore));
  await foo.webContents.executeJavaScript(promisify(foo4));
  await foo.webContents.executeJavaScript(promisify(fooAfter));
  log.info(`Created Google Meet window`);

  log.info(`App started`);
};

run();

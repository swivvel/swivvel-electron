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
import { readFileSync } from 'original-fs';

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
const fooWindow1 = `console.log(window.navigator)`;
const fooWindow2 = `console.log(window.navigator.mediaDevices)`;
const fooWindow3 = `console.log(window.navigator.mediaDevices.getDisplayMedia)`;

const filesContents = readFileSync(`${__dirname}/getDisplayMedia.js`, `utf8`);
const matches = filesContents.match(/"use strict";\n([\S\s]*);/);

if (!matches) {
  throw new Error(`Could not find contents of getDisplayMedia.js`);
}

console.log(matches[1]);

const foo4 = `(window.navigator.mediaDevices.getDisplayMedia = ${matches[1]}) && 'hammy'`;
// const foo4 = `(window.navigator.mediaDevices.getDisplayMedia = async () => {
//   console.log('!!!!!!!!!!!!!!!!!!!!!!!');

//   console.log(window.electron)

//   const sources = await window.electron.getDesktopSources();
//   console.log(sources);

//   console.log('&&&&&&&&&&&&&&&&&&&&&##')

//   const selected = new Promise((resolve, reject) => {

//   });



//   // const screenShareModal = document.querySelector('div[role="dialog"]');

//   var elemDiv = document.createElement('div');
//   elemDiv.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:rgb(196 114 114);';
//   elemDiv.text = 'zoop';//await window.electron.getScreenShareSelectionModalHtml();
//   document.body.appendChild(elemDiv);

//   console.log('yo tango')

//   const val = await selected;

//   console.log('!!!!!!!!!!!!!!!!!!!!!!!', val);

//   // return window.navigator.mediaDevices.getUserMedia({
//   //   audio:false,
//   //   video:{
//   //     mandatory:{
//   //       chromeMediaSource: 'desktop',
//   //       chromeMediaSourceId: sources[3].id
//   //     }
//   //   }
//   // })
// }) && 'hammy'`;

const foo5 = `
  console.log('ONLOAD')
`



// const foo5 = `(window.navigator.mediaDevices.getDisplayMedia = () => {
//   console.log('!!!!!!!!!!!!!!!!!!!!!!!');
//   window.navigator.mediaDevices.getUserMedia(
//     {
//       audio:false,
//       video: {
//         mandatory:{
//           chromeMediaSource: 'desktop',
//           chromeMediaSourceId: 'screen:1:0'
//         }
//       }
//     }
//   )
// } && 'hammy')`;
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
      createGoogleMeet: null,
      hq: null,
      logIn: null,
      setup: null,
      transparent: null,
    },
  };

  const trayService = useTrayService(state);
  const windowService = useWindowService(state, trayService);

  // // todo
  // app.disableHardwareAcceleration();

  configureApp();
  configureAppQuitHandling(state);
  listenForDeepLinks(state, getDeepLinkHandler(state, windowService));

  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  // const transparentWindow = await windowService.openTransparentWindow();

  trayService.createTray();
  configureIpcHandlers(windowService);
  // configureAutoUpdates(state);
  // pollForIdleTime(transparentWindow);
  handleSystemShutdown(state);

  log.info(`Creating Google Meet window`);
  app.commandLine.appendSwitch(`enable-features`, `WebRTCPipeWireCapturer`);
  const foo = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      // experimentalFeatures: true,
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
  const a = await foo.webContents.executeJavaScript(promisify(fooBefore));
  log.info(`a: ${a}`);
  await foo.webContents.executeJavaScript(promisify(fooWindow1));
  await foo.webContents.executeJavaScript(promisify(fooWindow2));
  await foo.webContents.executeJavaScript(promisify(fooWindow3));
  console.log(foo4)
  const b = await foo.webContents.executeJavaScript(promisify(foo4));
  log.info(`b: ${b}`);
  const bb = await foo.webContents.executeJavaScript(promisify(foo5));
  log.info(`bb: ${bb}`);
  const c = await foo.webContents.executeJavaScript(promisify(fooAfter));
  log.info(`c: ${c}`);
  log.info(`Created Google Meet window`);

  log.info(`App started`);
};

run();


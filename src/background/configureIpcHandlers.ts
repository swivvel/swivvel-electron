import * as Sentry from '@sentry/electron/main';
import { app, ipcMain, net, shell, systemPreferences } from 'electron';
import log from 'electron-log';

import { ShareableMediaSource } from '../types';

import { State } from './types';
import { WindowService } from './useWindowService';
import {
  getShareableMediaSources,
  isProduction,
  triggerSentryError,
} from './utils';

export default (windowService: WindowService, state: State): void => {
  ipcMain.handle(`getDesktopAppVersion`, () => {
    return app.getVersion();
  });

  ipcMain.handle(
    `getDesktopSources`,
    async (): Promise<Array<ShareableMediaSource>> => {
      log.info(`Received getDesktopSources event`);
      return getShareableMediaSources();
    }
  );

  ipcMain.handle(
    `getMediaAccessStatus`,
    async (
      event,
      mediaType: 'microphone' | 'camera' | 'screen'
    ): Promise<
      'not-determined' | 'granted' | 'denied' | 'restricted' | 'unknown'
    > => {
      log.info(`Received getMediaAccessStatus event for '${mediaType}'`);
      if (!systemPreferences.getMediaAccessStatus) {
        log.info(`getMediaAccessStatus not available on this platform`);
        return `unknown`;
      }
      const access = systemPreferences.getMediaAccessStatus(mediaType);
      log.info(`Media access for '${mediaType}' is '${access}'`);
      return access;
    }
  );

  ipcMain.on(
    `identifyUser`,
    async (
      event,
      user: { id: string; email: string | null } | null
    ): Promise<void> => {
      log.info(`Received identifyUser event, user=${JSON.stringify(user)}`);
      log.info(`Setting Sentry user context`);
      Sentry.setUser(user ? { ...user, email: user.email || undefined } : null);
      log.info(`Updating electron state`);
      state.loggedInUser = user ? user : null;
    }
  );

  ipcMain.handle(`isProduction`, isProduction);

  ipcMain.on(
    `joinAudioRoomForPod`,
    async (event, podId: string): Promise<void> => {
      log.info(`Received joinAudioRoomForPod event, podId=${podId}`);

      const transparentWindow = await windowService.openTransparentWindow();

      log.info(`Sending joinAudioRoomForPod event to transparent window`);
      transparentWindow.webContents.send(`joinAudioRoomForPod`, podId);
    }
  );

  ipcMain.on(`launchAudioRoomFromSetup`, async (): Promise<void> => {
    log.info(`Received launchAudioRoomFromSetup event`);

    const transparentWindow = await windowService.openTransparentWindow();

    log.info(`Sending launchAudioRoomFromSetup event to transparent window`);
    transparentWindow.webContents.send(`launchAudioRoomFromSetup`);
  });

  ipcMain.on(`signIn`, async (): Promise<void> => {
    const transparentWindow = await windowService.openTransparentWindow();

    log.info(`Sending signIn event to transparent window`);
    const requests = net.request({
      method: `GET`,
      url: `https://app.localhost.architect.sh/api/auth/login?desktop=true`,
      redirect: `manual`,
      session: transparentWindow.webContents.session,
      useSessionCookies: true,
    });

    // const requests = net.request({
    //   method: 'GET',
    //   protocol: 'https:',
    //   hostname: 'github.com',
    //   port: 443,
    //   path: '/',
    // });

    console.log(requests);

    requests.on(`response`, (resp) => {
      console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
      console.log(resp);
    });

    requests.on(`redirect`, (code, method, url, responseHeaders) => {
      console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
      console.log(`OPENING URL: ${url}`);
      console.log(
        `response headers, ${JSON.stringify(responseHeaders, null, 2)}`
      );
      shell.openExternal(url);
      requests.abort();
    });

    requests.on(`error`, (err) => {
      console.log(`xxxxxxxxxxxx`);
      console.log(err);
    });

    requests.end();
  });

  ipcMain.on(`triggerSentryError`, async (): Promise<void> => {
    log.info(`Received triggerSentryError event`);
    triggerSentryError(`Error triggered for user`);
    log.info(`Triggering Sentry error`);
  });
};

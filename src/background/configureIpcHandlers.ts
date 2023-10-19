import * as Sentry from '@sentry/electron/main';
import { app, ipcMain, systemPreferences } from 'electron';
import log from 'electron-log';

import { ShareableMediaSource } from '../types';

import { WindowService } from './useWindowService';
import { getShareableMediaSources, isProduction } from './utils';

export default (windowService: WindowService): void => {
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
};

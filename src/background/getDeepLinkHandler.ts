import log from 'electron-log';

import { LogInService } from './useLogInService';
import { WindowService } from './useWindowService';
import { parseQueryParams } from './utils';

const convertDeepLinkUrlToHttps = (url: string): string => {
  return url.replace(/^swivvel:\/\//, `https://`);
};

export default (
  logInService: LogInService,
  windowService: WindowService
): ((url: string) => Promise<void>) => {
  return async (url) => {
    log.info(`Deep link handler: ${url}`);

    // See main repo README for description of desktop log in flow
    if (url.includes(`/api/auth/callback`)) {
      log.info(`Running log in callback handler...`);

      const deepLinkUrl = convertDeepLinkUrlToHttps(url);

      log.info(`Proxying request to ${deepLinkUrl}...`);

      await logInService.handleLogInOAuthCallback(deepLinkUrl);

      log.info(`Log in callback handler complete`);
    }

    if (url.includes(`/join-audio-room-for-pod`)) {
      log.info(`Running join channel callback handler...`);
      const transparentWindow = await windowService.openTransparentWindow();

      const urlParams = parseQueryParams(url);
      const podId = urlParams.get(`podId`) || null;
      log.info(`urlParams: ${JSON.stringify(Array.from(urlParams.entries()))}`);
      log.info(`podId=${podId}`);

      if (podId) {
        log.info(`Sending joinAudioRoomForPod event to transparent window`);
        transparentWindow.webContents.send(`joinAudioRoomForPod`, podId);
      }
    }
  };
};

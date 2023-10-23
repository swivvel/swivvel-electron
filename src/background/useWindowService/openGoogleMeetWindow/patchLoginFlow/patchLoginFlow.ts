import { BrowserWindow } from 'electron';

import { Log } from '../../utils';

import addBannerToLoginFlow from './addBannerToLoginFlow';
import clickSignInIfInLobby from './clickSignInIfInLobby';
import prefillEmailAndAdvance from './prefillEmailAndAdvance';

export default async (window: BrowserWindow, log: Log): Promise<void> => {
  log(`Patching login flow...`);

  const patchLoginFlow = async (): Promise<void> => {
    await clickSignInIfInLobby(window, log);

    await addBannerToLoginFlow(window, log);

    await prefillEmailAndAdvance(window, log);
  };

  await patchLoginFlow();

  window.webContents.on(`did-finish-load`, async () => {
    await patchLoginFlow();
  });
};

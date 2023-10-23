import { BrowserWindow } from 'electron';

import { State } from '../../../types';
import { Log } from '../../utils';

import addBannerToLoginFlow from './addBannerToLoginFlow';
import clickSignInIfInLobby from './clickSignInIfInLobby';
import prefillEmailAndAdvance from './prefillEmailAndAdvance';

export default async (
  window: BrowserWindow,
  state: State,
  log: Log
): Promise<void> => {
  log(`Patching login flow...`);

  const patchLoginFlow = async (): Promise<void> => {
    // If the user is in the lobby and not signed in, click the sign in button
    // for them
    await clickSignInIfInLobby(window, log);

    // If the user is in the google login flow, add a banner explaining why
    // they need to connect
    await addBannerToLoginFlow(window, log);

    // If the user is prompted to input their email and we know their email,
    // enter it for them and advance to the next step
    await prefillEmailAndAdvance(window, state, log);
  };

  await patchLoginFlow();

  window.webContents.on(`did-finish-load`, async () => {
    // Run the patch again if the page reloads or the user is taken to another
    // page (e.g. login page)
    await patchLoginFlow();
  });
};

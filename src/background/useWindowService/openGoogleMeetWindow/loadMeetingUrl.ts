import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { loadUrl } from '../../utils';

export default async (
  url: string,
  window: BrowserWindow,
  state: State
): Promise<void> => {
  await loadUrl(url, window, state, {
    // Since the Google Meet window is opened from a user action, we must
    // display an error message to inform the user that their action failed.
    // Since the Google Meet window is temporary and the user can retry the
    // action, we can just destroy the window so the user tries again.
    onError: `warnAndDestroyWindow`,
  });
};

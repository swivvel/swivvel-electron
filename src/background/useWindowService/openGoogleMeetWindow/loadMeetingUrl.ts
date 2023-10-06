import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { loadUrl } from '../../utils';

import patchGetDisplayMedia from './patchGetDisplayMedia';

export default async (
  url: string,
  window: BrowserWindow,
  state: State
): Promise<void> => {
  await loadUrl(url, window, state);
  await patchGetDisplayMedia(window);
};

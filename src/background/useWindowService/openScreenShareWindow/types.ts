import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenScreenShareWindow = (
  args: OpenScreenShareWindowArgs
) => Promise<BrowserWindow>;

export interface OpenScreenShareWindowArgs {
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

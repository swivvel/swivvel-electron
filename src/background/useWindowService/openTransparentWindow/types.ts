import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenTransparentWindow = (
  args: OpenTransparentWindowArgs
) => Promise<BrowserWindow>;

export interface OpenTransparentWindowArgs {
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

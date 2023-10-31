import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenLogInWindow = (
  args: OpenLogInWindowArgs
) => Promise<BrowserWindow>;

export interface OpenLogInWindowArgs {
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

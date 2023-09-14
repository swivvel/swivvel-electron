import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenTransparentWindow = (
  args: OpenTransparentWindowArgs
) => Promise<BrowserWindow>;

export interface OpenTransparentWindowArgs {
  preloadPath: string;
  siteUrl: string;
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

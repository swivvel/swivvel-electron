import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { TrayService } from '../../useTrayService';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenLogInWindow = (
  args: OpenLogInWindowArgs
) => Promise<BrowserWindow>;

export interface OpenLogInWindowArgs {
  preloadPath: string;
  siteUrl: string;
  state: State;
  trayService: TrayService;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

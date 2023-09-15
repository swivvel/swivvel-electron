import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { TrayService } from '../../useTrayService';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenSetupWindow = (
  args: OpenSetupWindowArgs
) => Promise<BrowserWindow>;

export interface OpenSetupWindowArgs {
  state: State;
  trayService: TrayService;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

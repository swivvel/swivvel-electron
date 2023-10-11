import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { TrayService } from '../../useTrayService';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenHqWindow = (args: OpenHqWindowArgs) => Promise<BrowserWindow>;

export interface OpenHqWindowArgs {
  show: boolean;
  state: State;
  trayService: TrayService;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

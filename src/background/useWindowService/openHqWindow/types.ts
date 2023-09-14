import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { TrayService } from '../../useTrayService';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenHqWindow = (args: OpenHqWindowArgs) => Promise<BrowserWindow>;

export interface OpenHqWindowArgs {
  preloadPath: string;
  siteUrl: string;
  state: State;
  trayService: TrayService;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

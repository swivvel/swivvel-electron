import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenHqWindow = (args: OpenHqWindowArgs) => Promise<BrowserWindow>;

export interface OpenHqWindowArgs {
  companyId: string;
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

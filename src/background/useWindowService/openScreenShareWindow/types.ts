import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenScreenShareWindow = (
  args: OpenScreenShareWindowArgs
) => Promise<BrowserWindow>;

export interface OpenScreenShareWindowArgs {
  companyId: string;
  employeeId: string;
  employeeName: string | null;
  podId: string;
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

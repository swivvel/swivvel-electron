import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenScreenShareWindow = (
  args: OpenScreenShareOverlayWindowArgs
) => Promise<BrowserWindow>;

export interface OpenScreenShareOverlayWindowArgs {
  // employeeId: string;
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

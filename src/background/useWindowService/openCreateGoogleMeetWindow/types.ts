import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenCreateGoogleMeetWindow = (
  args: OpenCreateGoogleMeetArgs
) => Promise<BrowserWindow>;

export interface OpenCreateGoogleMeetArgs {
  meetingId: string | null;
  podId: string;
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenCreateGoogleMeetWindow = (
  args: OpenCreateGoogleMeetArgs
) => Promise<BrowserWindow>;

export interface OpenCreateGoogleMeetArgs {
  meetingUrl: string | null;
  podId: string | null;
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

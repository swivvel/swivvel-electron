import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenGoogleMeetWindow = (
  args: OpenGoogleMeetArgs
) => Promise<BrowserWindow>;

export interface OpenGoogleMeetArgs {
  meetingUrl: string | null;
  podId: string | null;
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

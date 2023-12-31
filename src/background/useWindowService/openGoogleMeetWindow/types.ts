import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { WindowOpenRequestHandler } from '../getWindowOpenRequestHandler';

export type OpenGoogleMeetWindow = (
  args: OpenGoogleMeetWindowArgs
) => Promise<BrowserWindow>;

export interface OpenGoogleMeetWindowArgs {
  meetingUrl: string | null;
  podId: string | null;
  state: State;
  windowOpenRequestHandler: WindowOpenRequestHandler;
}

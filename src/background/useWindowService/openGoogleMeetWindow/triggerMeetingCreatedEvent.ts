import { State } from '../../types';
import { Log } from '../utils';

export default (
  state: State,
  podId: string | null,
  meetingUrl: string,
  log: Log
): void => {
  if (state.windows.transparent && !state.windows.transparent.isDestroyed()) {
    log(`Sending meeting URL to transparent window...`);
    state.windows.transparent.webContents.send(
      `meetCreated`,
      podId,
      meetingUrl
    );
  } else {
    log(`Transparent window not found, could not save meeting URL`);
  }
};

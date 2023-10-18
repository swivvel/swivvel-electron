import { State } from '../../../types';
import { Log } from '../../utils';

export default (state: State, meetingUrl: string, log: Log): void => {
  if (state.windows.transparent) {
    log(`Sending meeting join event to transparent window...`);
    state.windows.transparent.webContents.send(`meetJoined`, meetingUrl);
  } else {
    log(`Transparent window not found, could not send join event`);
  }
};

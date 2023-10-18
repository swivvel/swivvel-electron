import { State } from '../../../types';
import { Log } from '../../utils';

export default (state: State, meetingUrl: string, log: Log): void => {
  if (state.windows.transparent) {
    log(`Sending meeting left event to transparent window...`);
    state.windows.transparent.webContents.send(`meetLeft`, meetingUrl);
  } else {
    log(`Transparent window not found, could not send left event`);
  }
};

import log from 'electron-log';

import { State } from '../../../types';

export default (state: State, meetingUrl: string): void => {
  if (state.windows.transparent) {
    log.info(`Sending meeting join event to transparent window...`);
    state.windows.transparent.webContents.send(`meetJoined`, meetingUrl);
  } else {
    log.info(`Transparent window not found, could not send join event`);
  }
};

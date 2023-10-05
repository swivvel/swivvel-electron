import log from 'electron-log';

import { State } from '../../../types';


export default (
  state: State,
  meetingUrl: string
): void => {
  if (state.windows.transparent) {
    log.info(`Sending meeting left event to transparent window...`);
    state.windows.transparent.webContents.send(
      `meetLeft`,
      meetingUrl
    );
  } else {
    log.info(`Transparent window not found, could not send left event`);
  }
}
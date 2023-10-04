import log from 'electron-log';

import { State } from "../../types";

export default (
  state: State,
  podId: string,
  meetingUrl: string
): void => {
  if (state.windows.transparent) {
    log.info(`Sending meeting URL to transparent window...`);
    state.windows.transparent.webContents.send(
      `meetBreakoutUrlCreatedForPod`,
      podId,
      meetingUrl
    );
  } else {
    log.info(`Transparent window not found, could not save meeting URL`);
  }
}
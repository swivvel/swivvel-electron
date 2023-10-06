import { ipcMain, powerMonitor } from 'electron';
import log from 'electron-log';

import { State } from './types';

// Consider the user to be idle after this number of seconds
const IDLE_THRESHOLD_SECONDS = 30;

interface IdleChangeEvent {
  isIdle: boolean;
  timestamp: number;
}

// The transparent window is responsible for sending idle change events to the
// server. However, sometimes the transparent window isn't available or is
// unable to contact the server. To avoid losing idle change events, we put
// them all in a buffer and continually attempt to send that buffer to the
// transparent window. After the transparent window successfully syncs an event,
// it informs the Electron app, which then removes the event from the buffer.
const buffer = new Map<string, IdleChangeEvent>();

const getKey = (idleChangeEvent: IdleChangeEvent): string => {
  return `${idleChangeEvent.isIdle}-${idleChangeEvent.timestamp}`;
};

/**
 * Tell the web app when the user is idle.
 */
export default (state: State): void => {
  log.info(`Configuring idle time polling...`);

  let isIdle: boolean | null = null;

  setInterval(async () => {
    const newIsIdle = powerMonitor.getSystemIdleTime() > IDLE_THRESHOLD_SECONDS;

    if (newIsIdle !== isIdle) {
      log.info(`Idle changed: ${isIdle} -> ${newIsIdle}`);
      isIdle = newIsIdle;
      const idleChangeEvent = { isIdle, timestamp: new Date().getTime() };
      log.info(`Adding idle change event to buffer: ${idleChangeEvent}`);
      buffer.set(getKey(idleChangeEvent), idleChangeEvent);
    }

    if (buffer.size > 0) {
      log.info(`Idle change events buffered: ${buffer.size}`);
      if (!state.windows.transparent) {
        log.info(`Failed to report idle change: no transparent window`);
      } else if (state.windows.transparent.isDestroyed()) {
        log.info(`Failed to report idle change: transparent window destroyed`);
      } else {
        log.info(`Reporting idle change to transparent window...`);
        state.windows.transparent.webContents.send(
          `idleChangeEventsBuffered`,
          Array.from(buffer.values())
        );
      }
    }
  }, 1000);

  ipcMain.on(
    `idleChangeEventsSynced`,
    async (event, idleChangeEvents: Array<IdleChangeEvent>): Promise<void> => {
      log.info(
        `Received idleChangeEventsSynced event, num synced=${idleChangeEvents.length}`
      );

      let numRemoved = 0;

      idleChangeEvents.forEach((idleChangeEvent) => {
        const removed = buffer.delete(getKey(idleChangeEvent));
        if (removed) {
          numRemoved += 1;
        }
      });

      log.info(`Removed ${numRemoved} idle change events from buffer`);
    }
  );

  log.info(`Configured idle time polling`);
};

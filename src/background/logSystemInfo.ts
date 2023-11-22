import os from 'os';

import { app } from 'electron';
import log from 'electron-log';

export default (): void => {
  log.info(`User Data: ${app.getPath(`userData`)}`);
  log.info(`Logs: ${app.getPath(`logs`)}`);
  log.info(`CPU: ${JSON.stringify(os.cpus())}`);
  log.info(`Memory: ${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`);
  log.info(`Free Memory: ${Math.round(os.freemem() / 1024 / 1024 / 1024)} GB`);
  log.info(`Type: ${os.type()}`);
  log.info(`Platform: ${os.platform()}`);
  log.info(`Release: ${os.release()}`);
  log.info(`Uptime: ${Math.round(os.uptime() / 60 / 60)} hours`);
};

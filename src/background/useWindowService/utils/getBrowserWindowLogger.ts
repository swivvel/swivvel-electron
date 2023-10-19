import log from 'electron-log';

export type Log = (msg: string) => void;

export default (windowId: string): Log => {
  return (msg) => {
    log.info(`[${windowId}] ${msg}`);
  };
};

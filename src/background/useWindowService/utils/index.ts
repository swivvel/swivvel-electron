import closeBrowserWindow from './closeBrowserWindow';
import getBrowserWindowLogger, { Log } from './getBrowserWindowLogger';
import loadRawJsFromFile from './loadRawJsFromFile';
import openBrowserWindow, { InstantiateWindow } from './openBrowserWindow';

export type { InstantiateWindow, Log };

export {
  closeBrowserWindow,
  getBrowserWindowLogger,
  loadRawJsFromFile,
  openBrowserWindow,
};

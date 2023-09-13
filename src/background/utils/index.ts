import isLinux from './isLinux';
import isProduction from './isProduction';
import loadUrl from './loadUrl';
import makeBrowserWindow, { WindowOpenHandler } from './makeBrowserWindow';
import prepareToQuitApp from './prepareToQuitApp';
import quitApp from './quitApp';
import removeQueryParams from './removeQueryParams';
import showErrorMessage from './showErrorMessage';
import sleep from './sleep';

export type { WindowOpenHandler };

export {
  isLinux,
  isProduction,
  loadUrl,
  makeBrowserWindow,
  prepareToQuitApp,
  quitApp,
  removeQueryParams,
  showErrorMessage,
  sleep,
};

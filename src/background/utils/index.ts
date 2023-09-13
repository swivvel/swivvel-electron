import isLinux from './isLinux';
import isProduction from './isProduction';
import loadInternalUrl from './loadInternalUrl';
import makeBrowserWindow, { WindowOpenHandler } from './makeBrowserWindow';
import prepareToQuitApp from './prepareToQuitApp';
import quitApp from './quitApp';
import removeQueryParams from './removeQueryParams';
import showGenericErrorMessage, { ErrorCode } from './showGenericErrorMessage';
import sleep from './sleep';

export type { WindowOpenHandler };

export {
  ErrorCode,
  isLinux,
  isProduction,
  loadInternalUrl,
  makeBrowserWindow,
  prepareToQuitApp,
  quitApp,
  removeQueryParams,
  showGenericErrorMessage,
  sleep,
};

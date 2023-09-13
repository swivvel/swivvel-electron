import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell,
} from 'electron';
import log from 'electron-log';

export type WindowOpenHandler = (
  url: string
) => { action: `allow` } | { action: `deny` } | null;

interface Options {
  browserWindowOptions?: BrowserWindowConstructorOptions;
  windowOpenHandler?: WindowOpenHandler;
}

export default (
  siteUrl: string,
  { browserWindowOptions, windowOpenHandler }: Options
): BrowserWindow => {
  const browserWindow = new BrowserWindow(browserWindowOptions);

  browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    log.info(`Caught URL opened by log in window: ${url}`);

    if (windowOpenHandler) {
      const result = windowOpenHandler(url);

      if (result) {
        return result;
      }
    }

    if (url.startsWith(siteUrl)) {
      log.info(`User opening internal URL`);

      // We are temporarily serving some HTML static files for support pages.
      // Eventually these will move to the public site but for now we want to
      // make sure they open in the browser.
      if (url.endsWith(`.html`)) {
        log.info(`Is HTML page, opening in browser`);
        shell.openExternal(url);
        return { action: `deny` };
      }

      log.info(`Opening internally`);
      return { action: `allow` };
    }

    log.info(`User opening external URL, opening in browser`);

    // Open all external URLs in the browser since we don't want users doing
    // general web browsing in the desktop app.
    shell.openExternal(url);
    return { action: `deny` };
  });

  return browserWindow;
};

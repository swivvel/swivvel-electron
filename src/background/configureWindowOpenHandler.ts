import { BrowserWindow, shell } from 'electron';
import log from 'electron-log';

/**
 * Configure whether URLs are opened in the Electron app or in the browser.
 */
export default (
  transparentWindow: BrowserWindow,
  siteUrl: string,
  callbacks: {
    onLogInPageOpened: () => void;
  }
): void => {
  log.info(`Configuring window open handler...`);

  transparentWindow.webContents.setWindowOpenHandler(({ url }) => {
    log.info(`!!!!`);
    log.info(url);
    log.info(`!!!!`);

    if (url.startsWith(siteUrl)) {
      // We are temporarily serving some HTML static files for support pages.
      // Eventually these will move to the public site but for now we want to
      // make sure they open in the browser.
      if (url.endsWith(`.html`)) {
        shell.openExternal(url);
        return { action: `deny` };
      }

      // We want to be able to reuse Google session cookies from the user's
      // browser, so we send them to the browser to log in. Auth0 will redirect
      // the user back to the desktop app using the `swivvel://` protocol.
      if (url.includes(`/api/auth/login`)) {
        callbacks.onLogInPageOpened();
        return { action: `deny` };
      }

      return { action: `allow` };
    }

    // Open all external URLs in the browser since we don't want users doing
    // general web browsing in the desktop app.
    shell.openExternal(url);
    return { action: `deny` };
  });

  log.info(`Configured window open handler`);
};

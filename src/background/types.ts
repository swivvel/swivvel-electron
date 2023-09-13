import { BrowserWindow } from 'electron';

export interface State {
  /**
   * Since Swivvel has a tray icon, we don't want the app to quit unless the
   * user explicitly quits the app from the tray menu
   */
  allowQuit: boolean;

  /**
   * The window that displays the HQ page of the web app
   */
  hqWindow: BrowserWindow | null;

  /**
   * The window that displays the Swivvel log in page.
   */
  logInWindow: BrowserWindow | null;

  /**
   * The transparent, always-on-top window
   */
  transparentWindow: BrowserWindow | null;
}

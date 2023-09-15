import { BrowserWindow, Tray } from 'electron';

export interface State {
  /**
   * Since Swivvel has a tray icon, we don't want the app to quit unless the
   * user explicitly quits the app from the tray menu
   */
  allowQuit: boolean;

  /**
   * True if the user has completed the log in flow and is authenticated.
   */
  logInFlowCompleted: boolean;

  /**
   * The Swivvel item in the OS system tray.
   */
  tray: Tray | null;

  /**
   * The different windows that the app can open.
   */
  windows: {
    /**
     * The window that displays the HQ page of the web app
     */
    hq: BrowserWindow | null;

    /**
     * The window that displays the Swivvel log in page.
     */
    logIn: BrowserWindow | null;

    /**
     * The window where new individual-auth users can set up their account.
     */
    setup: BrowserWindow | null;

    /**
     * The transparent, always-on-top window
     */
    transparent: BrowserWindow | null;
  };
}

import { BrowserWindow, Tray } from 'electron';

export interface State {
  /**
   * Since Swivvel has a tray icon, we don't want the app to quit unless the
   * user explicitly quits the app from the tray menu
   */
  allowQuit: boolean;

  /**
   * Info about the logged in user, if any.
   */
  loggedInUser: {
    email: string | null;
    id: string;
  } | null;

  /**
   * The Swivvel item in the OS system tray.
   */
  tray: Tray | null;

  /**
   * The different windows that the app can open.
   */
  windows: {
    /**
     * Window for opening existing Google Meet URLs and creating new
     * ad-hoc Google Meets.
     */
    googleMeet: BrowserWindow | null;

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
  } & Record<string, BrowserWindow | null>;
}

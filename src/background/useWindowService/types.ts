import { BrowserWindow } from 'electron';

export interface WindowService {
  openHqWindow: () => Promise<BrowserWindow>;
  openLogInWindow: () => Promise<BrowserWindow>;
  openTransparentWindow: () => Promise<BrowserWindow>;
  openTestWindow: () => Promise<BrowserWindow>;
}

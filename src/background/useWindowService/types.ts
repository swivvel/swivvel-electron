import { BrowserWindow } from 'electron';

export interface WindowService {
  openLogInWindow: () => Promise<BrowserWindow>;
  openHqWindow: () => Promise<BrowserWindow>;
  openTransparentWindow: () => Promise<BrowserWindow>;
}

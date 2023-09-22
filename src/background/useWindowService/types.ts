import { BrowserWindow } from 'electron';

export interface WindowService {
  openHqWindow: () => Promise<BrowserWindow>;
  openLogInWindow: () => Promise<BrowserWindow>;
  openSetupWindow: () => Promise<BrowserWindow>;
  openTransparentWindow: () => Promise<BrowserWindow>;
}

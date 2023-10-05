import { BrowserWindow } from 'electron';

export interface WindowService {
  closeAllWindows: () => void;
  openLogInWindow: () => Promise<BrowserWindow>;
  openTransparentWindow: () => Promise<BrowserWindow>;
}

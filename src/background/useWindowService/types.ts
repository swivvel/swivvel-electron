import { BrowserWindow } from 'electron';

export interface WindowService {
  closeAllWindows: () => void;
  openTransparentWindow: () => Promise<BrowserWindow>;
}

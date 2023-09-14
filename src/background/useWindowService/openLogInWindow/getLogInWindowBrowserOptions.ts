import { BrowserWindowConstructorOptions } from 'electron';

export default (preloadPath: string): BrowserWindowConstructorOptions => {
  return {
    height: 700,
    webPreferences: { preload: preloadPath },
    width: 720,
  };
};

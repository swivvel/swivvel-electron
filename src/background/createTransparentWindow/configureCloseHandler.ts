import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../types';

export default (transparentWindow: BrowserWindow, state: State): void => {
  log.info(`Configuring window close handler...`);

  transparentWindow.on(`close`, (event) => {
    if (!state.allowQuit) {
      event.preventDefault();
      transparentWindow.hide();
    }
  });
};

import { State } from '../types';

import createTray from './createTray';
import resetTray from './resetTray';
import { TrayService } from './types';
import updateTray from './updateTray';

/**
 * Service for managing the OS system tray.
 */
export default (state: State): TrayService => {
  return {
    createTray: (): void => {
      createTray(state);
    },
    resetTray: (): void => {
      resetTray(state);
    },
    updateTray: (menuItems): void => {
      updateTray(state, menuItems);
    },
  };
};

import { State } from '../types';

import createTray from './createTray';
import { TrayService } from './types';
import updateTray from './updateTray';

/**
 * Service for managing the OS system tray.
 */
export default (state: State, logoTemplatePath: string): TrayService => {
  return {
    createTray: (): void => {
      createTray(state, logoTemplatePath);
    },
    updateTray: (menuItems): void => {
      updateTray(state, logoTemplatePath, menuItems);
    },
  };
};

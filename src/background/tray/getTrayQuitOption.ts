import { MenuItemConstructorOptions } from 'electron';

import { State } from '../types';
import { quitApp } from '../utils';

export default (state: State): MenuItemConstructorOptions => {
  return {
    label: `Quit`,
    type: `normal`,
    click: (): void => {
      quitApp(state);
    },
  };
};

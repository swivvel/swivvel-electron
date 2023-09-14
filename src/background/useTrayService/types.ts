import { MenuItemConstructorOptions } from 'electron';

export type CreateTray = () => void;

export type ResetTray = () => void;

export type UpdateTray = (menuItems: Array<MenuItemConstructorOptions>) => void;

export interface TrayService {
  /**
   * Create an OS system tray item for Swivvel.
   */
  createTray: CreateTray;

  /**
   * Reset the tray to its default state, removing any custom menu items
   * that have been added.
   */
  resetTray: ResetTray;

  /**
   * Set the tray to have new menu items. A "Quit" item is automatically
   * added to the bottom of the menu.
   */
  updateTray: UpdateTray;
}

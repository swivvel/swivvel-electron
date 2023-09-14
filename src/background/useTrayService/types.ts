import { MenuItemConstructorOptions } from 'electron';

/**
 * Create an OS system tray item for Swivvel.
 */
export type CreateTray = () => void;

/**
 * Set the tray to have new menu items. A "Quit" item is automatically
 * added to the bottom of the menu.
 */
export type UpdateTray = (menuItems: Array<MenuItemConstructorOptions>) => void;

export interface TrayService {
  createTray: CreateTray;
  updateTray: UpdateTray;
}

import { MenuItemConstructorOptions, dialog } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { State } from '../../types';
import { quitApp, store, triggerSentryError } from '../../utils';

export default (state: State): Array<MenuItemConstructorOptions> => {
  const menuItems: Array<MenuItemConstructorOptions> = [];

  menuItems.push({
    label: `Check for Updates`,
    type: `normal`,
    click: async (): Promise<void> => {
      log.info(`Detected click on Check for Updates menu item`);

      const result = await autoUpdater.checkForUpdates();

      if (result?.cancellationToken) {
        if (
          state.windows.transparent &&
          !state.windows.transparent.isDestroyed()
        ) {
          const buttonIndex = dialog.showMessageBoxSync(
            state.windows.transparent,
            {
              title: `New version available`,
              message: result
                ? `Swivvel version ${result.updateInfo.version} is available. Click "OK" to download the update and restart Swivvel.`
                : `A new version of Swivvel is available. Click "OK" to download the update and restart Swivvel.`,
              buttons: [`Cancel`, `OK`],
            }
          );
          log.info(`Button index clicked: ${buttonIndex}`);
          if (buttonIndex === 0) {
            log.info(`Cancel button clicked. Aborting upgrade.`);
            return;
          }
        }
        await autoUpdater.downloadUpdate(result.cancellationToken);
        quitApp(state, { quitAndInstall: true });
      } else {
        if (
          state.windows.transparent &&
          !state.windows.transparent.isDestroyed()
        ) {
          dialog.showMessageBoxSync(state.windows.transparent, {
            title: `You are up to date`,
            message: result
              ? `You are on the latest version of Swivvel (${result.updateInfo.version}).`
              : `You are on the latest version of Swivvel.`,
          });
        }
      }
    },
  });

  // Normally we don't show debugging tools to end users, but it has been
  // difficult to debug some issues that have been reported, so we're showing
  // the dev tools menu item to everyone for now. This will allow us to have
  // users open the dev tools on a screen share so that we have more visibility
  // into what might be going wrong. Eventually we can hide this functionality
  // a bit better, e.g. via a global keyboard shortcut, but showing it in the
  // menu is simply the easiest thing to do right now.
  menuItems.push({
    label: `Dev Tools`,
    type: `normal`,
    click: (): void => {
      log.info(`Detected click on Dev Tools menu item`);
      if (
        state.windows.transparent &&
        !state.windows.transparent.isDestroyed()
      ) {
        state.windows.transparent.webContents.openDevTools({
          mode: `undocked`,
        });
      }
    },
  });

  menuItems.push({
    id: `windowedMode`,
    label: `Windowed Mode`,
    type: `checkbox`,
    checked: Boolean(store.get(`windowedMode`)),
    click: (): void => {
      log.info(`Detected click on Windowed Mode menu item`);

      const { tray, trayContextMenu } = state;

      if (!tray) {
        log.info(`No tray found in state; aborting`);
        return;
      }

      if (!trayContextMenu) {
        log.info(`No tray context menu found in state; aborting`);
        return;
      }

      const windowedModeItem = trayContextMenu.items.find((item) => {
        return item.id === `windowedMode`;
      });

      log.info(`windowedModeItem found: ${Boolean(windowedModeItem)}`);

      if (windowedModeItem) {
        const newWindowedMode = !store.get(`windowedMode`);
        log.info(`Setting windowed mode to ${newWindowedMode}`);
        store.set(`windowedMode`, newWindowedMode);
        windowedModeItem.checked = newWindowedMode;
        tray.setContextMenu(trayContextMenu);
        quitApp(state, { relaunch: true });
      }
    },
  });

  menuItems.push({
    label: `Send Bug Report`,
    type: `normal`,
    click: (): void => {
      log.info(
        `Detected click on Send Bug Report menu item; sending Sentry alert`
      );
      triggerSentryError(`Manual bug report`);
      dialog.showErrorBox(
        `Bug Report Sent`,
        `Thanks for sending. If you haven't already, please use the Chat Support menu option to send us a screenshot and a quick description.`
      );
    },
  });

  menuItems.push({
    label: `Quit Swivvel`,
    type: `normal`,
    click: (): void => {
      quitApp(state);
    },
  });

  return menuItems;
};

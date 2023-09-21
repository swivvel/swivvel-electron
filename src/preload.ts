import { contextBridge, ipcRenderer } from 'electron';

type IdleChangeCallback = (event: unknown, isIdle: boolean) => void;
type LaunchAudioRoomFromSetupCallback = (event: unknown) => void;

// NOTE: values exposed in the main world should be added to window.d.ts
// in the web app

contextBridge.exposeInMainWorld(`electron`, {
  // Feature flags can be used to gate features in the renderer if they would
  // be incompatible with old versions of the desktop app
  featureFlags: {
    // The log in flow that sends users to the browser to reuse their existing
    // Google session so they don't have to type their password
    loginFlowV2: true,
  },
  getIsProduction: (): Promise<boolean> => {
    return ipcRenderer.invoke(`isProduction`);
  },
  isLinux: process.platform === `linux`,
  launchAudioRoomFromSetup: () => {
    ipcRenderer.send(`launchAudioRoomFromSetup`);
  },
  offIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.off(`isIdle`, callback);
  },
  onIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.on(`isIdle`, callback);
  },
  onLaunchAudioRoomFromSetup: (callback: LaunchAudioRoomFromSetupCallback) => {
    ipcRenderer.on(`launchAudioRoomFromSetup`, callback);

    return (): void => {
      ipcRenderer.removeListener(`launchAudioRoomFromSetup`, callback);
    };
  },
});

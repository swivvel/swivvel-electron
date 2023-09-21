import { contextBridge, ipcRenderer } from 'electron';

type IdleChangeCallback = (event: unknown, isIdle: boolean) => void;
type JoinAudioRoomCallback = (event: unknown, podId: string) => void;

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
  offIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.off(`isIdle`, callback);
  },
  onIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.on(`isIdle`, callback);
  },
  onIdleChange2: (callback: IdleChangeCallback) => {
    ipcRenderer.on(`isIdle`, callback);

    return (): void => {
      ipcRenderer.removeListener(`isIdle`, callback);
    };
  },
  onJoinAudioRoomForPod: (callback: JoinAudioRoomCallback) => {
    ipcRenderer.on(`joinAudioRoomForPod`, callback);

    return (): void => {
      ipcRenderer.removeListener(`joinAudioRoomForPod`, callback);
    };
  },
  joinAudioRoomForPod: (podId: string) => {
    ipcRenderer.send(`joinAudioRoomForPod`, podId);
  },
});

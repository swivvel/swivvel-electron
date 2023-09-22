import { contextBridge, ipcRenderer } from 'electron';

type IdleChangeCallback = (event: unknown, isIdle: boolean) => void;
type JoinAudioRoomForPodCallback = (event: unknown, podId: string) => void;
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
  joinAudioRoomForPod: (podId: string) => {
    ipcRenderer.send(`joinAudioRoomForPod`, podId);
  },
  launchAudioRoomFromSetup: () => {
    ipcRenderer.send(`launchAudioRoomFromSetup`);
  },
  offIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.off(`isIdle`, callback);
  },
  onIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.on(`isIdle`, callback);
  },
  // We discovered that the `callback` passed from the web app gets modified
  // in some way before it reaches the preload script, causing calls to
  // `removeListener` to do nothing because they can't find a matching callback.
  // To work around this, our event handlers now return a function that can be
  // used to remove the listener, but we had to maintain the old idle-change
  // fields for backwards compatibility with old desktop clients.
  onIdleChange2: (callback: IdleChangeCallback) => {
    ipcRenderer.on(`isIdle`, callback);

    return (): void => {
      ipcRenderer.removeListener(`isIdle`, callback);
    };
  },
  onJoinAudioRoomForPod: (callback: JoinAudioRoomForPodCallback) => {
    ipcRenderer.on(`joinAudioRoomForPod`, callback);

    return (): void => {
      ipcRenderer.removeListener(`joinAudioRoomForPod`, callback);
    };
  },
  onLaunchAudioRoomFromSetup: (callback: LaunchAudioRoomFromSetupCallback) => {
    ipcRenderer.on(`launchAudioRoomFromSetup`, callback);

    return (): void => {
      ipcRenderer.removeListener(`launchAudioRoomFromSetup`, callback);
    };
  },
});

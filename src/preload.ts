import { contextBridge, ipcRenderer } from 'electron';

// NOTE: values exposed in the main world should be added to window.d.ts
// in the web app

contextBridge.exposeInMainWorld(`electron`, {
  /**
   * Deprecated: remove when all clients on v1.2.0
   */
  featureFlags: { loginFlowV2: true },

  /**
   * Return desktop app version from package.json (note: returns Electron
   * version in development)
   */
  getDesktopAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke(`getDesktopAppVersion`);
  },

  /**
   * Return true if desktop app is packaged (note: not the same as NODE_ENV)
   */
  getIsProduction: (): Promise<boolean> => {
    return ipcRenderer.invoke(`isProduction`);
  },

  /**
   * True if desktop app is running on Linux
   */
  isLinux: process.platform === `linux`,

  /**
   * Inform the transparent window that the user is requesting to join the
   * audio room for the given pod. Allows users to join audio room from other
   * windows.
   */
  joinAudioRoomForPod: (podId: string) => {
    ipcRenderer.send(`joinAudioRoomForPod`, podId);
  },

  /**
   * Inform the transparent window that the user is requesting to launch the
   * audio room from the setup flow (i.e. `<DesktopAppSetup>`). The setup flow
   * can't use `joinAudioRoomForPod` because the audio room widget hasn't been
   * opened yet.
   */
  launchAudioRoomFromSetup: () => {
    ipcRenderer.send(`launchAudioRoomFromSetup`);
  },

  /**
   * Deprecated: remove when all clients on v1.2.4
   */
  offIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.off(`isIdle`, callback);
  },

  /**
   * Deprecated: remove when all clients on v1.2.4
   */
  onIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.on(`isIdle`, callback);
  },

  /**
   * Deprecated: remove when all clients on v1.2.16
   */
  onIdleChange2: (callback: IdleChangeCallback) => {
    ipcRenderer.on(`isIdle`, callback);
    return (): void => {
      ipcRenderer.removeListener(`isIdle`, callback);
    };
  },

  /**
   * Listener allowing the transparent window to know when there are idle
   * change events that need to be synced.
   */
  onIdleChangeEventsBuffered: (callback: IdleChangeEventsBufferedCallback) => {
    ipcRenderer.on(`idleChangeEventsBuffered`, callback);
    return (): void => {
      ipcRenderer.removeListener(`idleChangeEventsBuffered`, callback);
    };
  },

  /**
   * Used by the transparent window to inform the idle poller that idle change
   * events have been synced to the server.
   */
  onIdleChangeEventsSynced: (idleChangeEvents: Array<IdleChangeEvent>) => {
    ipcRenderer.send(`idleChangeEventsSynced`, idleChangeEvents);
  },

  /**
   * Listener allowing the transparent window to know when the user has
   * requested to join the audio room for a pod.
   */
  onJoinAudioRoomForPod: (callback: JoinAudioRoomForPodCallback) => {
    ipcRenderer.on(`joinAudioRoomForPod`, callback);
    return (): void => {
      ipcRenderer.removeListener(`joinAudioRoomForPod`, callback);
    };
  },

  /**
   * Listener allowing the transparent window to know when the user has
   * requested to launch the audio room during the setup flow.
   */
  onLaunchAudioRoomFromSetup: (callback: LaunchAudioRoomFromSetupCallback) => {
    ipcRenderer.on(`launchAudioRoomFromSetup`, callback);
    return (): void => {
      ipcRenderer.removeListener(`launchAudioRoomFromSetup`, callback);
    };
  },

  /**
   * Listener allowing the transparent window to know when the user has
   * created a new Google Meet breakout room URL for a pod.
   */
  onMeetBreakoutUrlCreatedForPod: (
    callback: MeetBreakoutUrlCreatedForPodCallback
  ) => {
    ipcRenderer.on(`meetBreakoutUrlCreatedForPod`, callback);
    return (): void => {
      ipcRenderer.removeListener(`meetBreakoutUrlCreatedForPod`, callback);
    };
  },
});

type IdleChangeCallback = (event: unknown, isIdle: boolean) => void;
type IdleChangeEventsBufferedCallback = (
  event: unknown,
  idleChangeEvents: Array<IdleChangeEvent>
) => void;
type JoinAudioRoomForPodCallback = (event: unknown, podId: string) => void;
type LaunchAudioRoomFromSetupCallback = (event: unknown) => void;
type MeetBreakoutUrlCreatedForPodCallback = (
  event: unknown,
  meetUrl: string
) => void;

interface IdleChangeEvent {
  isIdle: boolean;
  timestamp: number;
}

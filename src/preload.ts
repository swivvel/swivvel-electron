/* eslint-disable no-console */
import { contextBridge, ipcRenderer } from 'electron';

import { ShareableMediaSource } from './types';

// NOTE: values exposed in the main world should be added to window.d.ts
// in the web app

console.log(`Preload script running...`);

contextBridge.exposeInMainWorld(`electron`, {
  featureFlags: {
    googleMeetsSupport: true, // Remove when all clients on v1.2.18
    loginFlowV2: true, // Remove when all clients on v1.2.0
    screenSharing: true, // Remove when all clients on v1.2.24
    triggerErrorSupport: true, // Remove when all clients on v1.2.27
  },

  /**
   * Return desktop app version from package.json (note: returns Electron
   * version in development)
   */
  getDesktopAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke(`getDesktopAppVersion`);
  },

  /**
   * Returns a list of media sources available for screen sharing
   */
  getDesktopSources: (): Promise<Array<ShareableMediaSource>> => {
    return ipcRenderer.invoke(`getDesktopSources`);
  },

  /**
   * Return true if desktop app is packaged (note: not the same as NODE_ENV)
   */
  getIsProduction: (): Promise<boolean> => {
    return ipcRenderer.invoke(`isProduction`);
  },

  /**
   * Return the permission access status for the given media type.
   */
  getMediaAccessStatus: (
    mediaType: 'microphone' | 'camera' | 'screen'
  ): Promise<
    'not-determined' | 'granted' | 'denied' | 'restricted' | 'unknown'
  > => {
    return ipcRenderer.invoke(`getMediaAccessStatus`, mediaType);
  },

  /**
   * Used by the app windows to inform the main process who the user is after
   * they authenticate. The user information is included in Sentry error
   * reports.
   */
  identifyUser: (user: { id: string; email: string | null } | null) => {
    ipcRenderer.send(`identifyUser`, user);
  },

  /**
   * Used by the transparent window to inform the main process that the user
   * has requested to log in via Google. The main process will open the log in
   * the browser.
   */
  initiateLogIn: () => {
    ipcRenderer.send(`initiateLogIn`);
  },

  /**
   * True if desktop app is running on Linux
   */
  isLinux: process.platform === `linux`,

  /**
   * True if desktop app is running on Mac
   */
  isMac: process.platform === `darwin`,

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
   * created a new Google Meet.
   */
  onMeetCreated: (callback: MeetCreatedCallback) => {
    ipcRenderer.on(`meetCreated`, callback);
    return (): void => {
      ipcRenderer.removeListener(`meetCreated`, callback);
    };
  },

  /**
   * Listener allowing the transparent window to know when the user has
   * joined a Google Meet in the electron window.
   */
  onMeetJoined: (callback: MeetJoinedCallback) => {
    ipcRenderer.on(`meetJoined`, callback);
    return (): void => {
      ipcRenderer.removeListener(`meetJoined`, callback);
    };
  },

  /**
   * Listener allowing the transparent window to know when the user has
   * left a Google Meet in the electron window.
   */
  onMeetLeft: (callback: MeetLeftCallback) => {
    ipcRenderer.on(`meetLeft`, callback);
    return (): void => {
      ipcRenderer.removeListener(`meetLeft`, callback);
    };
  },

  /**
   * Allows the transparent window to report when the mouse is over a
   * transparent area or an element so that the Electron process can decide
   * whether to ignore mouse events.
   */
  onMouseOverTransparentArea: (isOverTransparency: boolean) => {
    ipcRenderer.send(`onMouseOverTransparentArea`, isOverTransparency);
  },

  /**
   * Trigger a Sentry error on behalf of the user so that we can see their logs
   */
  triggerSentryError: () => {
    ipcRenderer.send(`triggerSentryError`);
  },
});

type IdleChangeCallback = (event: unknown, isIdle: boolean) => void;
type IdleChangeEventsBufferedCallback = (
  event: unknown,
  idleChangeEvents: Array<IdleChangeEvent>
) => void;
type JoinAudioRoomForPodCallback = (event: unknown, podId: string) => void;
type LaunchAudioRoomFromSetupCallback = (event: unknown) => void;
type MeetCreatedCallback = (
  event: unknown,
  podId: string | null,
  meetUrl: string
) => void;
type MeetJoinedCallback = (event: unknown, meetUrl: string) => void;
type MeetLeftCallback = (event: unknown, meetUrl: string) => void;

interface IdleChangeEvent {
  isIdle: boolean;
  timestamp: number;
}

console.log(`Preload script completed`);

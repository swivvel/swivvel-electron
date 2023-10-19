import { systemPreferences } from 'electron';
import log from 'electron-log';

export default async (): Promise<void> => {
  if (systemPreferences.askForMediaAccess) {
    log.info(`Requesting microphone access`);
    await systemPreferences.askForMediaAccess(`microphone`);
  } else {
    log.info(
      `Skipping microphone access request: askForMediaAccess is not available`
    );
  }
};

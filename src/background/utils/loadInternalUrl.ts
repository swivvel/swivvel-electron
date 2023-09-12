import { BrowserWindow } from 'electron';
import log from 'electron-log';

export default async (
  browserWindow: BrowserWindow,
  siteUrl: string,
  relativePath: string
): Promise<void> => {
  const url = `${siteUrl}${relativePath}`;

  log.info(`  Loading Swivvel URL: ${url}`);

  await browserWindow.loadURL(url);
};

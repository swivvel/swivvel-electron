import { net } from 'electron';

import { WindowService } from '../useWindowService';

export default async (
  callbackUrl: string,
  windowService: WindowService
): Promise<boolean> => {
  console.log(`calling transparent window login oAuth`);
  const transparentWindow = await windowService.openTransparentWindow();

  const requests = net.request({
    method: `GET`,
    url: callbackUrl,
    session: transparentWindow.webContents.session,
    useSessionCookies: true,
  });

  const resp = new Promise<boolean>((resolve, reject) => {
    requests.on(`response`, () => {
      transparentWindow.reload();
      resolve(true);
    });

    requests.on(`error`, (err) => {
      reject(err);
    });
  });

  requests.end();

  return resp;
};

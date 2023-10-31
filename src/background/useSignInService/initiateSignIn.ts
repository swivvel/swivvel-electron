import { net, shell } from 'electron';

import { WindowService } from '../useWindowService';
import { getSiteUrl } from '../utils';

export default async (windowService: WindowService): Promise<boolean> => {
  const transparentWindow = await windowService.openTransparentWindow();

  const requests = net.request({
    method: `GET`,
    url: `${getSiteUrl()}/api/auth/login?desktop=true`,
    redirect: `manual`,
    session: transparentWindow.webContents.session,
    useSessionCookies: true,
  });

  const resp = new Promise<boolean>((resolve, reject) => {
    requests.on(`response`, () => {
      reject(
        `Should not have received a non-redirect response from login endpoint`
      );
    });

    requests.on(`redirect`, (code, method, url) => {
      shell.openExternal(url);
      requests.abort();
      resolve(true);
    });

    requests.on(`error`, (err) => {
      reject(err);
    });
  });

  requests.end();

  return resp;
};

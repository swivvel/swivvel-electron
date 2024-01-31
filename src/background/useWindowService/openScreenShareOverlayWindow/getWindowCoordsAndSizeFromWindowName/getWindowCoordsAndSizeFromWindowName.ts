/* eslint-disable no-console */
import { PythonShell } from 'python-shell';

import { WindowCoordsAndSize } from '../types';

export default async (
  requestedWindowName: string
): Promise<WindowCoordsAndSize> => {
  return new Promise((resolve, reject) => {
    const pyshell = new PythonShell(
      `src/background/useWindowService/openScreenShareOverlayWindow/getWindowCoords.py`
    ).send(requestedWindowName);

    pyshell.on(`message`, (message) => {
      const data = JSON.parse(message) as WindowCoordsAndSize;

      resolve(data);
    });

    pyshell.end((err, code, signal) => {
      if (err) {
        reject(err);
      }

      console.log(`The exit code was: ${code}`);
      console.log(`The exit signal was: ${signal}`);
    });
  });
};

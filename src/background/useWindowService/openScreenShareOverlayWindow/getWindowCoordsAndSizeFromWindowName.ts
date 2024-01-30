/* eslint-disable no-console */
import { PythonShell } from 'python-shell';

import { Log } from '../utils';

export interface WindowCoordsAndSize {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default (requestedWindowName: string, log: Log): WindowCoordsAndSize => {
  console.log(`<< Getting Window Coords Size`);
  console.log(`<< ~~~~~~~~~~~~~~~ START ~~~~~~~~~~~~~~~~`);

  const pyshell = new PythonShell(
    `src/background/useWindowService/openScreenShareOverlayWindow/getWindowCoords.py`
  );

  pyshell.on(`message`, (message) => {
    console.log(message);
  });

  pyshell.end((err, code, signal) => {
    if (err) {
      throw err;
    }
    console.log(`The exit code was: ${code}`);
    console.log(`The exit signal was: ${signal}`);
    console.log(`finished`);
  });

  console.log(`<< ~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~`);

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
};

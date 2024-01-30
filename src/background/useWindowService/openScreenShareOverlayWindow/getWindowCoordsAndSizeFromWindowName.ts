/* eslint-disable no-console */
import { PythonShell } from 'python-shell';

export interface WindowCoordsAndSize {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default (requestedWindowName: string): WindowCoordsAndSize => {
  console.log(`<< Getting Window Coords Size`);
  console.log(`<< ~~~~~~~~~~~~~~~ START ~~~~~~~~~~~~~~~~`);

  const pyshell = new PythonShell(
    `src/background/useWindowService/openScreenShareOverlayWindow/getWindowCoords.py`
  ).send(requestedWindowName);

  pyshell.on(`message`, (message) => {
    console.log(`<< Got a message`);
    console.log(`<< Message: ${message}`);
    const data = JSON.parse(message);

    console.log(`<< Data: ${data}`);

    // const data = JSON.parse(message) as WindowCoordsAndSize;
    // console.log(`<< Coords: (${data.x},${data.y})`);
    // console.log(`<< Size: w:${data.width} h:${data.height}`);
  });

  pyshell.end((err, code, signal) => {
    if (err) {
      throw err;
    }

    console.log(`The exit code was: ${code}`);
    console.log(`The exit signal was: ${signal}`);
  });

  console.log(`<< ~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~`);

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
};

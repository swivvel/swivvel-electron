import { screen } from 'electron';

import { Bounds } from './types';

export default (log: (msg: string) => void): Bounds => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { workArea } = primaryDisplay;

  log(`All displays: ${JSON.stringify(screen.getAllDisplays(), null, 2)}`);

  log(`Primary display ID: ${primaryDisplay.id}`);
  log(`Using workArea bounds: ${JSON.stringify(workArea)}`);

  return {
    height: workArea.height,
    width: workArea.width,
    x: workArea.x,
    y: workArea.y,
  };
};

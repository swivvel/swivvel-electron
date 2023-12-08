import { desktopCapturer } from 'electron';

import { getShareableMediaSources } from '../utils';

export default (): void => {
  setInterval(async () => {
    const sources = await desktopCapturer.getSources({
      thumbnailSize: { height: 0, width: 0 },
      types: [`window`],
    });

    console.clear();
    console.log(new Date().toLocaleTimeString());
    console.log(JSON.stringify(sources, null, 2));
  }, 1000);
};

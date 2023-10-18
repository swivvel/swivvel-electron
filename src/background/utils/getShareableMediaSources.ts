import { desktopCapturer } from 'electron';

import { ShareableMediaSource } from '../../types';

export default async (): Promise<Array<ShareableMediaSource>> => {
  return desktopCapturer
    .getSources({
      thumbnailSize: { height: 200, width: 300 },
      types: [`window`, `screen`],
    })
    .then((sources) => {
      return sources.map((source) => {
        return {
          id: source.id,
          name: source.name,
          appIconUrl: source?.appIcon?.toDataURL(),
          thumbnailUrl: source?.thumbnail?.toDataURL(),
        };
      });
    });
};

import getWindowCoordsAndSizeFromWindowName from './getWindowCoordsAndSizeFromWindowName';
import { WindowCoordsAndSize } from './types';

export default async (
  targetWindowName: string
): Promise<WindowCoordsAndSize | null> => {
  try {
    const windowData =
      await getWindowCoordsAndSizeFromWindowName(targetWindowName);

    if (windowData) {
      return windowData;
    }
  } catch (error) {
    console.log(error);

    throw error;
  }

  return null;
};

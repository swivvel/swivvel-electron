import { State } from '../types';

export default (
  state: State,
  browserWindowId: number
): keyof State['windows'] | null => {
  let browserWindowName: keyof State['windows'] | null = null;

  Object.entries(state.windows).forEach(([name, window]) => {
    if (window?.id === browserWindowId) {
      browserWindowName = name as keyof State['windows'];
    }
  });

  return browserWindowName;
};

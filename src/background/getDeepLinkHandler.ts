import { dialog } from 'electron';

import { State } from './types';
import { ErrorCode, showGenericErrorMessage } from './utils';

export default (state: State): ((url: string) => void) => {
  return (url) => {
    dialog.showErrorBox(`Welcome Back`, `You arrived from: ${url}`);

    if (url.includes(`/api/auth/callback`)) {
      if (state.logInWindow) {
        state.logInWindow.close();
      }

      if (state.transparentWindow) {
        state.transparentWindow.reload();
      } else {
        showGenericErrorMessage({
          errorCode: ErrorCode.TransparentWindowMissingOnDeepLink,
        });
      }
    }
  };
};

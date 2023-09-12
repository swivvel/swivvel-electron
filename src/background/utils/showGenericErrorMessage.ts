import { dialog } from 'electron';

export enum ErrorCode {
  TransparentWindowMissingOnDeepLink = `1000`,
  UrlMissingOnSecondInstanceDeepLink = `2000`,
}

/**
 * Show an error message to the user.
 *
 * Include a unique error code so that we can more easily diagnose the issue
 * when the user sends a screenshot of the error dialog.
 */
export default ({ errorCode }: { errorCode: ErrorCode }): void => {
  dialog.showErrorBox(
    `Something went wrong`,
    `Please contact support@swivvel.io and provide the following error code: ${errorCode}.`
  );
};

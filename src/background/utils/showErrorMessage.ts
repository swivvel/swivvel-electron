import { dialog } from 'electron';

/**
 * Show an error message to the user in a dialog.
 */
export default (args?: { title?: string; description?: string }): void => {
  const title = args?.title || `Something went wrong`;
  const contactSupport = `Please contact support@swivvel.io`;

  let description = args?.description;

  if (description) {
    description = `${description}\n\n${contactSupport}`;
  } else {
    description = contactSupport;
  }

  dialog.showErrorBox(title, description);
};

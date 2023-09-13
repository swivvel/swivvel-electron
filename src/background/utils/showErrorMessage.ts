import { dialog } from 'electron';

/**
 * Show an error message to the user in a dialog.
 */
export default (args?: { title?: string; description?: string }): void => {
  const title = args?.title || `Swivvel encountered an error`;
  const contactSupport = `Contact support@swivvel.io if this problem persists.`;

  let description = args?.description;

  if (description) {
    description = `${description}\n\n${contactSupport}`;
  } else {
    description = contactSupport;
  }

  dialog.showErrorBox(title, description);
};

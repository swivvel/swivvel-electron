import getSiteUrl from './getSiteUrl';

// We open all external URLs in the browser unless they match one of these
const EXTERNAL_URLS_IN_ELECTRON = [
  `accounts.google.com`, // Google OAuth flow for SSO and integrations
  `slack.com/oauth`,
  `slack.com/signin`,
  `slack.com/workspace-signin`,
  `slack.com.*/login/`,
  `meet.google.com`
];

/**
 * Return true if the given URL should be opened in the user's default browser.
 *
 * The Electron window does not work well as a general browser because it
 * doesn't provide features such as back/forward buttons, a URL bar, etc.
 * As such, we try to be very conservative about what URLs we open in Electron.
 */
export default (url: string): boolean => {
  const isInternal = url.toLowerCase().startsWith(getSiteUrl().toLowerCase());
  const isExternal = !isInternal;

  if (isExternal) {
    const shouldOpenInElectron = EXTERNAL_URLS_IN_ELECTRON.some(
      (externalUrl) => {
        return url.match(new RegExp(externalUrl, `i`));
      }
    );

    return !shouldOpenInElectron;
  }

  // We are temporarily serving some HTML static files for support pages.
  // Eventually these will move to the public site but for now we want to
  // make sure they open in the browser.
  if (url.endsWith(`.html`)) {
    return true;
  }

  return false;
};

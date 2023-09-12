import { shell } from 'electron';

export default (
  targetUrl: string,
  siteUrl: string
): { action: 'deny' } | { action: 'allow' } => {
  if (targetUrl.startsWith(siteUrl)) {
    // We are temporarily serving some HTML static files for support pages.
    // Eventually these will move to the public site but for now we want to
    // make sure they open in the browser.
    if (targetUrl.endsWith(`.html`)) {
      shell.openExternal(targetUrl);
      return { action: `deny` };
    }

    return { action: `allow` };
  }

  // Open all external URLs in the browser since we don't want users doing
  // general web browsing in the desktop app.
  shell.openExternal(targetUrl);
  return { action: `deny` };
};

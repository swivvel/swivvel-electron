import getSiteUrl from './getSiteUrl';

export default (url: string): boolean => {
  const isInternal = url.toLowerCase().startsWith(getSiteUrl().toLowerCase());

  if (!isInternal) {
    return true;
  }

  // We are temporarily serving some HTML static files for support pages.
  // Eventually these will move to the public site but for now we want to
  // make sure they open in the browser.
  if (url.endsWith(`.html`)) {
    return true;
  }

  return false;
};

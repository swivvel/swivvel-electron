import isProduction from './isProduction';

export default (): string => {
  if (isProduction()) {
    return `https://app.localhost.architect.sh`;
    // return `https://app.swivvel.io`;
  }

  const appDevUrl = process.env.ELECTRON_APP_DEV_URL;

  if (!appDevUrl) {
    throw new Error(`Missing environment variable: ELECTRON_APP_DEV_URL`);
  }

  return appDevUrl;
};

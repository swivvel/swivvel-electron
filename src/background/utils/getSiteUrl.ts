import isProduction from './isProduction';

export default (): string => {
  // if (isProduction()) {
  //   return `https://app.swivvel.io`;
  // }

  return `https://app.localhost.architect.sh`;

  // const appDevUrl = process.env.ELECTRON_APP_DEV_URL;

  // if (!appDevUrl) {
  //   throw new Error(`Missing environment variable: ELECTRON_APP_DEV_URL`);
  // }

  // return appDevUrl;
};

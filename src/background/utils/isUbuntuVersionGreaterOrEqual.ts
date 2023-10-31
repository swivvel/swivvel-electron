import { UbuntuVersion } from './getUbuntuVersion';

export default (a: UbuntuVersion, b: UbuntuVersion): boolean => {
  const [aYear, aMonth] = a;
  const [bYear, bMonth] = b;

  if (aYear < bYear) {
    return false;
  }

  if (aYear > bYear) {
    return true;
  }

  if (aMonth < bMonth) {
    return false;
  }

  if (aMonth > bMonth) {
    return true;
  }

  return true;
};

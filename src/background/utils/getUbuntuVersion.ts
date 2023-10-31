import { execSync } from 'child_process';

import isLinux from './isLinux';

export type UbuntuVersion = [number, number];

const DISTRIBUTOR_REGEX = /Distributor ID:\s+(.*)/;
const RELEASE_REGEX = /Release:\s+(.*)/;

export default (): UbuntuVersion | null => {
  if (!isLinux()) {
    return null;
  }

  let stdout: string | null;

  try {
    stdout = execSync(`lsb_release -a`).toString();
  } catch (err) {
    stdout = null;
  }

  if (!stdout || typeof stdout !== `string`) {
    return null;
  }

  const distributorMatch = stdout.match(DISTRIBUTOR_REGEX);
  const releaseMatch = stdout.match(RELEASE_REGEX);

  if (!distributorMatch || !releaseMatch) {
    return null;
  }

  const distributor = distributorMatch.length >= 1 ? distributorMatch[1] : null;
  const release = releaseMatch.length >= 1 ? releaseMatch[1] : null;

  if (!distributor || !release || distributor.toLowerCase() !== `ubuntu`) {
    return null;
  }

  const versionParts = release.split(`.`);

  if (versionParts.length !== 2) {
    return null;
  }

  const [year, month] = versionParts.map((part) => {
    return parseInt(part, 10);
  });

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return null;
  }

  return [year, month];
};

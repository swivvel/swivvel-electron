import path from 'path';

const PRELOAD_PATH = path.join(__dirname, `..`, `..`, `preload.js`);

export default (): string => {
  return PRELOAD_PATH;
};

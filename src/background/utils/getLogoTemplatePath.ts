import path from 'path';

import isWindows from './isWindows';

const LOGO_TEMPLATE_PATH = path.join(__dirname, `..`, `..`, `logoTemplate.png`);
const WINDOWS_LOGO_TEMPLATE_PATH = path.join(
  __dirname,
  `..`,
  `..`,
  `logoTemplateWindows.png`
);

export default (): string => {
  if (isWindows()) {
    return WINDOWS_LOGO_TEMPLATE_PATH;
  }

  return LOGO_TEMPLATE_PATH;
};

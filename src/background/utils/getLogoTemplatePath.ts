import path from 'path';

const LOGO_TEMPLATE_PATH = path.join(__dirname, `..`, `..`, `logoTemplate.png`);

export default (): string => {
  return LOGO_TEMPLATE_PATH;
};

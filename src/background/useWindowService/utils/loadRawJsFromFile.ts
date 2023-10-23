import fs from 'fs';

export default (filePath: string): string | null => {
  const fileContents = fs.readFileSync(filePath, `utf-8`);

  const regexMatches = fileContents.match(/(async [\S\s]*);/);

  if (!regexMatches) {
    return null;
  }

  return regexMatches[1];
};

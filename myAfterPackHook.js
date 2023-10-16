exports.default = async (configuration) => {
  console.log('🐶 myBeforePackHook');

  console.log(JSON.stringify(configuration, null, 2));

  const getEnv = (name) => process.env[name.toUpperCase()] || null;

  const execSync = require('child_process').execSync;

  const hash = getEnv('SM_CODE_SIGNING_CERT_SHA1_HASH');

  console.log(execSync(`pwd`).toString());

  console.log(execSync(`ls dist/win-unpacked`).toString());

  execSync(
    `signtool.exe sign /sha1 ${hash} /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "./dist/win-unpacked/Swivvel.exe"`
  );
  execSync(`signtool.exe verify /v /pa "./dist/win-unpacked/Swivvel.exe"`);

  // execSync(
  //   `signtool.exe sign /sha1 ${hash} /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "D:\\a\\swivvel-electron\\swivvel-electron\\dist\\Swivvel-win.exe"`
  // );
  // execSync(
  //   `signtool.exe verify /v /pa "D:\\a\\swivvel-electron\\swivvel-electron\\dist\\Swivvel-win.exe"`
  // );
};

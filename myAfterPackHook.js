exports.default = async function (context) {
  console.log('🐶 myBeforePackHook');

  const getEnv = (name) => process.env[name.toUpperCase()] || null;

  const execSync = require('child_process').execSync;

  const hash = getEnv('SM_CODE_SIGNING_CERT_SHA1_HASH');

  console.log(execSync(`pwd`).toString());

  console.log(execSync(`ls`).toString());

  execSync(
    `signtool.exe sign /sha1 ${hash} /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "./dist/Swivvel-win.exe"`
  );
  execSync(`signtool.exe verify /v /pa "./dist/Swivvel-win.exe"`);

  execSync(
    `signtool.exe sign /sha1 ${hash} /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "D:\\a\\swivvel-electron\\swivvel-electron\\dist\\Swivvel-win.exe"`
  );
  execSync(
    `signtool.exe verify /v /pa "D:\\a\\swivvel-electron\\swivvel-electron\\dist\\Swivvel-win.exe"`
  );
};

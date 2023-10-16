exports.default = async (configuration) => {
  console.log('🐶 myBeforePackHook');

  console.log(JSON.stringify(configuration, null, 2));

  const getEnv = (name) => process.env[name.toUpperCase()] || null;

  const execSync = require('child_process').execSync;

  const hash = getEnv('SM_CODE_SIGNING_CERT_SHA1_HASH');

  console.log(execSync(`pwd`).toString());

  console.log(execSync(`ls dist/win-unpacked`).toString());

  const file = configuration.path;

  try {
    const sign = execSync(
      `signtool.exe sign /sha1 ${hash} /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "${file}"`
    );

    console.log(sign.toString());

    const verify = execSync(`signtool.exe verify /v /pa "${file}"`);

    console.log(verify.toString());

    console.log(`SUCCESS`);
  } catch (error) {
    console.log(error);
  }

  // execSync(
  //   `signtool.exe sign /sha1 ${hash} /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "D:\\a\\swivvel-electron\\swivvel-electron\\dist\\Swivvel-win.exe"`
  // );
  // execSync(
  //   `signtool.exe verify /v /pa "D:\\a\\swivvel-electron\\swivvel-electron\\dist\\Swivvel-win.exe"`
  // );
};

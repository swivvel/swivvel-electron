exports.default = async (configuration) => {
  const execSync = require('child_process').execSync;

  const getEnv = (name) => process.env[name.toUpperCase()] || null;
  const signingHash = getEnv(`SM_CODE_SIGNING_CERT_SHA1_HASH`);

  const file = configuration.path;

  const signCmd = `signtool.exe sign /sha1 ${signingHash} /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "${file}"`;
  // eslint-disable-next-line no-console
  console.log(execSync(signCmd).toString());

  const verifyCmd = `signtool.exe verify /v /pa "${file}"`;
  // eslint-disable-next-line no-console
  console.log(execSync(verifyCmd).toString());
};

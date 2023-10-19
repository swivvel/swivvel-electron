exports.default = async (configuration) => {
  const execSync = require('child_process').execSync;

  const getEnv = (name) => process.env[name.toUpperCase()] || null;
  const signingHash = getEnv(`SM_CODE_SIGNING_CERT_SHA1_HASH`);

  if (!signingHash) {
    console.log(`No signing hash found, skipping code signing.`);
    return;
  }

  const file = configuration.path;

  const signCmd = `signtool.exe sign /sha1 ${signingHash} /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "${file}"`;
  console.log(execSync(signCmd).toString());

  const verifyCmd = `signtool.exe verify /v /pa "${file}"`;
  console.log(execSync(verifyCmd).toString());
};

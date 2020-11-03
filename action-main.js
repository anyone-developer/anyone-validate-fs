const {execSync, exec} = require('child_process');
const setup = execSync('npm install --production');
console.info(setup.toString());

exec('node action.js', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout: ${stdout}`);
});

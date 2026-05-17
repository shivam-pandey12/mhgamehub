import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

function runNpmScript(scriptName) {
  if (isWindows) {
    return spawn('cmd.exe', ['/d', '/s', '/c', `${npmCommand} run ${scriptName}`], {
      stdio: 'inherit',
      shell: false
    });
  }
  return spawn(npmCommand, ['run', scriptName], {
    stdio: 'inherit',
    shell: false
  });
}

const children = [
  runNpmScript('server'),
  runNpmScript('dev')
];

function stopAll(signal = 'SIGTERM') {
  children.forEach((child) => {
    if (!child.killed) {
      child.kill(signal);
    }
  });
}

process.on('SIGINT', () => {
  stopAll('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll('SIGTERM');
  process.exit(0);
});

children.forEach((child) => {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stopAll();
      process.exit(code);
    }
  });
});

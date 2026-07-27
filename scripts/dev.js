const { spawn } = require('child_process');

console.log('🚀 Starting Pulse Full Stack Application...');
console.log('📡 Backend: http://localhost:4000');
console.log('🌐 Frontend: http://localhost:3000\n');

const serverProcess = spawn('npm', ['run', 'dev:server'], {
  stdio: 'inherit',
  shell: true,
});

const nextProcess = spawn('npm', ['run', 'dev:next'], {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  if (serverProcess) serverProcess.kill();
  if (nextProcess) nextProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

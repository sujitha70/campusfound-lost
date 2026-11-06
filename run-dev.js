const { spawn } = require('child_process');
const path = require('path');

console.log('\n======================================================');
console.log('🎒 Launching CampusLost & Found Hub Full Stack Dev');
console.log('======================================================');
console.log('👉 Backend will listen on: http://localhost:5000');
console.log('👉 Frontend will listen on: http://localhost:5173');
console.log('👉 Press Ctrl + C to stop all servers anytime.\n');

const isWindows = process.platform === 'win32';

// 1. Launch Backend (Express)
const backend = spawn(
  process.execPath,
  ['server.js'],
  {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    env: { ...process.env, PORT: process.env.PORT || '5000' }
  }
);

backend.on('error', (err) => {
  console.error('❌ Backend failed to start:', err.message);
});

// 2. Launch Frontend (Vite)
const viteEntry = path.join(__dirname, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js');
const frontend = spawn(
  process.execPath,
  [viteEntry],
  {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit'
  }
);

frontend.on('error', (err) => {
  console.error('❌ Frontend failed to start:', err.message);
});

// Clean shutdown on Ctrl+C
const shutdown = () => {
  console.log('\n🛑 Stopping backend and frontend servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


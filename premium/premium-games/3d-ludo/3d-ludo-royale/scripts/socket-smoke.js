import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { io } from 'socket.io-client';

const port = Number(process.env.SMOKE_SOCKET_PORT || 0) || 4301 + Math.floor(Math.random() * 300);
const url = `http://localhost:${port}/premium-ludo`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function emit(socket, event, payload = {}, timeout = 5000) {
  return new Promise((resolve, reject) => {
    socket.timeout(timeout).emit(event, payload, (error, response) => {
      if (error) {
        reject(new Error(`${event} timed out`));
        return;
      }
      if (response?.ok === false) {
        reject(new Error(response.message || `${event} failed`));
        return;
      }
      resolve(response || { ok: true });
    });
  });
}

async function connectClient(name) {
  const socket = io(url, {
    transports: ['websocket', 'polling'],
    timeout: 4000
  });
  await once(socket, 'connect');
  socket.playerName = name;
  return socket;
}

async function waitForEvent(socket, event, timeoutMs = 7000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(event, handler);
      reject(new Error(`${event} not received`));
    }, timeoutMs);
    const handler = (payload) => {
      clearTimeout(timer);
      resolve(payload);
    };
    socket.once(event, handler);
  });
}

async function main() {
  const server = spawn(process.execPath, ['server/index.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SOCKET_PORT: String(port),
      CLIENT_ORIGIN: 'http://localhost:5173'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let ready = false;
  server.stdout.on('data', (chunk) => {
    if (String(chunk).includes('server.started')) {
      ready = true;
    }
  });
  server.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  for (let index = 0; index < 40 && !ready; index += 1) {
    await wait(100);
  }
  if (!ready) {
    throw new Error('Socket server did not start.');
  }

  const a = await connectClient('Smoke A');
  const b = await connectClient('Smoke B');
  try {
    const create = await emit(a, 'room:create', {
      sessionId: 'smoke-private-a',
      displayName: 'Smoke A',
      playerCount: 2
    });
    await emit(b, 'room:join', {
      sessionId: 'smoke-private-b',
      displayName: 'Smoke B',
      roomCode: create.roomCode,
      preferredColor: 'blue'
    });
    await emit(b, 'room:ready', {
      sessionId: 'smoke-private-b',
      roomCode: create.roomCode,
      ready: true
    });
    await emit(a, 'room:start', {
      sessionId: 'smoke-private-a',
      roomCode: create.roomCode
    });

    const foundA = waitForEvent(a, 'matchmaking:found');
    const foundB = waitForEvent(b, 'matchmaking:found');
    await emit(a, 'matchmaking:join', {
      sessionId: 'smoke-public-a',
      displayName: 'Smoke A',
      playerCount: 2,
      botFillMode: 'off'
    });
    await emit(b, 'matchmaking:join', {
      sessionId: 'smoke-public-b',
      displayName: 'Smoke B',
      playerCount: 2,
      botFillMode: 'off'
    });
    const [matchA, matchB] = await Promise.all([foundA, foundB]);
    if (!matchA.room?.roomCode || matchA.room.roomCode !== matchB.room.roomCode) {
      throw new Error('Public matchmaking smoke did not create a shared room.');
    }

    console.log(`Socket smoke passed on ${url}`);
  } finally {
    a.disconnect();
    b.disconnect();
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

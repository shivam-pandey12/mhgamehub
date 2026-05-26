import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import express from 'express';
import { Server } from 'socket.io';
import { io as createSocketClient } from 'socket.io-client';
import { Chess } from 'chess.js';
import { chooseBotMove } from '../server/botPlayer.js';
import { registerPremiumChessRuntime } from '../server/index.js';

function tryMove(chess, move) {
  try {
    return chess.move(move);
  } catch {
    return null;
  }
}

function assertLegal(chess, move, label = 'move') {
  const result = tryMove(chess, move);
  assert.ok(result, `${label} should be legal`);
  return result;
}

function assertIllegal(chess, move, label = 'move') {
  const fenBefore = chess.fen();
  const result = tryMove(chess, move);
  assert.equal(result, null, `${label} should be rejected`);
  assert.equal(chess.fen(), fenBefore, `${label} should not mutate the board`);
}

function emitAck(socket, event, payload = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${event} acknowledgement timed out`)), 2500);
    socket.emit(event, payload, (response) => {
      clearTimeout(timer);
      resolve(response);
    });
  });
}

function waitForConnect(socket) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Socket connection timed out')), 2500);
    socket.once('connect', () => {
      clearTimeout(timer);
      resolve();
    });
    socket.once('connect_error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

async function createRuntimeHarness(t) {
  const app = express();
  const httpServer = createServer(app);
  const serverIo = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true
    }
  });
  const runtime = registerPremiumChessRuntime({ app, io: serverIo, healthPath: '/test-health' });
  const clients = [];

  await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  const { port } = httpServer.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(async () => {
    for (const room of runtime.rooms.values()) {
      clearTimeout(room.closeTimer);
      clearTimeout(room.botMoveTimer);
      clearTimeout(room.clock?.timeoutTimer);
    }
    for (const client of clients) {
      client.disconnect();
    }
    await new Promise((resolve) => serverIo.close(resolve));
    if (httpServer.listening) {
      await new Promise((resolve) => httpServer.close(resolve));
    }
  });

  async function connectClient() {
    const socket = createSocketClient(baseUrl, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true
    });
    clients.push(socket);
    await waitForConnect(socket);
    return socket;
  }

  return { connectClient };
}

test('basic legal movement is delegated to chess.js', () => {
  assertLegal(new Chess(), { from: 'e2', to: 'e4' }, 'pawn opening push');
  assertLegal(new Chess('8/8/8/3p4/4P3/8/8/4K2k w - - 0 1'), { from: 'e4', to: 'd5' }, 'pawn diagonal capture');
  assertIllegal(new Chess('8/8/8/8/4P3/4P3/8/4K2k w - - 0 1'), { from: 'e3', to: 'e4' }, 'pawn forward into occupied square');
  assertLegal(new Chess(), { from: 'g1', to: 'f3' }, 'knight jump');
  assertIllegal(new Chess(), { from: 'c1', to: 'g5' }, 'blocked bishop');
  assertIllegal(new Chess(), { from: 'a1', to: 'a3' }, 'blocked rook');
  assertLegal(new Chess('4k3/8/8/8/8/8/8/3QK3 w - - 0 1'), { from: 'd1', to: 'd7' }, 'queen straight move');
  assertLegal(new Chess('4k3/8/8/8/8/8/8/3QK3 w - - 0 1'), { from: 'd1', to: 'h5' }, 'queen diagonal move');
  assertLegal(new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1'), { from: 'e1', to: 'd1' }, 'king one-square move');
  assertIllegal(new Chess(), { from: 'e7', to: 'e5' }, 'moving opponent piece');
  assertIllegal(new Chess(), { from: 'e1', to: 'e2' }, 'capturing own piece');
});

test('check, pinned pieces, double-check, mate, and stalemate are enforced', () => {
  const checked = new Chess('6k1/4r3/8/8/8/8/8/4K3 w - - 0 1');
  assert.equal(checked.inCheck(), true);
  assertIllegal(checked, { from: 'e1', to: 'e2' }, 'king move along rook check');
  assertLegal(checked, { from: 'e1', to: 'f1' }, 'legal king escape');

  const pinned = new Chess('6k1/4r3/8/8/8/8/4B3/4K3 w - - 0 1');
  assertIllegal(pinned, { from: 'e2', to: 'd3' }, 'pinned bishop exposes king');

  const doubleCheck = new Chess('4r1k1/8/8/8/1b6/8/8/4K3 w - - 0 1');
  assert.equal(doubleCheck.inCheck(), true);
  assert.ok(doubleCheck.moves({ verbose: true }).every((move) => move.from === 'e1'), 'double-check only allows king moves');

  const mate = new Chess();
  assertLegal(mate, { from: 'f2', to: 'f3' });
  assertLegal(mate, { from: 'e7', to: 'e5' });
  assertLegal(mate, { from: 'g2', to: 'g4' });
  const finish = assertLegal(mate, { from: 'd8', to: 'h4' });
  assert.equal(finish.san, 'Qh4#');
  assert.equal(mate.isCheckmate(), true);
  assert.equal(mate.isGameOver(), true);
  assertIllegal(mate, { from: 'b1', to: 'c3' }, 'extra move after checkmate');

  const stalemate = new Chess('7k/5K2/6Q1/8/8/8/8/8 b - - 0 1');
  assert.equal(stalemate.isStalemate(), true);
  assert.equal(stalemate.isGameOver(), true);
});

test('castling rights and blocked castling conditions are enforced', () => {
  const whiteKingSide = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  const kingSide = assertLegal(whiteKingSide, { from: 'e1', to: 'g1' }, 'white kingside castle');
  assert.equal(kingSide.san, 'O-O');
  assert.equal(whiteKingSide.get('f1')?.type, 'r');
  assert.equal(whiteKingSide.get('h1'), undefined);

  const whiteQueenSide = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  const queenSide = assertLegal(whiteQueenSide, { from: 'e1', to: 'c1' }, 'white queenside castle');
  assert.equal(queenSide.san, 'O-O-O');
  assert.equal(whiteQueenSide.get('d1')?.type, 'r');

  assertLegal(new Chess('r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1'), { from: 'e8', to: 'g8' }, 'black kingside castle');
  assertLegal(new Chess('r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1'), { from: 'e8', to: 'c8' }, 'black queenside castle');
  assertIllegal(new Chess('r3k2r/8/8/8/8/5r2/8/R3K2R w KQkq - 0 1'), { from: 'e1', to: 'g1' }, 'castle through attacked square');
  assertIllegal(new Chess('r3k2r/8/8/8/8/4r3/8/R3K2R w KQkq - 0 1'), { from: 'e1', to: 'g1' }, 'castle while in check');

  const movedRook = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  assertLegal(movedRook, { from: 'h1', to: 'h2' });
  assertLegal(movedRook, { from: 'a8', to: 'a7' });
  assertLegal(movedRook, { from: 'h2', to: 'h1' });
  assertLegal(movedRook, { from: 'a7', to: 'a8' });
  assertIllegal(movedRook, { from: 'e1', to: 'g1' }, 'castle after rook moved');
});

test('en passant is immediate, removes the captured pawn, and expires', () => {
  const enPassant = new Chess('7k/8/8/3pP3/8/8/8/4K3 w - d6 0 1');
  const result = assertLegal(enPassant, { from: 'e5', to: 'd6' }, 'en passant capture');
  assert.ok(result.flags.includes('e'));
  assert.equal(enPassant.get('d6')?.type, 'p');
  assert.equal(enPassant.get('d5'), undefined);

  assertIllegal(new Chess('7k/8/8/3pP3/8/8/8/4K3 w - - 0 1'), { from: 'e5', to: 'd6' }, 'expired en passant square');

  const expiredAfterMove = new Chess('7k/8/8/3pP3/8/8/7P/4K3 w - d6 0 1');
  assertLegal(expiredAfterMove, { from: 'h2', to: 'h3' });
  assertLegal(expiredAfterMove, { from: 'h8', to: 'g8' });
  assertIllegal(expiredAfterMove, { from: 'e5', to: 'd6' }, 'en passant after an intervening move');
});

test('promotion choices, notation, and replayable move history are correct', () => {
  for (const promotion of ['q', 'r', 'b', 'n']) {
    const chess = new Chess('4k3/P7/8/8/8/8/8/4K3 w - - 0 1');
    const result = assertLegal(chess, { from: 'a7', to: 'a8', promotion }, `${promotion} promotion`);
    assert.equal(result.promotion, promotion);
    assert.equal(chess.get('a8')?.type, promotion);
  }

  const promotionNotation = assertLegal(new Chess('4k3/P7/8/8/8/8/8/4K3 w - - 0 1'), { from: 'a7', to: 'a8', promotion: 'q' });
  assert.match(promotionNotation.san, /=Q/);

  const source = new Chess();
  const history = [];
  for (const move of [
    { from: 'e2', to: 'e4' },
    { from: 'e7', to: 'e5' },
    { from: 'g1', to: 'f3' },
    { from: 'b8', to: 'c6' },
    { from: 'f1', to: 'b5' },
    { from: 'a7', to: 'a6' },
    { from: 'e1', to: 'g1' }
  ]) {
    const applied = assertLegal(source, move);
    history.push({ from: applied.from, to: applied.to, promotion: applied.promotion || undefined, san: applied.san });
  }

  const replay = new Chess();
  for (const move of history) {
    assertLegal(replay, move, `replay ${move.san}`);
  }
  assert.equal(replay.fen(), source.fen());
  assert.equal(history.at(-1).san, 'O-O');
});

test('supported draw rules are reported by chess.js', () => {
  assert.equal(new Chess('8/8/8/8/8/8/8/K6k w - - 0 1').isInsufficientMaterial(), true);
  assert.equal(new Chess('8/8/8/8/8/8/8/K6k w - - 0 1').isDraw(), true);
  assert.equal(new Chess('7k/8/8/8/8/8/8/R3K2R w - - 100 51').isDraw(), true);

  const repeated = new Chess();
  for (let index = 0; index < 3; index += 1) {
    assertLegal(repeated, { from: 'g1', to: 'f3' });
    assertLegal(repeated, { from: 'g8', to: 'f6' });
    assertLegal(repeated, { from: 'f3', to: 'g1' });
    assertLegal(repeated, { from: 'f6', to: 'g8' });
  }
  assert.equal(repeated.isThreefoldRepetition(), true);
  assert.equal(repeated.isDraw(), true);
});

test('server bot move chooser only returns legal moves', () => {
  for (const fen of [
    new Chess().fen(),
    'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    '7k/8/8/3pP3/8/8/8/4K3 w - d6 0 1',
    '4k3/P7/8/8/8/8/8/4K3 w - - 0 1'
  ]) {
    const chess = new Chess(fen);
    const move = chooseBotMove(chess);
    assert.ok(move, `bot should choose a move for ${fen}`);
    assertLegal(chess, move, `bot move ${move.from}${move.to}${move.promotion || ''}`);
  }
});

test('online server rejects wrong-turn and illegal moves before mutating room state', async (t) => {
  const { connectClient } = await createRuntimeHarness(t);
  const white = await connectClient();
  const black = await connectClient();
  const spectator = await connectClient();

  const created = await emitAck(white, 'createRoom', { preferredColor: 'w', playerName: 'White QA' });
  assert.equal(created.ok, true);
  assert.equal(created.color, 'w');

  const joined = await emitAck(black, 'joinRoom', {
    roomId: created.roomId,
    preferredColor: 'b',
    playerName: 'Black QA'
  });
  assert.equal(joined.ok, true);
  assert.equal(joined.color, 'b');

  const started = await emitAck(white, 'startMatch', { roomId: created.roomId });
  assert.equal(started.ok, true);
  assert.equal(started.turn, 'w');
  assert.ok(started.clock);

  const spectatorMove = await emitAck(spectator, 'move', {
    roomId: created.roomId,
    move: { from: 'e2', to: 'e4' }
  });
  assert.equal(spectatorMove.ok, false);
  assert.match(spectatorMove.error, /not seated/i);

  const wrongTurn = await emitAck(black, 'move', {
    roomId: created.roomId,
    move: { from: 'e7', to: 'e5' }
  });
  assert.equal(wrongTurn.ok, false);
  assert.match(wrongTurn.error, /not your turn/i);

  const illegal = await emitAck(white, 'move', {
    roomId: created.roomId,
    move: { from: 'e2', to: 'e5' }
  });
  assert.equal(illegal.ok, false);
  assert.match(illegal.error, /illegal/i);

  const legalWhite = await emitAck(white, 'move', {
    roomId: created.roomId,
    move: { from: 'e2', to: 'e4' }
  });
  assert.equal(legalWhite.ok, true);
  assert.equal(legalWhite.turn, 'b');
  assert.ok(legalWhite.clock);

  const repeatWhite = await emitAck(white, 'move', {
    roomId: created.roomId,
    move: { from: 'd2', to: 'd4' }
  });
  assert.equal(repeatWhite.ok, false);
  assert.match(repeatWhite.error, /not your turn/i);

  const legalBlack = await emitAck(black, 'move', {
    roomId: created.roomId,
    move: { from: 'e7', to: 'e5' }
  });
  assert.equal(legalBlack.ok, true);
  assert.equal(legalBlack.turn, 'w');

  const leave = await emitAck(white, 'leaveRoom', { roomId: created.roomId });
  assert.equal(leave.ok, true);
});

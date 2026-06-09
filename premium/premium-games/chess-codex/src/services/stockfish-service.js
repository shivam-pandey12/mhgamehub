import engineScriptUrl from 'stockfish/bin/stockfish-18-lite-single.js?url';
import engineWasmUrl from 'stockfish/bin/stockfish-18-lite-single.wasm?url';

export const AI_DIFFICULTY_PROFILES = {
  beginner: {
    label: 'Beginner',
    depth: 4,
    analysisDepth: 6,
    skill: 1
  },
  easy: {
    label: 'Easy',
    depth: 7,
    analysisDepth: 8,
    skill: 4
  },
  medium: {
    label: 'Medium',
    depth: 10,
    analysisDepth: 10,
    skill: 10
  },
  hard: {
    label: 'Hard',
    depth: 14,
    analysisDepth: 12,
    skill: 18
  },
  master: {
    label: 'Master',
    depth: 17,
    analysisDepth: 14,
    skill: 20
  }
};

export const AI_STYLE_PROFILES = {
  balanced: {
    label: 'Balanced',
    description: 'Classical engine choices with steady central control.'
  },
  aggressive: {
    label: 'Aggressive',
    description: 'Sharper openings and more tactical early choices.'
  },
  solid: {
    label: 'Solid',
    description: 'Reliable structures with lower-risk development.'
  },
  tricky: {
    label: 'Tricky',
    description: 'Playable but less predictable opening paths.'
  }
};

const OPENING_BOOK = {
  balanced: {
    w: [
      ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6'],
      ['d2d4', 'd7d5', 'c2c4', 'e7e6', 'b1c3', 'g8f6'],
      ['c2c4', 'e7e5', 'b1c3', 'g8f6', 'g2g3', 'd7d5']
    ],
    b: [
      ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6'],
      ['d2d4', 'd7d5', 'c2c4', 'e7e6', 'b1c3', 'g8f6'],
      ['c2c4', 'e7e5', 'b1c3', 'g8f6', 'g2g3', 'd7d5']
    ]
  },
  aggressive: {
    w: [
      ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4'],
      ['e2e4', 'e7e5', 'f2f4', 'e5f4', 'g1f3', 'g7g5'],
      ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7']
    ],
    b: [
      ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4'],
      ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7'],
      ['c2c4', 'e7e5', 'b1c3', 'f7f5', 'g2g3', 'g8f6']
    ]
  },
  solid: {
    w: [
      ['d2d4', 'd7d5', 'g1f3', 'g8f6', 'e2e3', 'e7e6'],
      ['c2c4', 'e7e6', 'g2g3', 'd7d5', 'f1g2', 'g8f6'],
      ['g1f3', 'd7d5', 'g2g3', 'g8f6', 'f1g2', 'e7e6']
    ],
    b: [
      ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1c3', 'g8f6'],
      ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'g1f3', 'd7d5'],
      ['c2c4', 'e7e6', 'g2g3', 'd7d5', 'f1g2', 'g8f6']
    ]
  },
  tricky: {
    w: [
      ['b2b3', 'd7d5', 'c1b2', 'g8f6', 'e2e3', 'e7e6'],
      ['g2g3', 'd7d5', 'f1g2', 'g8f6', 'c2c4', 'e7e6'],
      ['e2e4', 'c7c5', 'b2b4', 'c5b4', 'a2a3', 'b4a3']
    ],
    b: [
      ['e2e4', 'b7b6', 'd2d4', 'c8b7', 'b1c3', 'e7e6'],
      ['d2d4', 'f7f5', 'c2c4', 'g8f6', 'g2g3', 'e7e6'],
      ['c2c4', 'b7b5', 'c4b5', 'a7a6', 'b5a4', 'c7c5']
    ]
  }
};

function buildWorkerUrl() {
  const workerUrl = new URL(engineScriptUrl, window.location.href);
  workerUrl.hash = encodeURIComponent(new URL(engineWasmUrl, window.location.href).toString());
  return workerUrl;
}

function parseBestMove(line) {
  const parts = line.trim().split(/\s+/);
  const rawMove = parts[1];
  if (!rawMove || rawMove === '(none)') {
    return null;
  }

  return uciToMove(rawMove);
}

function parseScore(parts) {
  const scoreIndex = parts.indexOf('score');
  if (scoreIndex === -1 || scoreIndex + 2 >= parts.length) {
    return null;
  }

  const type = parts[scoreIndex + 1];
  const value = Number(parts[scoreIndex + 2]);
  if (!Number.isFinite(value)) {
    return null;
  }

  if (type === 'mate') {
    return {
      type: 'mate',
      value,
      numeric: value > 0 ? 100000 - Math.min(99, Math.abs(value)) * 1000 : -100000 + Math.min(99, Math.abs(value)) * 1000,
      display: value > 0 ? `M${Math.abs(value)}` : `-M${Math.abs(value)}`
    };
  }

  if (type === 'cp') {
    const pawns = value / 100;
    return {
      type: 'cp',
      value,
      numeric: value,
      display: `${pawns >= 0 ? '+' : ''}${pawns.toFixed(1)}`
    };
  }

  return null;
}

function parseInfoLine(line) {
  const parts = line.trim().split(/\s+/);
  if (parts[0] !== 'info' || !parts.includes('pv')) {
    return null;
  }

  const pvIndex = parts.indexOf('pv');
  const depthIndex = parts.indexOf('depth');
  const multipvIndex = parts.indexOf('multipv');
  const score = parseScore(parts);
  if (!score) {
    return null;
  }

  return {
    depth: depthIndex !== -1 ? Number(parts[depthIndex + 1]) || 0 : 0,
    multipv: multipvIndex !== -1 ? Number(parts[multipvIndex + 1]) || 1 : 1,
    score,
    pv: parts.slice(pvIndex + 1)
  };
}

function uciToMove(rawMove) {
  return {
    from: rawMove.slice(0, 2),
    to: rawMove.slice(2, 4),
    promotion: rawMove.length > 4 ? rawMove.slice(4, 5) : undefined
  };
}

function normalizeSearchMoves(searchMoves = []) {
  return searchMoves
    .map((move) => {
      if (!move) {
        return '';
      }
      if (typeof move === 'string') {
        return move.trim().toLowerCase();
      }
      return moveToUci(move);
    })
    .filter(Boolean);
}

function moveToUci(move) {
  if (!move?.from || !move?.to) {
    return '';
  }

  return `${move.from}${move.to}${move.promotion || ''}`.toLowerCase();
}

function uniqueByFirstMove(lines = []) {
  const seen = new Set();
  return lines.filter((line) => {
    const key = line.pv?.[0];
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function getBookMove({ history = [], color = 'b', style = 'balanced' } = {}) {
  const normalizedColor = color === 'w' ? 'w' : 'b';
  const normalizedStyle = AI_STYLE_PROFILES[style] ? style : 'balanced';
  const normalizedHistory = history.map((move) => String(move || '').trim().toLowerCase()).filter(Boolean);
  const families = [normalizedStyle, 'balanced'].filter((value, index, array) => array.indexOf(value) === index);

  for (const family of families) {
    const sequences = OPENING_BOOK[family]?.[normalizedColor] || [];
    for (const sequence of sequences) {
      if (normalizedHistory.length >= sequence.length) {
        continue;
      }
      const matchesPrefix = normalizedHistory.every((move, index) => sequence[index] === move);
      if (!matchesPrefix) {
        continue;
      }
      const nextMove = sequence[normalizedHistory.length];
      if (nextMove) {
        return uciToMove(nextMove);
      }
    }
  }

  return null;
}

export function evaluationToWhitePerspective(evaluation, turn = 'w') {
  if (!evaluation) {
    return null;
  }

  const sign = turn === 'w' ? 1 : -1;
  return {
    ...evaluation,
    value: evaluation.type === 'mate' ? evaluation.value * sign : evaluation.value * sign,
    numeric: evaluation.numeric * sign,
    display: evaluation.type === 'mate'
      ? (evaluation.value * sign > 0 ? `M${Math.abs(evaluation.value)}` : `-M${Math.abs(evaluation.value)}`)
      : `${evaluation.numeric * sign >= 0 ? '+' : ''}${((evaluation.numeric * sign) / 100).toFixed(1)}`
  };
}

export class AIEngineService {
  constructor() {
    this.worker = null;
    this.ready = false;
    this.readyPromise = null;
    this.pendingRequest = null;
  }

  async initialize() {
    if (this.ready) {
      return;
    }

    if (this.readyPromise) {
      return this.readyPromise;
    }

    this.readyPromise = new Promise((resolve, reject) => {
      let worker = null;
      const timeoutId = window.setTimeout(() => {
        this.readyPromise = null;
        this.ready = false;
        this.rejectPending(new Error('AI engine took too long to start.'));
        worker?.terminate();
        this.worker = null;
        reject(new Error('AI engine took too long to start.'));
      }, 15000);

      try {
        worker = new Worker(buildWorkerUrl(), {
          name: 'ai-analysis-engine',
          type: 'classic'
        });
      } catch (error) {
        window.clearTimeout(timeoutId);
        this.readyPromise = null;
        this.ready = false;
        reject(error instanceof Error ? error : new Error('AI engine failed to start.'));
        return;
      }

      this.worker = worker;
      worker.addEventListener('message', (event) => this.handleMessage(String(event.data), () => {
        window.clearTimeout(timeoutId);
        resolve();
      }));
      worker.addEventListener('error', (event) => {
        window.clearTimeout(timeoutId);
        const error = new Error(event.message || 'AI engine failed to start.');
        this.readyPromise = null;
        this.ready = false;
        this.worker = null;
        this.rejectPending(error);
        reject(error);
      });

      this.send('uci');
    });

    return this.readyPromise;
  }

  handleMessage(line, resolveReady) {
    if (line === 'uciok') {
      this.send('setoption name Hash value 24');
      this.send('ucinewgame');
      this.send('isready');
      return;
    }

    if (line === 'readyok') {
      this.ready = true;
      resolveReady?.();
      return;
    }

    if (line.startsWith('info') && this.pendingRequest?.kind === 'analysis') {
      const info = parseInfoLine(line);
      if (info) {
        this.pendingRequest.lines.set(info.multipv, info);
      }
      return;
    }

    if (!line.startsWith('bestmove')) {
      return;
    }

    const pending = this.pendingRequest;
    this.pendingRequest = null;
    if (!pending) {
      return;
    }

    const bestMove = parseBestMove(line);
    if (pending.kind === 'analysis') {
      const lines = uniqueByFirstMove(
        [...pending.lines.values()]
          .sort((left, right) => left.multipv - right.multipv)
          .map((item) => ({
            depth: item.depth,
            score: item.score,
            bestMove: item.pv[0] ? uciToMove(item.pv[0]) : null,
            pv: [...item.pv]
          }))
      );
      pending.resolve({
        bestMove,
        evaluation: lines[0]?.score || null,
        lines
      });
      return;
    }

    pending.resolve(bestMove);
  }

  send(command) {
    if (!this.worker) {
      return;
    }

    this.worker.postMessage(command);
  }

  rejectPending(error) {
    if (!this.pendingRequest) {
      return;
    }

    this.pendingRequest.reject(error);
    this.pendingRequest = null;
  }

  stop() {
    if (!this.worker) {
      return;
    }

    this.send('stop');
    this.rejectPending(new Error('AI request canceled.'));
  }

  configureProfile(profile) {
    this.send('ucinewgame');
    this.send(`setoption name Skill Level value ${profile.skill}`);
  }

  async analyzePosition({ fen, difficulty = 'easy' }) {
    const result = await this.analyzeDetailedPosition({ fen, difficulty, multiPv: 1 });
    return result.bestMove;
  }

  async analyzeDetailedPosition({
    fen,
    difficulty = 'medium',
    multiPv = 1,
    searchMoves = []
  }) {
    await this.initialize();
    this.stop();

    const profile = AI_DIFFICULTY_PROFILES[difficulty] || AI_DIFFICULTY_PROFILES.medium;
    const normalizedMultiPv = Math.max(1, Math.min(4, Number(multiPv) || 1));
    const normalizedSearchMoves = normalizeSearchMoves(searchMoves);
    this.configureProfile(profile);
    this.send(`setoption name MultiPV value ${normalizedMultiPv}`);
    this.send(`position fen ${fen}`);

    return new Promise((resolve, reject) => {
      this.pendingRequest = {
        kind: 'analysis',
        resolve,
        reject,
        lines: new Map()
      };
      const searchSuffix = normalizedSearchMoves.length > 0
        ? ` searchmoves ${normalizedSearchMoves.join(' ')}`
        : '';
      this.send(`go depth ${profile.analysisDepth || profile.depth}${searchSuffix}`);
    });
  }

  async evaluatePosition({ fen, difficulty = 'medium', multiPv = 2 }) {
    return this.analyzeDetailedPosition({
      fen,
      difficulty,
      multiPv
    });
  }

  destroy() {
    this.stop();
    if (!this.worker) {
      return;
    }

    this.send('quit');
    this.worker.terminate();
    this.worker = null;
    this.ready = false;
    this.readyPromise = null;
  }
}

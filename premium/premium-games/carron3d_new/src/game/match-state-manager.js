import { FoulManager } from './foul-manager.js';
import { QueenManager } from './queen-manager.js';
import { RulesEngine } from './rules-engine.js';
import { COINS_PER_PLAYER, ScoreManager, TOTAL_NORMAL_COINS } from './score-manager.js';
import { TurnManager } from './turn-manager.js';
import { getBotDifficultyProfile, getDefaultBotName, normalizeBotDifficulty } from '../bot/bot-difficulty.js';
import { getClassicRuleVariant, normalizeClassicRuleVariant } from '../config/carrom-constants.js';

function createMatchId() {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeCoinAssignmentMode(coinSide) {
  if (coinSide === 'fixed') {
    return 'p1White';
  }
  if (coinSide === 'black') {
    return 'p1Black';
  }
  if (coinSide === 'random' || coinSide === 'firstPocket' || coinSide === 'p1Black') {
    return coinSide;
  }
  return 'p1White';
}

function normalizeRuleMode(ruleMode) {
  return ruleMode === 'freeCapture' ? 'freeCapture' : 'classic';
}

function normalizeMatchMode(matchMode) {
  return matchMode === 'vsBot' ? 'vsBot' : 'local2p';
}

function matchModeLabel(matchMode) {
  return matchMode === 'vsBot' ? 'Human vs Bot' : 'Local 2 Player';
}

function resolveColors(coinAssignmentMode) {
  if (coinAssignmentMode === 'p1Black') {
    return { playerOne: 'black', playerTwo: 'white' };
  }
  if (coinAssignmentMode === 'random') {
    const playerOne = Math.random() > 0.5 ? 'white' : 'black';
    return { playerOne, playerTwo: playerOne === 'white' ? 'black' : 'white' };
  }
  if (coinAssignmentMode === 'firstPocket') {
    return { playerOne: null, playerTwo: null };
  }
  return { playerOne: 'white', playerTwo: 'black' };
}

function colorLabel(color, ruleMode = 'classic') {
  if (ruleMode === 'freeCapture') {
    return 'Any';
  }
  if (!color) {
    return 'Unassigned';
  }
  return color === 'white' ? 'White' : 'Black';
}

function ruleModeLabel(ruleMode, classicRuleVariant = 'casual') {
  if (ruleMode === 'freeCapture') {
    return 'Free Capture';
  }
  const variant = getClassicRuleVariant(classicRuleVariant);
  return `Classic - ${variant.label}`;
}

function createPointStatus(scores, playerOne, playerTwo) {
  return `${playerOne.name}: ${scores[playerOne.id].points} pts | ${playerTwo.name}: ${scores[playerTwo.id].points} pts`;
}

export class MatchStateManager {
  constructor(setup = {}) {
    this.scoreManager = new ScoreManager();
    this.queenManager = new QueenManager();
    this.foulManager = new FoulManager();
    this.rulesEngine = new RulesEngine({
      scoreManager: this.scoreManager,
      queenManager: this.queenManager,
      foulManager: this.foulManager
    });
    this.resetMatch(setup);
  }

  resetMatch(setup = {}) {
    const matchMode = normalizeMatchMode(setup.matchMode);
    const botDifficulty = normalizeBotDifficulty(setup.botDifficulty);
    const botProfile = getBotDifficultyProfile(botDifficulty);
    const ruleMode = normalizeRuleMode(setup.ruleMode);
    const classicRuleVariant = normalizeClassicRuleVariant(setup.classicRuleVariant);
    const coinAssignmentMode = normalizeCoinAssignmentMode(setup.coinSide || setup.coinAssignmentMode);
    const colors = ruleMode === 'freeCapture'
      ? { playerOne: null, playerTwo: null }
      : resolveColors(coinAssignmentMode);
    const scoringMode = ruleMode === 'freeCapture' || coinAssignmentMode === 'random' ? 'points' : 'coins';
    this.state = {
      matchId: createMatchId(),
      mode: 'local',
      matchMode,
      botDifficulty: matchMode === 'vsBot' ? botDifficulty : '',
      ruleMode,
      classicRuleVariant,
      setup: {
        matchMode,
        botDifficulty: matchMode === 'vsBot' ? botDifficulty : '',
        ruleMode,
        classicRuleVariant,
        coinSide: coinAssignmentMode,
        coinAssignmentMode,
        boardStyle: setup.boardStyle || 'ivory',
        matchType: setup.matchType || 'classic'
      },
      coinAssignmentMode,
      coinAssignment: {
        mode: coinAssignmentMode,
        isAssigned: ruleMode === 'freeCapture' ? false : coinAssignmentMode !== 'firstPocket',
        assignedByPlayerId: null,
        assignedShotNumber: null,
        firstPocketCoinId: null
      },
      scoringMode,
      status: 'playing',
      players: [
        {
          id: 'player-1',
          name: setup.playerOneName || 'Player 1',
          color: colors.playerOne,
          isBot: false,
          role: 'human',
          difficulty: '',
          pocketedOwnCoinIds: [],
          capturedCoinIds: [],
          dueCount: 0,
          returnedPenaltyCount: 0
        },
        {
          id: 'player-2',
          name: matchMode === 'vsBot'
            ? setup.playerTwoName || setup.botName || getDefaultBotName(botDifficulty)
            : setup.playerTwoName || 'Player 2',
          color: colors.playerTwo,
          isBot: matchMode === 'vsBot',
          role: matchMode === 'vsBot' ? 'bot' : 'human',
          difficulty: matchMode === 'vsBot' ? botProfile.id : '',
          pocketedOwnCoinIds: [],
          capturedCoinIds: [],
          dueCount: 0,
          returnedPenaltyCount: 0
        }
      ],
      currentPlayerId: 'player-1',
      turnNumber: 1,
      shotNumber: 0,
      queen: {
        state: 'onBoard',
        pocketedByPlayerId: null,
        pendingCoverPlayerId: null,
        pendingCoverShotNumber: null
      },
      pocketedPieces: {
        white: [],
        black: [],
        queen: false
      },
      lastShotSummary: null,
      lastFoul: '',
      messages: [
        `${setup.playerOneName || 'Player 1'} starts.`,
        matchMode === 'vsBot' ? `Vs Bot mode: ${botProfile.label} bot waits for Player 2 turns.` : '',
        ruleMode === 'freeCapture' ? 'Free Capture mode. Pocket any coin to score.' : '',
        ruleMode === 'classic' ? `${getClassicRuleVariant(classicRuleVariant).label} Classic rules active.` : '',
        ruleMode !== 'freeCapture' && coinAssignmentMode === 'random' ? 'Random side point mode active.' : '',
        coinAssignmentMode === 'firstPocket' ? 'First pocket decides color.' : ''
      ].filter(Boolean),
      winnerPlayerId: null,
      isDraw: false
    };
    this.turnManager = new TurnManager(this.state);
    return this.state;
  }

  quitCurrentMatch() {
    if (this.state.status === 'finished') {
      return this.createMatchResult({ messages: ['Match already finished.'] });
    }

    const quitter = this.turnManager.getCurrentPlayer();
    const winner = this.turnManager.getOpponentPlayer();
    this.state.status = 'finished';
    this.state.winnerPlayerId = winner.id;
    this.state.isDraw = false;
    this.state.lastFoul = 'forfeit';
    this.state.messages = [`${quitter.name} quit the match. ${winner.name} wins by forfeit.`];
    return this.createMatchResult({
      ruleResult: {
        isFoul: false,
        shouldSwitchTurn: false,
        shouldContinueTurn: false,
        queenCovered: false,
        queenReturned: false,
        queenPending: false,
        messages: [...this.state.messages],
        piecesToReturn: []
      },
      resolvedPlayer: quitter,
      activePlayer: winner,
      winner
    });
  }

  forfeitPlayer(playerId) {
    if (this.state.status === 'finished') {
      return this.createMatchResult({ messages: ['Match already finished.'] });
    }

    const quitter = this.state.players.find((player) => player.id === playerId)
      || this.turnManager.getCurrentPlayer();
    const winner = this.state.players.find((player) => player.id !== quitter.id)
      || this.turnManager.getOpponentPlayer();
    this.state.status = 'finished';
    this.state.winnerPlayerId = winner.id;
    this.state.isDraw = false;
    this.state.lastFoul = 'forfeit';
    this.state.messages = [`${quitter.name} left the match. ${winner.name} wins by forfeit.`];
    return this.createMatchResult({
      ruleResult: {
        isFoul: false,
        shouldSwitchTurn: false,
        shouldContinueTurn: false,
        queenCovered: false,
        queenReturned: false,
        queenPending: false,
        messages: [...this.state.messages],
        piecesToReturn: []
      },
      resolvedPlayer: quitter,
      activePlayer: winner,
      winner
    });
  }

  applyShotSummary(rawSummary) {
    if (this.state.status === 'finished') {
      return this.createMatchResult({ messages: ['Match already finished.'], piecesToReturn: [] });
    }

    this.state.shotNumber += 1;
    const summary = this.normalizeSummary(rawSummary);
    const currentPlayer = this.turnManager.getCurrentPlayer();
    const wasOpenUnassigned = this.isAwaitingFirstPocketAssignment();

    this.state.lastShotSummary = summary;
    if (wasOpenUnassigned && !summary.strikerPocketed) {
      this.assignFirstPocketColors(currentPlayer, summary);
    }

    summary.awaitedFirstPocketAssignment = wasOpenUnassigned;
    summary.colorAssignedThisShot = Boolean(summary.firstPocketAssignedColor);
    summary.queenReturnedBeforeAssignment = wasOpenUnassigned && summary.queenPocketed && summary.pocketed[0]?.type === 'queen';

    if (this.state.ruleMode === 'freeCapture') {
      this.scoreManager.applyCapturedCoins(this.state, currentPlayer.id, summary.pocketed);
    } else if (!wasOpenUnassigned || this.state.coinAssignment.isAssigned) {
      this.scoreManager.applyPocketedCoins(this.state, summary.pocketed);
    }

    const ruleResult = this.rulesEngine.evaluate(this.state, currentPlayer, summary);
    const piecesToReturn = this.applyRuleResult(ruleResult, currentPlayer);
    this.resolveWinner(currentPlayer, ruleResult);

    if (this.state.status !== 'finished') {
      if (ruleResult.shouldSwitchTurn) {
        this.turnManager.switchTurn();
      } else {
        this.turnManager.continueTurn();
      }
    }

    const activePlayer = this.turnManager.getCurrentPlayer();
    if (this.state.status !== 'finished') {
      const turnMessage = ruleResult.shouldSwitchTurn
        ? `Turn switched to ${activePlayer.name}.`
        : `${activePlayer.name} continues.`;
      this.state.messages.push(turnMessage);
    }

    return this.createMatchResult({
      ruleResult,
      piecesToReturn,
      resolvedPlayer: currentPlayer,
      activePlayer: this.turnManager.getCurrentPlayer(),
      winner: this.state.players.find((player) => player.id === this.state.winnerPlayerId) || null
    });
  }

  applyRuleResult(ruleResult, currentPlayer) {
    const piecesToReturn = [];

    (ruleResult.dueChanges || []).forEach((change) => {
      this.scoreManager.applyDueChange(this.state, change.playerId, change.delta);
    });

    if (ruleResult.queenCovered) {
      this.queenManager.markCovered(this.state, currentPlayer.id);
    } else if (ruleResult.queenPending) {
      this.queenManager.markPendingCover(this.state, currentPlayer.id, this.state.shotNumber);
    }

    const returnedIds = new Set();
    ruleResult.piecesToReturn.forEach((piece) => {
      if (returnedIds.has(piece.id)) {
        return;
      }
      returnedIds.add(piece.id);

      if (piece.type === 'queen') {
        piecesToReturn.push(this.queenManager.returnQueen(this.state));
        return;
      }

      const returnedCoin = this.scoreManager.returnCoinToBoard(this.state, piece.id) || (
        piece.type === 'coin'
          ? { id: piece.id, type: 'coin', color: piece.color }
          : null
      );
      if (returnedCoin) {
        piecesToReturn.push(returnedCoin);
      }
    });

    this.state.lastFoul = ruleResult.foulType || '';
    this.state.messages = ruleResult.messages.length ? [...ruleResult.messages] : ['Shot settled.'];
    return piecesToReturn;
  }

  resolveWinner(currentPlayer, ruleResult) {
    if (ruleResult.isFoul) {
      return;
    }

    if (this.state.ruleMode === 'freeCapture') {
      this.resolveFreeCaptureWinner();
      return;
    }

    if (this.scoreManager.hasAllOwnCoins(this.state, currentPlayer.id) && this.queenManager.isCovered(this.state)) {
      this.state.status = 'finished';
      this.state.winnerPlayerId = currentPlayer.id;
      this.state.messages.push(`${currentPlayer.name} wins.`);
    }
  }

  resolveFreeCaptureWinner() {
    const totalPocketed = this.scoreManager.getTotalNormalCoinsPocketed(this.state);
    const queenResolved = this.state.queen.state !== 'pendingCover';
    if (totalPocketed < TOTAL_NORMAL_COINS || !queenResolved) {
      return;
    }

    const scores = this.scoreManager.getScoreSnapshot(this.state);
    const [playerOne, playerTwo] = this.state.players;
    const playerOneScore = scores[playerOne.id].points;
    const playerTwoScore = scores[playerTwo.id].points;

    this.state.status = 'finished';
    if (playerOneScore > playerTwoScore) {
      this.state.winnerPlayerId = playerOne.id;
      this.state.messages.push(`${playerOne.name} wins Free Capture.`);
      return;
    }
    if (playerTwoScore > playerOneScore) {
      this.state.winnerPlayerId = playerTwo.id;
      this.state.messages.push(`${playerTwo.name} wins Free Capture.`);
      return;
    }

    const queenHolder = this.state.queen.state === 'covered'
      ? this.state.players.find((player) => player.id === this.state.queen.pocketedByPlayerId)
      : null;
    if (queenHolder) {
      this.state.winnerPlayerId = queenHolder.id;
      this.state.messages.push(`${queenHolder.name} wins on queen tie-break.`);
      return;
    }

    this.state.isDraw = true;
    this.state.messages.push('Free Capture ends in a draw.');
  }

  isAwaitingFirstPocketAssignment() {
    return this.state.ruleMode !== 'freeCapture'
      && this.state.coinAssignmentMode === 'firstPocket'
      && !this.state.coinAssignment.isAssigned;
  }

  assignFirstPocketColors(currentPlayer, summary) {
    const firstColorCoin = summary.pocketed.find((piece) => (
      piece.type === 'coin' && (piece.color === 'white' || piece.color === 'black')
    ));
    if (!firstColorCoin) {
      return false;
    }

    const opponent = this.turnManager.getOpponentPlayer();
    currentPlayer.color = firstColorCoin.color;
    opponent.color = firstColorCoin.color === 'white' ? 'black' : 'white';
    this.state.coinAssignment.isAssigned = true;
    this.state.coinAssignment.assignedByPlayerId = currentPlayer.id;
    this.state.coinAssignment.assignedShotNumber = this.state.shotNumber;
    this.state.coinAssignment.firstPocketCoinId = firstColorCoin.id;
    summary.firstPocketAssignedColor = firstColorCoin.color;
    summary.firstPocketAssignedPlayerId = currentPlayer.id;
    return true;
  }

  normalizeSummary(summary = {}) {
    const seen = new Set();
    const pocketed = (summary.pocketed || []).filter((piece) => {
      if (!piece?.id || seen.has(piece.id)) {
        return false;
      }
      seen.add(piece.id);
      return true;
    });

    return {
      ...summary,
      pocketed,
      pocketedCount: pocketed.length,
      strikerPocketed: pocketed.some((piece) => piece.type === 'striker'),
      queenPocketed: pocketed.some((piece) => piece.type === 'queen'),
      coinPocketedIds: pocketed.filter((piece) => piece.type === 'coin').map((piece) => piece.id)
    };
  }

  getCurrentPlayer() {
    return this.turnManager.getCurrentPlayer();
  }

  getActiveBaseline() {
    return this.turnManager.getActiveBaseline();
  }

  createMatchResult({ ruleResult = null, piecesToReturn = [], messages = null, resolvedPlayer = null, activePlayer = null, winner = null } = {}) {
    return {
      state: this.state,
      ruleResult,
      piecesToReturn,
      activeBaseline: this.getActiveBaseline(),
      resolvedPlayer,
      activePlayer: activePlayer || this.getCurrentPlayer(),
      winner,
      hud: this.toHudMatch(messages)
    };
  }

  toHudMatch(messagesOverride = null) {
    const playerOne = this.state.players[0];
    const playerTwo = this.state.players[1];
    const current = this.getCurrentPlayer();
    const scores = this.scoreManager.getScoreSnapshot(this.state);
    const winner = this.state.players.find((player) => player.id === this.state.winnerPlayerId) || null;
    const messages = messagesOverride || this.state.messages;
    const pointsEnabled = this.state.scoringMode === 'points';
    const pointStatus = createPointStatus(scores, playerOne, playerTwo);
    const freeCapture = this.state.ruleMode === 'freeCapture';
    const colorsAssigned = freeCapture ? true : this.state.coinAssignment?.isAssigned !== false;
    const statusMessages = freeCapture
      ? [...messages, 'Free Capture: pocket any coin. Every captured coin counts for you.']
      : colorsAssigned || messages.some((message) => message.includes('First pocket decides color'))
      ? messages
      : [...messages, 'First pocket decides color.'];
    const totalRemaining = Math.max(TOTAL_NORMAL_COINS - this.scoreManager.getTotalNormalCoinsPocketed(this.state), 0);
    const playerOneScore = freeCapture
      ? `${scores[playerOne.id].pocketed} captured`
      : `${scores[playerOne.id].pocketed}/${COINS_PER_PLAYER}`;
    const playerTwoScore = freeCapture
      ? `${scores[playerTwo.id].pocketed} captured`
      : `${scores[playerTwo.id].pocketed}/${COINS_PER_PLAYER}`;
    const winnerName = this.state.isDraw ? 'Match' : winner?.name || '';
    const winnerColor = this.state.isDraw ? 'Scores tied' : winner ? colorLabel(winner.color, this.state.ruleMode) : '';
    const resultScore = pointsEnabled
      ? `${scores[playerOne.id].points} - ${scores[playerTwo.id].points} pts`
      : `${scores[playerOne.id].pocketed} - ${scores[playerTwo.id].pocketed}`;
    const resultColorSummary = freeCapture
      ? `Free Capture | ${playerOne.name}: ${scores[playerOne.id].pocketed} coins | ${playerTwo.name}: ${scores[playerTwo.id].pocketed} coins`
      : `${playerOne.name}: ${colorLabel(playerOne.color)} | ${playerTwo.name}: ${colorLabel(playerTwo.color)}`;
    const queenHolder = this.state.queen.state === 'covered'
      ? this.state.players.find((player) => player.id === this.state.queen.pocketedByPlayerId)
      : null;
    const queenDisplayStatus = freeCapture && queenHolder
      ? `Covered by ${queenHolder.name} (+3)`
      : this.queenManager.getDisplayStatus(this.state);

    return {
      currentTurn: winner ? winner.name : current.name,
      currentColor: colorLabel((winner || current).color, this.state.ruleMode),
      matchMode: this.state.matchMode,
      matchModeLabel: matchModeLabel(this.state.matchMode),
      botDifficulty: this.state.botDifficulty,
      botDifficultyLabel: this.state.botDifficulty ? getBotDifficultyProfile(this.state.botDifficulty).label : '',
      currentIsBot: Boolean(current.isBot),
      ruleMode: this.state.ruleMode,
      ruleModeLabel: ruleModeLabel(this.state.ruleMode, this.state.classicRuleVariant),
      classicRuleVariant: this.state.classicRuleVariant,
      classicRuleVariantLabel: getClassicRuleVariant(this.state.classicRuleVariant).label,
      playerOneName: playerOne.name,
      playerTwoName: playerTwo.name,
      playerOneColor: colorLabel(playerOne.color, this.state.ruleMode),
      playerTwoColor: colorLabel(playerTwo.color, this.state.ruleMode),
      playerOneScore,
      playerTwoScore,
      playerOnePocketed: scores[playerOne.id].pocketed,
      playerTwoPocketed: scores[playerTwo.id].pocketed,
      playerOneRemaining: freeCapture ? totalRemaining : scores[playerOne.id].remaining,
      playerTwoRemaining: freeCapture ? totalRemaining : scores[playerTwo.id].remaining,
      scoringMode: this.state.scoringMode,
      coinAssignmentMode: this.state.coinAssignmentMode,
      colorsAssigned,
      playerOnePoints: scores[playerOne.id].points,
      playerTwoPoints: scores[playerTwo.id].points,
      pointsLabel: pointsEnabled ? pointStatus : '',
      playerOneDue: scores[playerOne.id].dueCount,
      playerTwoDue: scores[playerTwo.id].dueCount,
      dueStatus: scores[playerOne.id].dueCount || scores[playerTwo.id].dueCount
        ? `${playerOne.name}: ${scores[playerOne.id].dueCount} | ${playerTwo.name}: ${scores[playerTwo.id].dueCount}`
        : '',
      queenStatus: queenDisplayStatus,
      shotPower: this.state.status === 'finished' ? 'Match over' : 'Ready',
      shotPowerRatio: 0,
      turnNumber: this.state.turnNumber,
      shotNumber: this.state.shotNumber,
      foulStatus: this.state.lastFoul ? 'Foul' : 'Clear',
      status: statusMessages.join(' '),
      bannerTone: this.state.winnerPlayerId || this.state.isDraw ? 'success' : this.state.lastFoul ? 'danger' : this.state.queen.state === 'pendingCover' ? 'warning' : 'default',
      winnerName,
      winnerColor,
      resultOutcome: this.state.isDraw ? 'Drawn' : 'Wins',
      resultScore,
      resultColorSummary,
      resultQueenStatus: queenDisplayStatus,
      resultTurns: this.state.turnNumber,
      resultShots: this.state.shotNumber
    };
  }
}

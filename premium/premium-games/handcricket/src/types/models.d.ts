export type RouteName =
  | "home"
  | "room"
  | "lobby"
  | "draft"
  | "toss"
  | "lineup"
  | "match"
  | "result"
  | "history"
  | "rules";

export type RoomStatus = "idle" | "lobby" | "draft" | "toss" | "lineup" | "live" | "completed";
export type MatchPhase = "setup" | "toss" | "lineup" | "live" | "innings-break" | "complete";
export type MatchMode = "single" | "two-batsmen";
export type BowlingMode = "free-change" | "over-locked";
export type ConnectionStatus = "connected" | "waiting" | "syncing" | "reconnecting" | "offline";
export type PlayerRole = "captain" | "player";
export type PlayerStatus = "ready" | "unready" | "joining" | "thinking" | "away";
export type Side = "batting" | "bowling";
export type ControlMode = "local-vs-ai" | "hotseat";
export type TossCall = "heads" | "tails";
export type TossDecision = "bat" | "bowl";
export type BallResultType = "run" | "wicket" | "dot";
export type DraftStatus = "pending" | "live" | "complete";
export type RevealStateStatus = "idle" | "waiting" | "locked" | "revealing";

export interface ConnectionState {
  status: ConnectionStatus;
  lastSyncAt: number | null;
  latencyMs: number;
  note?: string;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isLocal: boolean;
  isMock: boolean;
  role: PlayerRole;
  status: PlayerStatus;
  avatarSeed: string;
  connectionState: ConnectionState;
}

export interface PlayerMatchStats {
  runs: number;
  ballsFaced: number;
  wicketsTaken: number;
  ballsBowled: number;
  dismissals: number;
}

export interface Team {
  id: string;
  name: string;
  captainId: string;
  playerIds: string[];
  battingOrder: string[];
  bowlingOrder: string[];
  currentBowlerId: string | null;
  lockedLineup: boolean;
  stats: Record<string, PlayerMatchStats>;
}

export interface Lineup {
  teamId: string;
  battingOrder: string[];
  bowlingOrder: string[];
  locked: boolean;
}

export interface DraftPickEvent {
  teamId: string;
  playerId: string;
  pickedAt: number;
  auto: boolean;
}

export interface DraftState {
  status: DraftStatus;
  availablePlayerIds: string[];
  currentPickIndex: number;
  pickSequence: string[];
  picks: DraftPickEvent[];
}

export interface RoomSettings {
  matchMode: MatchMode;
  bowlingMode: BowlingMode;
  overs: number;
  playersPerTeam: number;
  controlMode: ControlMode;
  numberSetMode: "classic" | "range" | "custom" | "preset";
  numberSetPreset: string;
  numberSetLabel: string;
  allowedNumbers: number[];
  numberRangeMin: number;
  numberRangeMax: number;
  customNumbersText: string;
  aiDifficulty?: "beginner" | "medium" | "hard";
}

export interface Room {
  id: string;
  code: string;
  source?: "realtime" | "offline";
  teamNames?: {
    alpha: string;
    beta: string;
  };
  hostId: string;
  maxPlayers: number;
  playerIds: string[];
  players: Player[];
  status: RoomStatus;
  connectionState: ConnectionState;
  settings: RoomSettings;
  captains: {
    alpha: string | null;
    beta: string | null;
  };
  teamSelections: {
    alpha: string[];
    beta: string[];
  };
  teams: {
    alpha: Team | null;
    beta: Team | null;
  };
  lineups?: {
    alpha: Lineup | null;
    beta: Lineup | null;
  };
  draftState?: DraftState | null;
  tossResult?: TossResult | null;
  createdAt: number;
}

export interface TossResult {
  call: TossCall;
  coinFace: TossCall;
  winnerTeamId: string;
  decision: TossDecision | null;
}

export interface Scoreboard {
  runs: number;
  wickets: number;
  legalBalls: number;
  overs: number;
  ballsInOver: number;
  target: number | null;
  requiredRuns: number | null;
  ballsLeft: number;
}

export interface BallEvent {
  inningsIndex: number;
  over: number;
  ball: number;
  battingNumber: number;
  bowlingNumber: number;
  resultType: BallResultType;
  runs: number;
  shotLabel?: string;
  resultLabel?: string;
  resultTone?: "wicket" | "mega" | "boundary" | "power" | "run" | "dot";
  strikerId: string | null;
  nonStrikerId: string | null;
  bowlerId: string | null;
  battingTeamId: string;
  bowlingTeamId: string;
  timestamp: number;
  commentary: string;
}

export interface PendingChoice {
  controller: "local" | "ai" | "manual";
  playerId: string | null;
  teamId: string;
  value: number | null;
  lockedAt: number | null;
}

export interface Innings {
  battingTeamId: string;
  bowlingTeamId: string;
  scoreboard: Scoreboard;
  strikerId: string | null;
  nonStrikerId: string | null;
  currentBowlerId: string | null;
  nextBatterIndex: number;
  nextBowlerIndex: number;
  dismissedIds: string[];
  completed: boolean;
  pendingChoices: {
    batting: PendingChoice | null;
    bowling: PendingChoice | null;
  };
}

export interface MatchResult {
  winnerTeamId: string | null;
  marginText: string;
  reason: string;
  summary: string;
  isTie: boolean;
}

export interface Match {
  id: string;
  roomId: string;
  phase: MatchPhase;
  settings: RoomSettings;
  teams: {
    alpha: Team;
    beta: Team;
  };
  tossResult: TossResult;
  innings: [Innings, Innings];
  currentInningsIndex: number;
  revealState: {
    status: RevealStateStatus;
    waitingFor: Side | null;
    lockedSides: Side[];
    revealAt: number | null;
    cycleId: number;
    lastBall: BallEvent | null;
  };
  ballEvents: BallEvent[];
  result: MatchResult | null;
  updatedAt: number;
}

export interface MatchHistoryEntry {
  id: string;
  roomCode: string;
  playedAt: number;
  result: MatchResult;
  tossResult: TossResult;
  settings: RoomSettings;
  numberSetLabel?: string;
  allowedNumbers?: number[];
  insights?: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  inningsSummary: Array<{
    teamId: string;
    runs: number;
    wickets: number;
    oversText: string;
  }>;
}

export interface SavedMatchState {
  savedAt: number;
  roomCode: string;
  result: MatchResult | null;
  numberSetLabel?: string;
  allowedNumbers?: number[];
  insights?: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  basicStats: {
    totalRuns: number;
    totalWickets: number;
    oversText: string;
    ballCount: number;
  };
  inningsSummary: Array<{
    teamId: string;
    teamName: string;
    runs: number;
    wickets: number;
    oversText: string;
  }>;
}

export interface IncomingSignal {
  signalId: string;
  categoryId: string;
  text: string;
  fromPlayerId: string | null;
  fromPlayerName: string;
  receivedAt: number;
}

export interface AppState {
  route: RouteName;
  session: {
    localPlayerId: string | null;
    playerKey: string;
    profileName: string;
    lastRoomCode: string;
    activeRoomCode: string;
  };
  ui: {
    roomCodeInput: string;
    tossCall: TossCall;
    playersPerTeam: number;
    connectionBanner: string;
    selectedNumberSide: Side | null;
    selectedPicks?: {
      batting: number | null;
      bowling: number | null;
    };
    numberSetDraft?: Partial<RoomSettings> | null;
    numberSetValidationError?: string;
    isPaused?: boolean;
    signalSheetOpen?: boolean;
    signalCooldownUntil?: number;
    signalHighlightUntil?: number;
    incomingSignal?: IncomingSignal | null;
    confirmDialog?: {
      title: string;
      message: string;
      confirmLabel?: string;
      cancelLabel?: string;
      intent: "discard-room";
    } | null;
    toasts: Array<{ id: string; message: string; tone: "info" | "success" | "warning" }>;
  };
  connection: ConnectionState;
  room: Room | null;
  match: Match | null;
  history: MatchHistoryEntry[];
  lastSavedMatch: SavedMatchState | null;
}

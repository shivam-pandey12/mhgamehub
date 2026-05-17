import { getOpponentSeat } from "../shared/rules";

const REACTIONS = ["👏", "🔥", "😈", "🤯", "🫡"];

function handPairLabel(hands = [0, 0]) {
  return `${hands[0]} | ${hands[1]}`;
}

function PlayerCard({
  active,
  connected,
  hands,
  player,
  skinAccent,
  subtitle,
  title
}) {
  return (
    <div className={`player-card ${active ? "player-card--active" : ""}`}>
      <div className="player-card__title">{title}</div>
      <div className="player-card__name-row">
        <div>
          <h3>{player?.name ?? "Open Seat"}</h3>
          <span>{subtitle}</span>
        </div>
        <span
          className={`connection-dot ${connected ? "connection-dot--on" : "connection-dot--off"}`}
          style={{ "--connection-color": skinAccent }}
        />
      </div>
      <div className="player-card__counts">{handPairLabel(hands)}</div>
    </div>
  );
}

export default function ArenaHud({
  canAct,
  contextMessage,
  controlledSeat,
  match,
  modeLabel,
  onCopyRoomCode,
  onCopyRoomLink,
  onExit,
  onNavigateRules,
  onReaction,
  onRematch,
  onReplay,
  onSelectSplit,
  onShareRoomLink,
  onToggleSetting,
  onToggleTheme,
  onToggleSplit,
  perspectiveSeat,
  players,
  rematchVotes,
  roomCode,
  roomShareLink,
  roomStatus,
  selectedHand,
  settings,
  splitOpen,
  splitOptions,
  visibleReactions
}) {
  const opponentSeat = getOpponentSeat(perspectiveSeat);
  const topPlayer = players?.[opponentSeat];
  const bottomPlayer = players?.[perspectiveSeat];
  const winner = match?.winner ? players?.[match.winner] : null;
  const winnerIsPerspective = match?.winner === perspectiveSeat;
  const selectedLabel =
    selectedHand === null ? "No hand selected" : selectedHand === 0 ? "Left hand armed" : "Right hand armed";

  return (
    <div className="hud-layer">
      <header className="hud-topbar">
        <div className="hud-topbar__brand">
          <div className="hud-topbar__eyebrow">{modeLabel}</div>
          <div className="hud-topbar__title">Chopsticks 3D Arena</div>
          <div className="hud-topbar__subline">powered by MH HORIZON</div>
        </div>

        <div className="hud-topbar__side">
          {roomCode ? (
            <div className="hud-room-strip">
              <span className={`status-pill ${roomCode ? `status-pill--${roomStatus}` : ""}`}>
                Room {roomCode}
              </span>
              <button className="mini-chip mini-chip--on" onClick={onCopyRoomCode} type="button">
                Copy Code
              </button>
              <button className="mini-chip" onClick={onCopyRoomLink} title={roomShareLink} type="button">
                Copy Link
              </button>
              <button className="mini-chip" onClick={onShareRoomLink} type="button">
                Share Invite
              </button>
            </div>
          ) : null}

          <div className="hud-topbar__actions">
            <button className="mini-chip" onClick={onToggleTheme} type="button">
              Theme: {settings.theme === "light" ? "Light" : "Dark"}
            </button>
            <button className="mini-chip" onClick={onNavigateRules} type="button">
              Rules
            </button>
            <button
              className={`mini-chip ${settings.sfx ? "mini-chip--on" : ""}`}
              onClick={() => onToggleSetting("sfx")}
              type="button"
            >
              SFX
            </button>
            <button
              className={`mini-chip ${settings.ambient ? "mini-chip--on" : ""}`}
              onClick={() => onToggleSetting("ambient")}
              type="button"
            >
              Loop
            </button>
            <button
              className={`mini-chip ${settings.reducedMotion ? "mini-chip--on" : ""}`}
              onClick={() => onToggleSetting("reducedMotion")}
              type="button"
            >
              Motion
            </button>
            <button className="mini-chip" onClick={onExit} type="button">
              Exit
            </button>
          </div>
        </div>
      </header>

      {visibleReactions?.[opponentSeat] ? (
        <div className="reaction-bubble reaction-bubble--top">
          {visibleReactions[opponentSeat].emoji}
        </div>
      ) : null}

      {visibleReactions?.[perspectiveSeat] ? (
        <div className="reaction-bubble reaction-bubble--bottom">
          {visibleReactions[perspectiveSeat].emoji}
        </div>
      ) : null}

      <div className="arena-layout">
        <aside className="arena-side-column">
          <PlayerCard
            active={match?.turn === opponentSeat}
            connected={Boolean(topPlayer?.connected)}
            hands={match?.hands?.[opponentSeat]}
            player={topPlayer}
            skinAccent={topPlayer?.accent}
            subtitle="Opponent"
            title="Front Rail"
          />

          <PlayerCard
            active={match?.turn === perspectiveSeat}
            connected={Boolean(bottomPlayer?.connected)}
            hands={match?.hands?.[perspectiveSeat]}
            player={bottomPlayer}
            skinAccent={bottomPlayer?.accent}
            subtitle="Your side"
            title="Control Rail"
          />
        </aside>

        <div className="arena-center-column">
          <div className="status-panel panel">
            <div className="status-panel__headline">
              <span className={`status-pill ${match?.winner ? "" : "status-pill--live"}`}>
                {match?.winner ? "Round Finished" : canAct ? "Your Turn" : "Stand By"}
              </span>
              <span className={`status-pill ${roomCode ? `status-pill--${roomStatus}` : ""}`}>
                {roomCode ? `Connection ${roomStatus}` : modeLabel}
              </span>
            </div>

            <p className="status-panel__message">{contextMessage}</p>

            <div className="status-panel__meta">
              <span>{selectedLabel}</span>
              <span>
                {controlledSeat
                  ? `Control seat: ${players?.[controlledSeat]?.name ?? controlledSeat}`
                  : "Spectating"}
              </span>
            </div>
          </div>
        </div>

        <aside className="arena-side-column arena-side-column--right">
          <div className="panel side-info-card">
            <div className="side-info-card__label">Match State</div>
            <div className="side-info-card__value">{match?.winner ? "Finished" : match?.turn === perspectiveSeat ? "Attack" : "Defend"}</div>
            <div className="side-info-card__text">
              {roomCode
                ? `Connection: ${roomStatus}`
                : "Practice route active"}
            </div>
          </div>

          <div className="panel side-info-card">
            <div className="side-info-card__label">Split Status</div>
            <div className="side-info-card__value">
              {splitOptions.length} legal split{splitOptions.length === 1 ? "" : "s"}
            </div>
            <div className="side-info-card__text">
              Keep the same total finger count when redistributing.
            </div>
          </div>
        </aside>
      </div>

      <div className="control-panel panel">
        <div className="control-panel__row">
          <button
            className={`pill-button ${splitOpen ? "pill-button--active" : ""}`}
            disabled={!canAct || splitOptions.length === 0}
            onClick={onToggleSplit}
            type="button"
          >
            Split
          </button>
          <div className="split-status">
            {splitOptions.length > 0
              ? `${splitOptions.length} legal split${splitOptions.length > 1 ? "s" : ""}`
              : "No split available"}
          </div>
        </div>

        {splitOpen ? (
          <div className="split-tray">
            {splitOptions.map((option) => (
              <button
                className="split-option"
                key={`${option[0]}-${option[1]}`}
                onClick={() => onSelectSplit(option)}
                type="button"
              >
                {option[0]} / {option[1]}
              </button>
            ))}
          </div>
        ) : null}

        <div className="reaction-row">
          {REACTIONS.map((emoji) => (
            <button
              className="reaction-button"
              key={emoji}
              onClick={() => onReaction(emoji)}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {match?.winner ? (
        <div className="result-modal">
          <div className="result-modal__panel panel">
            <div className="result-modal__eyebrow">Round Complete</div>
            <h2>{winner?.name ?? "Winner"} takes the arena</h2>
            <p>
              {winnerIsPerspective
                ? "You broke both opposing hands."
                : "Both of your hands were knocked out."}
            </p>

            {roomCode ? (
              <button className="pill-button pill-button--primary" onClick={onRematch} type="button">
                {rematchVotes?.length > 0
                  ? `Rematch Ready ${rematchVotes.length}/2`
                  : "Request Rematch"}
              </button>
            ) : (
              <button className="pill-button pill-button--primary" onClick={onReplay} type="button">
                Replay Round
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

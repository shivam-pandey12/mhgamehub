import { useState } from "react";

export default function OnlineLobbyPage({
  busy,
  error,
  pendingRoomCode,
  profile,
  roomStatus,
  onCreateRoom,
  onJoinRoom
}) {
  const [joinCode, setJoinCode] = useState(pendingRoomCode ?? "");

  const submitJoin = () => {
    const normalized = joinCode.replace(/\D/g, "").slice(0, 6);
    if (normalized.length === 6) {
      onJoinRoom(normalized);
    }
  };

  return (
    <div className="page-stack">
      <section className="page-hero panel">
        <div className="page-hero__eyebrow">Online Rooms</div>
        <h1 className="page-hero__title">Create or rejoin a live arena</h1>
        <p className="page-hero__body">
          Rooms are synced live in memory with no database. Create a room code, invite
          a second player, or rejoin a six-digit room directly from its URL.
        </p>
        <div className="lobby-meta">
          <span className={`status-pill status-pill--${roomStatus === "connected" ? "connected" : roomStatus}`}>
            {roomStatus === "connected" ? "Room server connected" : "Room server idle"}
          </span>
          <span className="status-pill">Pilot: {profile.name || "Arena Pilot"}</span>
        </div>
      </section>

      <section className="feature-grid">
        <article className="panel feature-card">
          <div className="feature-card__eyebrow">New Match</div>
          <h2>Create Room</h2>
          <p>Generate a fresh 6-digit code and hold the arena open for one opponent.</p>
          <button className="pill-button pill-button--primary" disabled={busy} onClick={onCreateRoom} type="button">
            Create Live Room
          </button>
        </article>

        <article className="panel feature-card">
          <div className="feature-card__eyebrow">Join Match</div>
          <h2>Enter Room Code</h2>
          <p>Use the exact room code from your opponent to reconnect or start the duel.</p>
          <div className="join-row">
            <input
              className="field__input field__input--code"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setJoinCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitJoin();
                }
              }}
              placeholder="123456"
              type="text"
              value={joinCode}
            />
            <button
              className="pill-button pill-button--primary"
              disabled={busy || joinCode.length !== 6}
              onClick={submitJoin}
              type="button"
            >
              Join
            </button>
          </div>
        </article>
      </section>

      <section className="panel guide-panel">
        <div className="guide-panel__header">
          <div>
            <div className="page-hero__eyebrow">Connection Notes</div>
            <h2>Refresh now keeps you on the online section</h2>
          </div>
        </div>

        <div className="guide-points">
          <div className="guide-point">
            <strong>Room URL</strong>
            <span>If you are in `#/online/123456`, refreshing keeps you on that room path instead of sending you home.</span>
          </div>
          <div className="guide-point">
            <strong>No backend database</strong>
            <span>The room exists only while the server process is running and at least one player stays connected.</span>
          </div>
          <div className="guide-point">
            <strong>Local pilot data</strong>
            <span>Name, skin, and settings stay in localStorage so reconnecting feels instant.</span>
          </div>
        </div>

        {error ? <div className="notice-banner">{error}</div> : null}
        <div className="powered-line">powered by MH HORIZON</div>
      </section>
    </div>
  );
}

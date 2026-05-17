export default function PracticePage({ onLaunch }) {
  return (
    <div className="page-stack">
      <section className="page-hero panel">
        <div className="page-hero__eyebrow">Practice</div>
        <h1 className="page-hero__title">Sharpen your split timing</h1>
        <p className="page-hero__body">
          Practice mode is built for fast iteration. Battle Pulse AI for live pressure
          or use self-play to test exact finger distributions and trap setups.
        </p>
      </section>

      <section className="feature-grid">
        <article className="panel feature-card">
          <div className="feature-card__eyebrow">AI Match</div>
          <h2>Practice vs AI</h2>
          <p>Play full rounds against a quick-response opponent that values tempo and dead-hand pressure.</p>
          <button className="pill-button pill-button--primary" onClick={() => onLaunch("ai")} type="button">
            Start AI Match
          </button>
        </article>

        <article className="panel feature-card">
          <div className="feature-card__eyebrow">Sandbox</div>
          <h2>Self-Play Lab</h2>
          <p>Control both seats and inspect how every attack and split changes the board state.</p>
          <button className="pill-button pill-button--primary" onClick={() => onLaunch("self")} type="button">
            Open Self-Play
          </button>
        </article>
      </section>

      <section className="panel guide-panel">
        <div className="guide-panel__header">
          <div>
            <div className="page-hero__eyebrow">Arena Notes</div>
            <h2>What changes inside the match view</h2>
          </div>
        </div>

        <div className="guide-points">
          <div className="guide-point">
            <strong>Readable lanes</strong>
            <span>Your hands stay in the foreground while opponent hands face toward you from the far side.</span>
          </div>
          <div className="guide-point">
            <strong>Fast controls</strong>
            <span>Select your own hand, tap an opponent hand, or open the split tray when a legal split exists.</span>
          </div>
          <div className="guide-point">
            <strong>Refresh-safe path</strong>
            <span>Practice routes use their own URL so reopening the page keeps you in the practice section.</span>
          </div>
        </div>

        <div className="powered-line">powered by MH HORIZON</div>
      </section>
    </div>
  );
}

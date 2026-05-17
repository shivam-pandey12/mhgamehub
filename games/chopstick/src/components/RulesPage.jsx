const RULE_SECTIONS = [
  {
    title: "Core Goal",
    body:
      "Each player controls two hands. Both hands start at 1 finger. Knock out both opponent hands before they do the same to you."
  },
  {
    title: "Attack Turn",
    body:
      "On your turn, choose one of your live hands and tap one live opponent hand. Your chosen hand adds its finger count to the target hand."
  },
  {
    title: "Dead Hand",
    body:
      "If a hand reaches 5 or more, it wraps to 0 and becomes dead. Dead hands cannot attack and cannot be targeted."
  },
  {
    title: "Split Move",
    body:
      "Instead of attacking, you may redistribute your own total fingers across your two hands. The total must stay the same and the split must actually change the position."
  }
];

export default function RulesPage({ onNavigate }) {
  return (
    <div className="page-stack">
      <section className="page-hero panel">
        <div className="page-hero__eyebrow">Rules</div>
        <h1 className="page-hero__title">How the arena works</h1>
        <p className="page-hero__body">
          Chopsticks 3D Arena keeps the classic finger strategy intact while making
          each round faster to read. Learn the attack flow, the wrap-to-zero rule,
          and when splitting opens a winning line.
        </p>
      </section>

      <section className="rules-grid">
        {RULE_SECTIONS.map((section) => (
          <article className="panel rules-card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="panel guide-panel">
        <div className="guide-panel__header">
          <div>
            <div className="page-hero__eyebrow">Quick Tips</div>
            <h2>Better moves come from hand balance</h2>
          </div>
          <button className="pill-button pill-button--primary" onClick={() => onNavigate("/practice")} type="button">
            Open Practice
          </button>
        </div>

        <div className="guide-points">
          <div className="guide-point">
            <strong>Protect tempo</strong>
            <span>Use splits to avoid leaving a 4 exposed when the opponent can finish it cleanly.</span>
          </div>
          <div className="guide-point">
            <strong>Force dead zones</strong>
            <span>Turning one opponent hand to 0 limits their attack options and makes the next turn easier to read.</span>
          </div>
          <div className="guide-point">
            <strong>Think two turns ahead</strong>
            <span>Before tapping, check whether your attack gives the opponent an immediate winning reply.</span>
          </div>
        </div>

        <div className="powered-line">powered by MH HORIZON</div>
      </section>
    </div>
  );
}

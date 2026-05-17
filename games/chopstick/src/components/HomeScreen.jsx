import { HAND_SKINS } from "../game/skins";

function SkinChip({ active, onSelect, skin }) {
  return (
    <button
      className={`skin-chip ${active ? "skin-chip--active" : ""}`}
      onClick={() => onSelect(skin.id)}
      type="button"
    >
      <span
        className="skin-chip__swatch"
        style={{
          "--skin-palm": skin.palm,
          "--skin-accent": skin.accent
        }}
      />
      <span className="skin-chip__label">{skin.name}</span>
    </button>
  );
}

export default function HomeScreen({
  onNavigate,
  onProfileChange,
  onSettingsChange,
  profile,
  settings
}) {
  return (
    <div className="page-stack">
      <section className="landing-grid">
        <div className="page-hero panel">
          <div className="page-hero__eyebrow">Browser Strategy Duel</div>
          <h1 className="page-hero__title">A cleaner way to play Chopsticks in 3D</h1>
          <p className="page-hero__body">
            Step into a first-person hand arena built for quick reads, precise taps,
            split mind-games, and instant room-code matches.
          </p>

          <div className="hero-cta-row">
            <button className="pill-button pill-button--primary" onClick={() => onNavigate("/practice")} type="button">
              Open Practice
            </button>
            <button className="pill-button" onClick={() => onNavigate("/online")} type="button">
              Online Rooms
            </button>
            <button className="pill-button" onClick={() => onNavigate("/rules")} type="button">
              View Rules
            </button>
          </div>

          <div className="hero-points">
            <div className="hero-point">
              <strong>Fast rounds</strong>
              <span>Minimal friction between selecting, tapping, and splitting.</span>
            </div>
            <div className="hero-point">
              <strong>Real pages</strong>
              <span>Practice, rules, and online rooms now keep their own URLs.</span>
            </div>
            <div className="hero-point">
              <strong>Lightweight storage</strong>
              <span>Only your pilot profile and preferences are saved locally.</span>
            </div>
          </div>

          <div className="powered-line">powered by MH HORIZON</div>
        </div>

        <aside className="panel profile-panel">
          <div className="panel__heading">
            <h2>Pilot Profile</h2>
            <p>Used across practice and room play.</p>
          </div>

          <label className="field">
            <span className="field__label">Player Name</span>
            <input
              className="field__input"
              maxLength={20}
              onChange={(event) =>
                onProfileChange({
                  ...profile,
                  name: event.target.value
                })
              }
              placeholder="Arena Pilot"
              type="text"
              value={profile.name}
            />
          </label>

          <div className="field">
            <span className="field__label">Hand Skin</span>
            <div className="skin-grid">
              {HAND_SKINS.map((skin) => (
                <SkinChip
                  active={profile.skinId === skin.id}
                  key={skin.id}
                  onSelect={(skinId) =>
                    onProfileChange({
                      ...profile,
                      skinId
                    })
                  }
                  skin={skin}
                />
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field__label">Arena Settings</span>
            <div className="settings-grid settings-grid--stacked">
              <button
                className={`toggle-chip ${settings.sfx ? "toggle-chip--on" : ""}`}
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    sfx: !settings.sfx
                  })
                }
                type="button"
              >
                Tap SFX {settings.sfx ? "On" : "Off"}
              </button>
              <button
                className={`toggle-chip ${settings.ambient ? "toggle-chip--on" : ""}`}
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    ambient: !settings.ambient
                  })
                }
                type="button"
              >
                Arena Loop {settings.ambient ? "On" : "Off"}
              </button>
              <button
                className={`toggle-chip ${settings.reducedMotion ? "toggle-chip--on" : ""}`}
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    reducedMotion: !settings.reducedMotion
                  })
                }
                type="button"
              >
                Reduced Motion {settings.reducedMotion ? "On" : "Off"}
              </button>
              <button
                className={`toggle-chip ${settings.theme === "light" ? "toggle-chip--on" : ""}`}
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    theme: settings.theme === "light" ? "dark" : "light"
                  })
                }
                type="button"
              >
                Theme {settings.theme === "light" ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </aside>
      </section>

      <section className="feature-grid">
        <article className="panel feature-card">
          <div className="feature-card__eyebrow">Practice</div>
          <h2>Train without pressure</h2>
          <p>Use AI and self-play pages to learn safe splits, punish overextended hands, and test endings.</p>
          <button className="pill-button pill-button--primary" onClick={() => onNavigate("/practice")} type="button">
            Go to Practice
          </button>
        </article>

        <article className="panel feature-card">
          <div className="feature-card__eyebrow">Rules</div>
          <h2>Read the official flow</h2>
          <p>See exactly how attacks, dead hands, and legal splits work before you enter a room.</p>
          <button className="pill-button pill-button--primary" onClick={() => onNavigate("/rules")} type="button">
            Open Rules
          </button>
        </article>

        <article className="panel feature-card">
          <div className="feature-card__eyebrow">Online</div>
          <h2>Create a live room code</h2>
          <p>Jump into peer play with a cleaner lobby page and room URLs that survive refresh.</p>
          <button className="pill-button pill-button--primary" onClick={() => onNavigate("/online")} type="button">
            Enter Online Lobby
          </button>
        </article>
      </section>
    </div>
  );
}

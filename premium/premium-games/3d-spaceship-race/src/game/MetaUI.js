function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatLabel(value) {
  return String(value ?? '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

const ACTION_FEEDBACK_LABELS = {
  'hangar-page': 'Opened',
  'preview-ship': 'Previewed',
  track: 'Selected',
  ship: 'Selected',
  'buy-ship': 'Purchased',
  hull: 'Applied',
  glow: 'Applied',
  trail: 'Applied',
  'start-race': 'Launching',
  'start-time-trial': 'Launching',
  'race-again': 'Launching',
  'back-hangar': 'Opening',
  theme: 'Applied',
  'google-login': 'Opening',
  logout: 'Switching',
  'copy-id': 'Copied',
  'copy-link': 'Copied',
  'copy-code': 'Copied',
  'quick-match': 'Queued',
  'private-create': 'Creating',
  'room-ready': 'Updated',
  'room-start': 'Starting',
  'room-host': 'Transferred',
  'room-rematch': 'Queued',
  'room-kick': 'Removed',
  'room-discard': 'Closing',
  'room-leave': 'Leaving',
  emote: 'Sent',
  'resume-race': 'Resuming',
  'restart-race': 'Restarting',
  'end-race': 'Ending',
  'leave-match': 'Leaving',
  tutorial: 'Updated',
  rebind: 'Listening'
};

const FORM_FEEDBACK_LABELS = {
  'save-name': 'Saved',
  'join-room': 'Joining'
};

const BUTTON_FEEDBACK_DURATION = 1500;
const BUTTON_FEEDBACK_FADE_DURATION = 320;
const SINGLE_ACTIVE_FEEDBACK_ACTIONS = new Set(['hangar-page', 'track', 'ship', 'theme', 'hull', 'glow', 'trail']);

export class MetaUI {
  constructor(container, handlers) {
    this.handlers = handlers;
    this.root = document.createElement('div');
    this.root.className = 'meta-ui';
    this.hangarPage = 'career';
    this.hangarScrollTops = {};
    this.lastHangarModel = null;
    this.buttonFeedbacks = new Map();
    this.buttonFeedbackTimers = new Map();
    container.appendChild(this.root);
  }

  hide() {
    this.root.innerHTML = '';
    this.root.classList.add('meta-ui--hidden');
  }

  showHangar(model) {
    const previousPanel = this.root.querySelector('.meta-ui__panel--hangar');
    if (previousPanel) {
      this.hangarScrollTops[this.hangarPage] = previousPanel.scrollTop;
    }

    this.lastHangarModel = model;
    const pages = this.getHangarPages(model);

    if (!pages.some((page) => page.id === this.hangarPage)) {
      this.hangarPage = pages[0]?.id ?? 'career';
    }

    this.root.classList.remove('meta-ui--hidden');
    this.root.innerHTML = `
      <div class="meta-ui__panel meta-ui__panel--hangar">
        <div class="meta-ui__header meta-ui__header--hangar">
          <div>
            <div class="meta-ui__eyebrow">Pilot Career</div>
            <h1 class="meta-ui__title">Star Hangar</h1>
            <p class="meta-ui__copy">Tune your ship, manage your career, and launch the next race from cleaner hangar pages.</p>
            <div class="meta-ui__header-pilot">
              <strong>${escapeHtml(model.profile.playerName)}</strong>
              <span>${escapeHtml(model.nextUnlock)}</span>
            </div>
          </div>
          <div class="meta-ui__profile">
            <div class="meta-ui__profile-card">
              <span>Level ${model.profile.level}</span>
              <div class="meta-ui__profile-meter"><div style="width:${model.profile.xpProgress * 100}%"></div></div>
              <small>${model.profile.xpLabel}</small>
            </div>
            <div class="meta-ui__profile-card"><span>Credits</span><strong>${model.profile.currency}</strong></div>
            <div class="meta-ui__profile-card"><span>Points</span><strong>${model.profile.totalPoints}</strong></div>
          </div>
        </div>

        ${this.renderHangarNav(pages)}
        <div class="meta-ui__page-shell">
          ${this.renderHangarPage(model)}
        </div>
      </div>
    `;

    this.bindActions();
    this.restoreButtonFeedbacks();
    const nextPanel = this.root.querySelector('.meta-ui__panel--hangar');

    if (nextPanel) {
      nextPanel.scrollTop = this.hangarScrollTops[this.hangarPage] ?? 0;
    }
  }

  getHangarPages(model) {
    const multiplayerBadge = model.multiplayer.room ? model.multiplayer.room.players.length : 0;

    return [
      { id: 'career', label: 'Career', badge: '' },
      { id: 'garage', label: 'Garage', badge: '' },
      { id: 'multiplayer', label: 'Multiplayer', badge: multiplayerBadge > 0 ? String(multiplayerBadge) : '' },
      { id: 'systems', label: 'Systems', badge: '' },
      { id: 'goals', label: 'Goals', badge: '' }
    ];
  }

  renderHangarNav(pages) {
    return `
      <div class="meta-ui__nav">
        ${pages.map((page) => `
          <button class="meta-ui__nav-chip ${page.id === this.hangarPage ? 'is-selected' : ''}" type="button" data-action="hangar-page" data-id="${page.id}">
            <span>${escapeHtml(page.label)}</span>
            ${page.badge ? `<small class="meta-ui__nav-badge">${escapeHtml(page.badge)}</small>` : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderHangarPage(model) {
    if (this.hangarPage === 'garage') {
      return this.renderGaragePage(model);
    }

    if (this.hangarPage === 'multiplayer') {
      return this.renderMultiplayerPage(model);
    }

    if (this.hangarPage === 'systems') {
      return this.renderSystemsPage(model);
    }

    if (this.hangarPage === 'goals') {
      return this.renderGoalsPage(model);
    }

    return this.renderCareerPage(model);
  }

  renderCareerPage(model) {
    return `
      <div class="meta-ui__grid meta-ui__grid--hangar-page">
        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Pilot Identity</h2>
            <span>${escapeHtml(model.identity.provider)}</span>
          </div>
          <form class="meta-ui__name-form" data-action="save-name">
            <label class="meta-ui__name-label" for="pilot-name">Pilot Name</label>
            <div class="meta-ui__name-row">
              <input id="pilot-name" class="meta-ui__name-input" type="text" maxlength="20" value="${escapeHtml(model.profile.playerName)}" placeholder="Enter pilot name" />
              <button class="meta-ui__action" type="submit" data-feedback-key="save-name">Save Name</button>
            </div>
          </form>
          <div class="meta-ui__theme">
            <span class="meta-ui__theme-label">Theme</span>
            <div class="meta-ui__theme-row">
              <button class="meta-ui__theme-chip ${model.profile.theme === 'dark' ? 'is-selected' : ''}" type="button" data-action="theme" data-id="dark">Dark</button>
              <button class="meta-ui__theme-chip ${model.profile.theme === 'light' ? 'is-selected' : ''}" type="button" data-action="theme" data-id="light">Light</button>
            </div>
          </div>
          <div class="meta-ui__identity">
            <div class="meta-ui__identity-head">
              <strong>Account</strong>
              <span>${escapeHtml(model.identity.provider)}</span>
            </div>
            <div class="meta-ui__identity-grid">
              <div class="meta-ui__identity-item">
                <span>ID</span>
                <strong>${escapeHtml(model.identity.uidLabel)}</strong>
              </div>
              <div class="meta-ui__identity-item">
                <span>Joined</span>
                <strong>${escapeHtml(model.identity.createdLabel)}</strong>
              </div>
              <div class="meta-ui__identity-item meta-ui__identity-item--wide">
                <span>Sync</span>
                <strong>${escapeHtml(model.identity.statusLabel)}</strong>
              </div>
              ${model.identity.email
                ? `
                  <div class="meta-ui__identity-item meta-ui__identity-item--wide">
                    <span>Email</span>
                    <strong>${escapeHtml(model.identity.email)}</strong>
                  </div>
                `
                : ''
              }
            </div>
            <div class="meta-ui__multiplayer-actions">
              <button class="meta-ui__action" type="button" data-action="copy-id" data-id="${escapeHtml(model.identity.uid)}" ${model.identity.uid ? '' : 'disabled'}>
                Copy Full ID
              </button>
              <button class="meta-ui__action" type="button" data-action="google-login" ${model.identity.canUseGoogle ? '' : 'disabled'}>
                ${escapeHtml(model.identity.googleLabel)}
              </button>
              <button class="meta-ui__action" type="button" data-action="logout" ${model.identity.canLogout ? '' : 'disabled'}>
                ${escapeHtml(model.identity.logoutLabel)}
              </button>
            </div>
          </div>
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Track Select</h2>
            <span>${escapeHtml(model.nextUnlock)}</span>
          </div>
          <div class="meta-ui__cards">
            ${model.tracks.map((track) => `
              <button class="meta-ui__card ${track.selected ? 'is-selected' : ''}" type="button" data-action="track" data-id="${track.id}" ${track.unlocked ? '' : 'disabled'}>
                <div class="meta-ui__card-headline">
                  <span class="meta-ui__badge">${track.difficulty}</span>
                  ${this.renderRarityChip(track.rarity)}
                </div>
                <strong>${track.name}</strong>
                <span class="meta-ui__card-kicker">${track.themeName}</span>
                <span>${track.description}</span>
                <small>${track.unlocked ? `${track.identity} | ${track.bestLapLabel}` : `Unlocks at Level ${track.unlockLevel}`}</small>
              </button>
            `).join('')}
          </div>
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Next Race Challenges</h2>
            <span>Bonus rewards for focused runs.</span>
          </div>
          <div class="meta-ui__challenge-list">
            ${model.challenges.map((challenge) => `
              <div class="meta-ui__challenge">
                <strong>${challenge.label}</strong>
                <span>+${challenge.rewardCurrency} CR / +${challenge.rewardXp} XP</span>
              </div>
            `).join('')}
          </div>
          <div class="meta-ui__actions">
            <button class="meta-ui__launch" type="button" data-action="start-race">Launch Race</button>
            <button class="meta-ui__secondary" type="button" data-action="start-time-trial">Start Time Trial</button>
            <button class="meta-ui__secondary" type="button" data-action="hangar-page" data-id="garage">Tune Ship</button>
          </div>
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Quick Snapshot</h2>
            <span>One clean look at the next run.</span>
          </div>
          <div class="meta-ui__reward-list">
            <div class="meta-ui__reward">
              <span>Selected Ship</span>
              <strong>${escapeHtml(model.ships.find((ship) => ship.selected)?.name ?? 'Unknown')}</strong>
            </div>
            <div class="meta-ui__reward">
              <span>Selected Track</span>
              <strong>${escapeHtml(model.tracks.find((track) => track.selected)?.name ?? 'Unknown')}</strong>
            </div>
            <div class="meta-ui__reward">
              <span>Best Lap</span>
              <strong>${escapeHtml(model.timeTrial.selectedTrackBestLap)}</strong>
            </div>
            <div class="meta-ui__reward">
              <span>Account Sync</span>
              <strong>${escapeHtml(model.identity.statusLabel)}</strong>
            </div>
            <div class="meta-ui__reward">
              <span>Live Room</span>
              <strong>${escapeHtml(model.multiplayer.room ? `Code ${model.multiplayer.room.code}` : 'No active room')}</strong>
            </div>
            <div class="meta-ui__reward">
              <span>Ghost Replay</span>
              <strong>${escapeHtml(model.timeTrial.ghostReady ? 'Ready' : 'Not Recorded')}</strong>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  renderGaragePage(model) {
    return `
      <div class="meta-ui__grid meta-ui__grid--hangar-page">
        <section class="meta-ui__section meta-ui__section--wide">
          <div class="meta-ui__section-head">
            <h2>Ship Bay</h2>
            <span>Choose a frame that matches your style.</span>
          </div>
          <div class="meta-ui__cards">
            ${model.ships.map((ship) => `
              <div class="meta-ui__card ${ship.selected ? 'is-selected' : ''} ${ship.previewed ? 'is-previewed' : ''}">
                <div class="meta-ui__card-headline">
                  <span class="meta-ui__badge">${ship.unlockLabel}</span>
                  ${this.renderRarityChip(ship.rarity)}
                </div>
                <strong>${ship.name}</strong>
                <span class="meta-ui__card-kicker">${escapeHtml(ship.manufacturer)}</span>
                <span>${ship.tagline}</span>
                <small>${ship.statLine}</small>
                <div class="meta-ui__card-actions">
                  <button class="meta-ui__secondary" type="button" data-action="preview-ship" data-id="${ship.id}">${ship.previewed ? 'Previewing' : 'Preview Ship'}</button>
                  ${ship.unlocked
                    ? `<button class="meta-ui__action" type="button" data-action="ship" data-id="${ship.id}">${ship.selected ? 'Selected' : 'Select Ship'}</button>`
                    : ship.purchaseable
                      ? `<button class="meta-ui__action" type="button" data-action="buy-ship" data-id="${ship.id}">Buy ${ship.cost}</button>`
                      : `<button class="meta-ui__action" type="button" disabled>${ship.unlockReason}</button>`
                  }
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Cosmetics</h2>
            <span>Pure style. No stat changes.</span>
          </div>
          <div class="meta-ui__swatches">
            ${this.renderSwatches('Hull', model.cosmetics.hulls, model.cosmetics.selectedHullId, 'hull')}
            ${this.renderSwatches('Glow', model.cosmetics.glows, model.cosmetics.selectedGlowId, 'glow')}
            ${this.renderSwatches('Trail', model.cosmetics.trails, model.cosmetics.selectedTrailId, 'trail')}
          </div>
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Live Preview</h2>
            <span>Preview any ship with your current finish before launch.</span>
          </div>
          ${this.renderGaragePreview(model)}
        </section>
      </div>
    `;
  }

  getSelectedOption(options, selectedId) {
    return options.find((item) => item.id === selectedId) ?? options[0] ?? null;
  }

  renderGaragePreview(model) {
    const selectedShip = model.ships.find((ship) => ship.previewed) ?? model.ships.find((ship) => ship.selected) ?? model.ships[0];
    const selectedHull = this.getSelectedOption(model.cosmetics.hulls, model.cosmetics.selectedHullId);
    const selectedGlow = this.getSelectedOption(model.cosmetics.glows, model.cosmetics.selectedGlowId);
    const selectedTrail = this.getSelectedOption(model.cosmetics.trails, model.cosmetics.selectedTrailId);
    const hullColor = `#${selectedHull?.hex ?? '7fdfff'}`;
    const glowColor = `#${selectedGlow?.hex ?? '92f5ff'}`;
    const trailColor = `#${selectedTrail?.hex ?? '69d8ff'}`;

    return `
      <div class="meta-ui__garage-preview">
        <div class="meta-ui__garage-stage">
          <div class="meta-ui__garage-preview-host" data-garage-preview-host></div>
          <div class="meta-ui__garage-hint">Drag to rotate</div>
        </div>

        <div class="meta-ui__garage-preview-meta">
          <div class="meta-ui__garage-preview-title">
            <strong>${escapeHtml(selectedShip?.name ?? 'Starling')}</strong>
            <span>${escapeHtml(selectedShip?.tagline ?? 'Race-ready visual preview')}</span>
          </div>
          <div class="meta-ui__garage-preview-chips">
            ${this.renderRarityChip(selectedShip?.rarity ?? 'common')}
            <span class="meta-ui__manufacturer-chip">${escapeHtml(selectedShip?.manufacturer ?? 'Manufacturer')}</span>
          </div>
          <div class="meta-ui__garage-preview-stats">
            <small>${escapeHtml(selectedShip?.statLine ?? '')}</small>
          </div>
          <div class="meta-ui__garage-preview-list">
            <div class="meta-ui__garage-preview-row">
              <span class="meta-ui__garage-preview-dot" style="--preview-color:${hullColor};"></span>
              <strong>Hull</strong>
              <small>${escapeHtml(selectedHull?.name ?? 'Default')}</small>
            </div>
            <div class="meta-ui__garage-preview-row">
              <span class="meta-ui__garage-preview-dot" style="--preview-color:${glowColor};"></span>
              <strong>Glow</strong>
              <small>${escapeHtml(selectedGlow?.name ?? 'Default')}</small>
            </div>
            <div class="meta-ui__garage-preview-row">
              <span class="meta-ui__garage-preview-dot" style="--preview-color:${trailColor};"></span>
              <strong>Trail</strong>
              <small>${escapeHtml(selectedTrail?.name ?? 'Default')}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMultiplayerPage(model) {
    return `
      <div class="meta-ui__grid meta-ui__grid--hangar-page">
        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Multiplayer Arena</h2>
            <span>${model.multiplayer.connected ? 'Server linked' : model.multiplayer.reconnecting ? 'Reconnecting to your live room...' : escapeHtml(model.multiplayer.connectionError || 'Connect when you queue')}</span>
          </div>
          <div class="meta-ui__multiplayer-actions">
            <button class="meta-ui__action" type="button" data-action="quick-match">Quick Match</button>
            <button class="meta-ui__action" type="button" data-action="private-create">Create Private Room</button>
          </div>
          <form class="meta-ui__inline-form" data-action-form="join-room">
            <input id="private-room-code" class="meta-ui__name-input" type="text" maxlength="120" value="" placeholder="Paste a private room code or invite link" />
            <button class="meta-ui__action" type="submit" data-feedback-key="join-room">Join Room</button>
          </form>
          ${this.renderRoomState(model.multiplayer)}
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Competitive Rank</h2>
            <span>${escapeHtml(model.multiplayer.rank.nextLabel)}</span>
          </div>
          <div class="meta-ui__rank-card">
            <strong>${escapeHtml(model.multiplayer.rank.name)}</strong>
            <span>${model.multiplayer.rank.rating} rating</span>
            <div class="meta-ui__profile-meter"><div style="width:${model.multiplayer.rank.progress * 100}%"></div></div>
            <small>${model.multiplayer.connected ? 'Live ladder synced' : 'Local profile cached'}</small>
          </div>
          <div class="meta-ui__leaderboards">
            <div>
              <strong class="meta-ui__mini-title">Global Top Pilots</strong>
              ${this.renderLeaderboard(model.multiplayer.leaderboard.global)}
            </div>
            <div>
              <strong class="meta-ui__mini-title">Room Board</strong>
              ${this.renderLeaderboard(model.multiplayer.lastRoomLeaderboard)}
            </div>
          </div>
        </section>

        <section class="meta-ui__section meta-ui__section--wide">
          <div class="meta-ui__section-head">
            <h2>Highlights</h2>
            <span>Close finishes, clutch wins, and room chaos saved here.</span>
          </div>
          <div class="meta-ui__highlight-list">
            ${(model.multiplayer.recentHighlights.length > 0
              ? model.multiplayer.recentHighlights
              : ['Your next online race can create the first headline moment.']
            ).map((highlight) => `<div class="meta-ui__highlight">${escapeHtml(highlight)}</div>`).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderSystemsPage(model) {
    return `
      <div class="meta-ui__grid meta-ui__grid--hangar-page">
        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Audio Mix</h2>
            <span>Balance the race feel without leaving the hangar.</span>
          </div>
          <div class="meta-ui__settings-grid">
            ${this.renderRangeSetting('master', 'Master', model.settings.audio.master)}
            ${this.renderRangeSetting('effects', 'Effects', model.settings.audio.effects)}
            ${this.renderRangeSetting('voice', 'Commentary Voice', model.settings.audio.voice)}
            <label class="meta-ui__toggle">
              <input type="checkbox" data-audio-toggle="voiceEnabled" ${model.settings.audio.voiceEnabled ? 'checked' : ''} />
              <span>Voice commentary enabled</span>
            </label>
          </div>
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Graphics</h2>
            <span>Trade spectacle for performance when you need it.</span>
          </div>
          <div class="meta-ui__settings-grid">
            <label class="meta-ui__field">
              <span>Quality</span>
              <select data-graphics-select="quality">
                ${['performance', 'balanced', 'high'].map((item) => `<option value="${item}" ${model.settings.graphics.quality === item ? 'selected' : ''}>${formatLabel(item)}</option>`).join('')}
              </select>
            </label>
            ${this.renderGraphicsToggle('particles', 'Particles', model.settings.graphics.particles)}
            ${this.renderGraphicsToggle('speedLines', 'Speed Lines', model.settings.graphics.speedLines)}
            ${this.renderGraphicsToggle('cameraShake', 'Camera Shake', model.settings.graphics.cameraShake)}
            ${this.renderGraphicsToggle('animatedTrack', 'Animated Track', model.settings.graphics.animatedTrack)}
          </div>
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Controls And Difficulty</h2>
            <span>Dial the race feel in and rebind the important keys.</span>
          </div>
          <div class="meta-ui__settings-grid">
            <label class="meta-ui__field">
              <span>AI Difficulty</span>
              <select data-gameplay-select="difficulty">
                ${['casual', 'standard', 'elite'].map((item) => `<option value="${item}" ${model.settings.gameplay.difficulty === item ? 'selected' : ''}>${formatLabel(item)}</option>`).join('')}
              </select>
            </label>
            <label class="meta-ui__toggle">
              <input type="checkbox" data-gameplay-toggle="tutorial" ${model.settings.gameplay.onboardingSeen ? '' : 'checked'} />
              <span>Show tutorial prompts during races</span>
            </label>
          </div>
          <div class="meta-ui__control-list">
            ${model.settings.controls.map((control) => `
              <div class="meta-ui__control-row">
                <div>
                  <strong>${escapeHtml(control.label)}</strong>
                  <span>${escapeHtml(control.value)}</span>
                </div>
                <button class="meta-ui__secondary" type="button" data-action="rebind" data-id="${control.id}" data-feedback-key="rebind:${control.id}">Rebind</button>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="meta-ui__section meta-ui__section--wide">
          <div class="meta-ui__section-head">
            <h2>Onboarding</h2>
            <span>Quick reminders for drift, boost, and power-up timing.</span>
          </div>
          <div class="meta-ui__highlight-list">
            ${model.settings.tutorialTips.map((tip) => `<div class="meta-ui__highlight">${escapeHtml(tip)}</div>`).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderRangeSetting(id, label, value) {
    return `
      <label class="meta-ui__field">
        <span>${escapeHtml(label)}</span>
        <input type="range" min="0" max="1" step="0.01" value="${Number(value ?? 1)}" data-audio-range="${id}" />
        <small>${Math.round(Number(value ?? 1) * 100)}%</small>
      </label>
    `;
  }

  renderGraphicsToggle(id, label, checked) {
    return `
      <label class="meta-ui__toggle">
        <input type="checkbox" data-graphics-toggle="${id}" ${checked ? 'checked' : ''} />
        <span>${escapeHtml(label)}</span>
      </label>
    `;
  }

  renderGoalsPage(model) {
    return `
      <div class="meta-ui__grid meta-ui__grid--hangar-page">
        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Daily Goals</h2>
            <span>Come back, climb faster, and stack unlocks.</span>
          </div>
          ${this.renderGoalList(model.multiplayer.dailyGoals)}
        </section>

        <section class="meta-ui__section">
          <div class="meta-ui__section-head">
            <h2>Weekly Goals</h2>
            <span>Longer targets for the bigger payout.</span>
          </div>
          ${this.renderGoalList(model.multiplayer.weeklyGoals)}
        </section>
      </div>
    `;
  }

  showResults(model) {
    this.root.classList.remove('meta-ui--hidden');
    this.root.innerHTML = `
      <div class="meta-ui__panel meta-ui__panel--results">
        <div class="meta-ui__header">
          <div>
            <div class="meta-ui__eyebrow">Race Complete</div>
            <h1 class="meta-ui__title">${model.positionLabel}</h1>
            <p class="meta-ui__copy">${model.summaryLine}</p>
            <div class="meta-ui__results-theme-row">
              ${this.renderRarityChip(model.podium?.[0]?.rarity ?? 'common', 'Podium')}
              <span class="meta-ui__manufacturer-chip">${escapeHtml(model.trackTheme)}</span>
            </div>
          </div>
          <div class="meta-ui__profile">
            <div class="meta-ui__profile-card">
              <span>Level ${model.profile.level}</span>
              <div class="meta-ui__profile-meter"><div style="width:${model.profile.xpProgress * 100}%"></div></div>
              <small>${model.profile.xpLabel}</small>
            </div>
            <div class="meta-ui__profile-card"><span>Credits</span><strong>${model.profile.currency}</strong></div>
            <div class="meta-ui__profile-card"><span>Points</span><strong>${model.profile.totalPoints}</strong></div>
          </div>
        </div>

        <div class="meta-ui__grid meta-ui__grid--results">
          ${model.podium?.length
            ? `
              <section class="meta-ui__section meta-ui__section--wide meta-ui__section--podium">
                <div class="meta-ui__section-head">
                  <h2>Podium Fly-In</h2>
                  <span>Top finishers, final order, and the standout ships from the flag.</span>
                </div>
                ${this.renderPodium(model.podium)}
              </section>
            `
            : ''
          }

          <section class="meta-ui__section">
            <div class="meta-ui__section-head">
              <h2>${model.timeTrial ? 'Session Breakdown' : 'Reward Breakdown'}</h2>
              <span>${model.timeTrial ? 'Your pace, ghost, and sector work from this run.' : 'Every race moves your career forward.'}</span>
            </div>
            <div class="meta-ui__reward-list">
              ${model.rewards.map((reward, index) => `
                <div class="meta-ui__reward" style="--reveal-index:${index};">
                  <span>${reward.label}</span>
                  <strong>${reward.value}</strong>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="meta-ui__section">
            <div class="meta-ui__section-head">
              <h2>${model.timeTrial ? 'Run Notes' : 'Challenge Results'}</h2>
              <span>${model.timeTrial ? 'Clean sectors and ghost gains matter most here.' : model.levelUp ? 'Level up earned.' : 'Keep pushing for the next unlock.'}</span>
            </div>
            <div class="meta-ui__challenge-list">
              ${(model.challengeResults.length > 0
                ? model.challengeResults.map((challenge) => `
                <div class="meta-ui__challenge ${challenge.completed ? 'is-complete' : ''}">
                  <strong>${challenge.label}</strong>
                  <span>${challenge.completed ? `Completed: +${challenge.rewardCurrency} CR / +${challenge.rewardXp} XP` : `Progress: ${challenge.progressText}`}</span>
                </div>
              `).join('')
                : '<div class="meta-ui__challenge"><strong>No challenge rewards</strong><span>This run was focused entirely on pace, sectors, and ghost improvement.</span></div>'
              )}
            </div>
          </section>

          <section class="meta-ui__section">
            <div class="meta-ui__section-head">
              <h2>Unlock Progress</h2>
              <span>${model.nextUnlock}</span>
            </div>
            <div class="meta-ui__unlock-list">
              ${model.unlocks.length > 0
                ? model.unlocks.map((unlock, index) => `<div class="meta-ui__unlock" style="--reveal-index:${index};"><strong>${unlock.type}</strong><span>${unlock.label}</span></div>`).join('')
                : '<div class="meta-ui__unlock"><strong>No New Unlocks</strong><span>Your next unlock is getting closer.</span></div>'
              }
              ${model.achievements.map((achievement) => `
                <div class="meta-ui__unlock">
                  <strong>Achievement</strong>
                  <span>${achievement.name}</span>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="meta-ui__section">
            <div class="meta-ui__section-head">
              <h2>Final Standings</h2>
              <span>The race is over. Here is the order at the flag.</span>
            </div>
            ${this.renderLeaderboard(model.standings, true)}
          </section>

          ${model.timing ? `
            <section class="meta-ui__section">
              <div class="meta-ui__section-head">
                <h2>Timing Breakdown</h2>
                <span>${model.timeTrial?.ghostSaved ? 'New ghost replay saved.' : 'Where the lap was made or lost.'}</span>
              </div>
              <div class="meta-ui__reward-list">
                <div class="meta-ui__reward">
                  <span>Total Time</span>
                  <strong>${escapeHtml(model.timing.totalTimeLabel)}</strong>
                </div>
                <div class="meta-ui__reward">
                  <span>Best Lap</span>
                  <strong>${escapeHtml(model.timing.bestLapLabel)}</strong>
                </div>
                <div class="meta-ui__reward">
                  <span>Last Lap</span>
                  <strong>${escapeHtml(model.timing.lastLapLabel)}</strong>
                </div>
              </div>
              <div class="meta-ui__challenge-list">
                ${model.timing.lapTimes.map((lap) => `
                  <div class="meta-ui__challenge">
                    <strong>${escapeHtml(lap.label)}</strong>
                    <span>${escapeHtml(lap.value)}</span>
                  </div>
                `).join('')}
                ${model.timing.sectors.map((sector) => `
                  <div class="meta-ui__challenge">
                    <strong>${escapeHtml(sector.label)}</strong>
                    <span>${escapeHtml(sector.value)} | Best ${escapeHtml(sector.best)}</span>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <section class="meta-ui__section">
            <div class="meta-ui__section-head">
              <h2>Next Move</h2>
              <span>Improve, buy gear, or queue another run.</span>
            </div>
            <div class="meta-ui__actions">
              <button class="meta-ui__launch" data-action="race-again">Race Again</button>
              <button class="meta-ui__secondary" data-action="back-hangar">Back To Hangar</button>
            </div>
          </section>

          ${model.multiplayer ? `
            <section class="meta-ui__section">
              <div class="meta-ui__section-head">
                <h2>Competitive Result</h2>
                <span>${escapeHtml(model.multiplayer.roomTypeLabel)}</span>
              </div>
              <div class="meta-ui__rank-card">
                <strong>${escapeHtml(model.multiplayer.rankName)}</strong>
                <span>${model.multiplayer.ratingAfter} rating</span>
                <small>${model.multiplayer.ratingDeltaLabel}</small>
              </div>
              <div class="meta-ui__reward-list">
                ${model.multiplayer.completedGoals.map((goal) => `
                  <div class="meta-ui__reward">
                    <span>${escapeHtml(goal.label)}</span>
                    <strong>+${goal.rewardCurrency} CR / +${goal.rewardXp} XP</strong>
                  </div>
                `).join('') || '<div class="meta-ui__reward"><span>No extra multiplayer goals cleared</span><strong>Keep climbing</strong></div>'}
              </div>
            </section>

            <section class="meta-ui__section">
              <div class="meta-ui__section-head">
                <h2>Shareable Highlights</h2>
                <span>These are ready-made brag lines.</span>
              </div>
              <div class="meta-ui__highlight-list">
                ${model.multiplayer.highlights.map((highlight) => `<div class="meta-ui__highlight">${escapeHtml(highlight)}</div>`).join('') || '<div class="meta-ui__highlight">No headline moment this time. Queue another run.</div>'}
              </div>
            </section>
          ` : ''}
        </div>
      </div>
    `;

    this.bindActions();
    this.restoreButtonFeedbacks();
  }

  showPause(model) {
    this.root.classList.remove('meta-ui--hidden');
    this.root.innerHTML = `
      <div class="meta-ui__overlay">
        <div class="meta-ui__panel meta-ui__panel--pause">
          <div class="meta-ui__eyebrow">Race Control</div>
          <h2 class="meta-ui__title">${escapeHtml(model.title)}</h2>
          <p class="meta-ui__copy">${escapeHtml(model.subtitle)}</p>
          <div class="meta-ui__actions">
            <button class="meta-ui__launch" type="button" data-action="resume-race">Resume Race</button>
            ${model.canRestart ? '<button class="meta-ui__secondary" type="button" data-action="restart-race">Restart Race</button>' : ''}
            ${model.canEndRace ? '<button class="meta-ui__secondary meta-ui__secondary--danger" type="button" data-action="end-race">End Race</button>' : ''}
            ${model.canLeaveMatch ? '<button class="meta-ui__secondary meta-ui__secondary--danger" type="button" data-action="leave-match">Leave Match</button>' : ''}
          </div>
        </div>
      </div>
    `;

    this.bindActions();
    this.restoreButtonFeedbacks();
  }

  hidePause() {
    const overlay = this.root.querySelector('.meta-ui__overlay');

    if (overlay) {
      this.hide();
    }
  }

  getGaragePreviewHost() {
    return this.root.querySelector('[data-garage-preview-host]');
  }

  renderRarityChip(rarity, label = null) {
    const safeRarity = String(rarity ?? 'common').toLowerCase();
    return `<span class="meta-ui__rarity meta-ui__rarity--${escapeHtml(safeRarity)}">${escapeHtml(label ?? formatLabel(safeRarity))}</span>`;
  }

  renderPodium(entries) {
    const ordered = [...entries].sort((entryA, entryB) => (entryA.position ?? 99) - (entryB.position ?? 99));
    const podiumOrder = [ordered.find((entry) => entry.position === 2), ordered.find((entry) => entry.position === 1), ordered.find((entry) => entry.position === 3)].filter(Boolean);

    return `
      <div class="meta-ui__podium">
        ${podiumOrder.map((entry, index) => `
          <article class="meta-ui__podium-card meta-ui__podium-card--p${entry.position}" style="--podium-accent:${escapeHtml(entry.accentColor ?? '#7fdfff')}; --podium-delay:${index * 0.08}s;">
            <div class="meta-ui__podium-ship"></div>
            <div class="meta-ui__podium-rank">P${entry.position}</div>
            <strong>${escapeHtml(entry.name)}</strong>
            <span>${escapeHtml(entry.shipName)}</span>
            <small>${escapeHtml(entry.manufacturer)}</small>
            <em>${escapeHtml(entry.finishTimeLabel)}</em>
          </article>
        `).join('')}
      </div>
    `;
  }

  renderSwatches(label, options, selectedId, action) {
    return `
      <div class="meta-ui__swatch-group">
        <strong>${label}</strong>
        <div class="meta-ui__swatch-row">
          ${options.map((option) => `
            <button
              class="meta-ui__swatch meta-ui__swatch--${escapeHtml(option.rarity ?? 'common')} ${option.id === selectedId ? 'is-selected' : ''}"
              type="button"
              data-action="${action}"
              data-id="${option.id}"
              ${option.unlocked ? '' : 'disabled'}
              title="${option.unlocked ? `${option.name} • ${formatLabel(option.rarity ?? 'common')}` : `Unlocks at Level ${option.unlockLevel}`}"
              style="--swatch-color:#${option.hex};"
            ></button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderRoomState(multiplayer) {
    if (!multiplayer.room) {
      return `
        <div class="meta-ui__room-state">
          <strong>No active room</strong>
          <span>Quick Match drops you into live competition fast. Private rooms now support invite links, host control, and realtime lobby management.</span>
        </div>
      `;
    }

    return `
      <div class="meta-ui__room-state">
        <div class="meta-ui__room-head">
          <strong>${escapeHtml(multiplayer.room.typeLabel)}</strong>
          <span>Code ${escapeHtml(multiplayer.room.code)}</span>
        </div>
        <small>${escapeHtml(multiplayer.room.statusLabel)} | ${escapeHtml(multiplayer.room.trackName)} | ${escapeHtml(multiplayer.room.slotsLabel)}</small>
        <div class="meta-ui__social-card">
          <div>
            <strong>Invite Link</strong>
            <span>${escapeHtml(multiplayer.room.joinLink)}</span>
          </div>
          <div class="meta-ui__social-actions">
            <button class="meta-ui__secondary" type="button" data-action="copy-link" data-id="${escapeHtml(multiplayer.room.joinLink)}">Copy Link</button>
            <button class="meta-ui__secondary" type="button" data-action="copy-code" data-id="${escapeHtml(multiplayer.room.code)}">Copy Code</button>
          </div>
        </div>
        <div class="meta-ui__leaderboards">
          <div>
            <strong class="meta-ui__mini-title">Pilots</strong>
            ${this.renderRoomPlayers(multiplayer.room.players)}
          </div>
          <div>
            <strong class="meta-ui__mini-title">Room Feed</strong>
            <div class="meta-ui__highlight-list">
              ${(multiplayer.room.feed.length > 0
                ? multiplayer.room.feed
                : [{ text: 'Room feed is quiet. Throw an emote before the launch.' }]
              ).map((entry) => `<div class="meta-ui__highlight">${escapeHtml(entry.text)}</div>`).join('')}
            </div>
          </div>
        </div>
        <div class="meta-ui__multiplayer-actions">
          ${multiplayer.room.canToggleReady ? '<button class="meta-ui__action" type="button" data-action="room-ready">Toggle Ready</button>' : ''}
          ${multiplayer.room.canStart ? '<button class="meta-ui__action" type="button" data-action="room-start">Start Room</button>' : ''}
          ${multiplayer.room.canRematch ? '<button class="meta-ui__action" type="button" data-action="room-rematch">Rematch</button>' : ''}
          ${multiplayer.room.canDiscard ? '<button class="meta-ui__secondary" type="button" data-action="room-discard">Discard Room</button>' : ''}
          <button class="meta-ui__action" type="button" data-action="room-leave">Leave Room</button>
        </div>
        <div class="meta-ui__friend-list">
          <button class="meta-ui__friend-chip" type="button" data-action="emote" data-id="Good luck">Good luck</button>
          <button class="meta-ui__friend-chip" type="button" data-action="emote" data-id="Bring it">Bring it</button>
          <button class="meta-ui__friend-chip" type="button" data-action="emote" data-id="No mistakes">No mistakes</button>
        </div>
      </div>
    `;
  }

  renderRoomPlayers(players) {
    if (!players || players.length === 0) {
      return '<div class="meta-ui__highlight">No pilots in this lobby yet.</div>';
    }

    return `
      <div class="meta-ui__social-list">
        ${players.map((player, index) => `
          <div class="meta-ui__social-card">
            <div>
              <strong>${escapeHtml(player.name ?? 'Pilot')}</strong>
              <span>${escapeHtml(player.isHost ? `Host | P${index + 1}` : `Grid ${index + 1}`)} | ${escapeHtml(player.ready ? 'Ready' : 'Not Ready')} | ${escapeHtml(player.connected === false ? 'Reconnecting' : 'Online')} | ${escapeHtml(player.tier ? `${player.tier} | ${player.rating}` : `${player.rating ?? ''}`)}</span>
            </div>
            <div class="meta-ui__social-actions">
              ${player.canTransferHost ? `<button class="meta-ui__secondary" type="button" data-action="room-host" data-id="${escapeHtml(player.playerId)}">Make Host</button>` : ''}
              ${player.canKick ? `<button class="meta-ui__secondary" type="button" data-action="room-kick" data-id="${escapeHtml(player.playerId)}">Remove</button>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderLeaderboard(entries, compact = false) {
    if (!entries || entries.length === 0) {
      return '<div class="meta-ui__highlight">No standings yet.</div>';
    }

    return `
      <div class="meta-ui__board-list ${compact ? 'is-compact' : ''}">
        ${entries.map((entry, index) => `
          <div class="meta-ui__board-row">
            <strong>${escapeHtml(entry.position ? `P${entry.position}` : entry.place ? `P${entry.place}` : `#${index + 1}`)}</strong>
            <span>${escapeHtml(entry.name ?? entry.playerName ?? 'Pilot')}</span>
            <small>${escapeHtml(entry.tier ? `${entry.tier}${entry.rating ? ` | ${entry.rating}` : ''}` : entry.finishTime ? `${(entry.finishTime / 1000).toFixed(2)}s` : entry.rating ? `${entry.rating}` : '')}</small>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderGoalList(goals) {
    return `
      <div class="meta-ui__goal-list">
        ${goals.map((goal) => `
          <div class="meta-ui__goal ${goal.completed ? 'is-complete' : ''}">
            <strong>${escapeHtml(goal.label)}</strong>
            <span>${escapeHtml(goal.progress)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  getActionFeedbackLabel(action) {
    return ACTION_FEEDBACK_LABELS[action] ?? '';
  }

  getFormFeedbackLabel(formAction) {
    return FORM_FEEDBACK_LABELS[formAction] ?? '';
  }

  getButtonFeedbackKey(element) {
    if (!element) {
      return '';
    }

    const explicit = element.getAttribute('data-feedback-key');

    if (explicit) {
      return explicit;
    }

    const action = element.getAttribute('data-action') ?? 'button';
    const id = element.getAttribute('data-id') ?? '';
    return `${action}:${id}`;
  }

  clearButtonFeedbackState(element) {
    if (!element) {
      return;
    }

    delete element.dataset.feedback;
    element.classList.remove('is-feedback', 'is-feedback-fading');
  }

  applyButtonFeedbackState(element, feedback, now = Date.now()) {
    if (!element) {
      return;
    }

    if (!feedback || feedback.expiresAt <= now) {
      this.clearButtonFeedbackState(element);
      return;
    }

    element.dataset.feedback = feedback.label;
    element.classList.add('is-feedback');
    element.classList.toggle('is-feedback-fading', feedback.expiresAt - now <= BUTTON_FEEDBACK_FADE_DURATION);
  }

  getButtonsByFeedbackKey(key) {
    if (!key) {
      return [];
    }

    return [...this.root.querySelectorAll('button')]
      .filter((button) => this.getButtonFeedbackKey(button) === key);
  }

  syncButtonFeedback(key) {
    if (!key) {
      return;
    }

    const now = Date.now();
    const feedback = this.buttonFeedbacks.get(key);

    if (feedback && feedback.expiresAt <= now) {
      this.buttonFeedbacks.delete(key);
    }

    const activeFeedback = this.buttonFeedbacks.get(key) ?? null;
    this.getButtonsByFeedbackKey(key).forEach((button) => {
      this.applyButtonFeedbackState(button, activeFeedback, now);
    });
  }

  clearFeedbackGroup(action, activeKey) {
    if (!SINGLE_ACTIVE_FEEDBACK_ACTIONS.has(action)) {
      return;
    }

    for (const key of this.buttonFeedbacks.keys()) {
      if (key === activeKey || !key.startsWith(`${action}:`)) {
        continue;
      }

      const activeTimers = this.buttonFeedbackTimers.get(key);

      if (activeTimers) {
        window.clearTimeout(activeTimers.fadeTimer);
        window.clearTimeout(activeTimers.clearTimer);
        this.buttonFeedbackTimers.delete(key);
      }

      this.buttonFeedbacks.delete(key);
      this.syncButtonFeedback(key);
    }
  }

  scheduleButtonFeedback(key) {
    if (!key) {
      return;
    }

    const activeTimers = this.buttonFeedbackTimers.get(key);

    if (activeTimers) {
      window.clearTimeout(activeTimers.fadeTimer);
      window.clearTimeout(activeTimers.clearTimer);
    }

    const feedback = this.buttonFeedbacks.get(key);

    if (!feedback) {
      this.buttonFeedbackTimers.delete(key);
      return;
    }

    const now = Date.now();
    const fadeDelay = Math.max(0, feedback.expiresAt - now - BUTTON_FEEDBACK_FADE_DURATION);
    const clearDelay = Math.max(0, feedback.expiresAt - now) + 24;
    const fadeTimer = window.setTimeout(() => {
      this.syncButtonFeedback(key);
    }, fadeDelay);
    const clearTimer = window.setTimeout(() => {
      this.buttonFeedbacks.delete(key);
      this.syncButtonFeedback(key);
      this.buttonFeedbackTimers.delete(key);
    }, clearDelay);

    this.buttonFeedbackTimers.set(key, { fadeTimer, clearTimer });
  }

  flashButtonFeedback(element, label) {
    if (!element || !label) {
      return;
    }

    const key = this.getButtonFeedbackKey(element);

    if (!key) {
      return;
    }

    const action = element.getAttribute('data-action') ?? '';
    this.clearFeedbackGroup(action, key);

    const expiresAt = Date.now() + BUTTON_FEEDBACK_DURATION;
    this.buttonFeedbacks.set(key, { label, expiresAt });
    this.syncButtonFeedback(key);
    this.scheduleButtonFeedback(key);
  }

  restoreButtonFeedbacks() {
    const now = Date.now();

    for (const [key, feedback] of this.buttonFeedbacks.entries()) {
      if (feedback.expiresAt <= now) {
        this.buttonFeedbacks.delete(key);
      }
    }

    this.root.querySelectorAll('button').forEach((button) => {
      const key = this.getButtonFeedbackKey(button);
      const feedback = key ? this.buttonFeedbacks.get(key) : null;
      this.applyButtonFeedbackState(button, feedback, now);
    });
  }

  bindActions() {
    this.root.querySelectorAll('[data-action]').forEach((element) => {
      element.addEventListener('click', () => {
        const action = element.getAttribute('data-action');
        const id = element.getAttribute('data-id');
        const feedbackLabel = this.getActionFeedbackLabel(action);

        if (action === 'hangar-page') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.hangarPage = id || 'career';
          if (this.lastHangarModel) {
            this.showHangar(this.lastHangarModel);
          }
          this.handlers.onHangarPageChange?.(this.hangarPage);
        } else if (action === 'preview-ship') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onShipPreview?.(id);
        } else if (action === 'track') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onTrackSelect(id);
        } else if (action === 'ship') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onShipSelect(id);
        } else if (action === 'buy-ship') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onShipPurchase(id);
        } else if (action === 'hull' || action === 'glow' || action === 'trail') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onCosmeticSelect(action, id);
        } else if (action === 'start-race') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onStartRace();
        } else if (action === 'start-time-trial') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onStartTimeTrial();
        } else if (action === 'race-again') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onRaceAgain();
        } else if (action === 'back-hangar') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onBackToHangar();
        } else if (action === 'theme') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onThemeChange(id);
        } else if (action === 'google-login') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onGoogleLogin();
        } else if (action === 'logout') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onLogout?.();
        } else if (action === 'copy-id') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onCopyIdentity(id, 'ID');
        } else if (action === 'copy-link') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onCopyIdentity(id, 'Invite link');
        } else if (action === 'copy-code') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onCopyIdentity(id, 'Room code');
        } else if (action === 'quick-match') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onQuickMatch();
        } else if (action === 'private-create') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onCreatePrivateRoom();
        } else if (action === 'room-ready') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onToggleReady?.();
        } else if (action === 'room-start') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onStartPrivateRoom();
        } else if (action === 'room-host') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onTransferHost?.(id);
        } else if (action === 'room-rematch') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onRoomRematch?.();
        } else if (action === 'room-kick') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onKickRoomPlayer(id);
        } else if (action === 'room-discard') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onDiscardRoom();
        } else if (action === 'room-leave') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onLeaveRoom();
        } else if (action === 'emote') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onSendEmote(id);
        } else if (action === 'resume-race') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onResumeRace?.();
        } else if (action === 'restart-race') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onRestartRace?.();
        } else if (action === 'end-race') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onEndRace?.();
        } else if (action === 'leave-match') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onLeaveCurrentMatch?.();
        } else if (action === 'rebind') {
          this.flashButtonFeedback(element, feedbackLabel);
          this.handlers.onStartRebind?.(id);
        }
      });
    });

    const nameForm = this.root.querySelector('[data-action="save-name"]');

    if (nameForm) {
      nameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = this.root.querySelector('#pilot-name');
        const submitButton = nameForm.querySelector('button[type="submit"]');
        this.flashButtonFeedback(submitButton, this.getFormFeedbackLabel('save-name'));
        this.handlers.onPlayerNameChange(input?.value ?? '');
      });
    }

    const joinRoomForm = this.root.querySelector('[data-action-form="join-room"]');

    if (joinRoomForm) {
      joinRoomForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = this.root.querySelector('#private-room-code');
        const submitButton = joinRoomForm.querySelector('button[type="submit"]');
        this.flashButtonFeedback(submitButton, this.getFormFeedbackLabel('join-room'));
        this.handlers.onJoinPrivateRoom(input?.value ?? '');
      });
    }

    this.root.querySelectorAll('[data-audio-range]').forEach((input) => {
      input.addEventListener('change', () => {
        this.handlers.onAudioSettingsChange?.({
          [input.getAttribute('data-audio-range')]: Number(input.value)
        });
      });
    });

    this.root.querySelectorAll('[data-audio-toggle]').forEach((input) => {
      input.addEventListener('change', () => {
        this.handlers.onAudioSettingsChange?.({
          [input.getAttribute('data-audio-toggle')]: Boolean(input.checked)
        });
      });
    });

    this.root.querySelectorAll('[data-graphics-toggle]').forEach((input) => {
      input.addEventListener('change', () => {
        this.handlers.onGraphicsSettingsChange?.({
          [input.getAttribute('data-graphics-toggle')]: Boolean(input.checked)
        });
      });
    });

    this.root.querySelectorAll('[data-graphics-select]').forEach((input) => {
      input.addEventListener('change', () => {
        this.handlers.onGraphicsSettingsChange?.({
          [input.getAttribute('data-graphics-select')]: input.value
        });
      });
    });

    this.root.querySelectorAll('[data-gameplay-select]').forEach((input) => {
      input.addEventListener('change', () => {
        this.handlers.onDifficultyChange?.(input.value);
      });
    });

    this.root.querySelectorAll('[data-gameplay-toggle="tutorial"]').forEach((input) => {
      input.addEventListener('change', () => {
        this.handlers.onToggleTutorialSeen?.();
      });
    });
  }
}

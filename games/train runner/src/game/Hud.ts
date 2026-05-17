import type { GameSettings, GapInfo, HudPhase3Snapshot, HudStatsSnapshot, RunnerState } from './types';

export class Hud {
  private readonly root = document.createElement('div');
  private readonly routeValue = document.createElement('span');
  private readonly speedValue = document.createElement('span');
  private readonly distanceValue = document.createElement('span');
  private readonly gapValue = document.createElement('span');
  private readonly healthValue = document.createElement('span');
  private readonly coinValue = document.createElement('span');
  private readonly energyValue = document.createElement('span');
  private readonly comboValue = document.createElement('span');
  private readonly scoreValue = document.createElement('span');
  private readonly tokenValue = document.createElement('span');
  private readonly hint = document.createElement('div');
  private readonly status = document.createElement('div');
  private readonly feedback = document.createElement('div');
  private readonly damageFlash = document.createElement('div');
  private readonly controlsPanel = document.createElement('div');
  private readonly objectivesPanel = document.createElement('div');
  private readonly bossPanel = document.createElement('div');
  private readonly elitePanel = document.createElement('div');
  private readonly warningBanner = document.createElement('div');
  private readonly summaryPanel = document.createElement('div');
  private readonly portraitHint = document.createElement('div');
  private readonly specialValue = document.createElement('span');
  private feedbackTimer = 0;
  private damageTimer = 0;

  constructor(host: HTMLElement) {
    this.root.className = 'hud';
    this.root.innerHTML = '<div class="hud__vignette"></div>';

    const top = document.createElement('div');
    top.className = 'hud__top';
    top.append(
      this.createPill('Route', this.routeValue),
      this.createPill('Speed', this.speedValue),
      this.createPill('Distance', this.distanceValue),
      this.createPill('Next Gap', this.gapValue),
      this.createPill('Health', this.healthValue),
      this.createPill('Coins', this.coinValue),
      this.createPill('Energy', this.energyValue),
      this.createPill('Special', this.specialValue),
      this.createPill('Tokens', this.tokenValue),
      this.createPill('Flow', this.comboValue),
      this.createPill('Score', this.scoreValue)
    );

    this.hint.className = 'hud__hint';
    this.hint.textContent = 'W/Up push speed  |  A/D move  |  Space jump gaps  |  S slide  |  Shift dodge';

    this.status.className = 'hud__status';
    this.status.innerHTML =
      '<h1 class="hud__title">Train Roof Rush</h1><p class="hud__copy">Press any key to cut the cinematic camera. Press R after a fall to restart.</p>';

    this.feedback.className = 'hud__feedback';
    this.damageFlash.className = 'hud__damage-flash';
    this.controlsPanel.className = 'hud__controls-panel';
    this.controlsPanel.innerHTML = `
      <div class="hud__controls-title">Controls</div>
      <div class="hud__control-row"><span>Move</span><strong>A / D or Arrows</strong></div>
      <div class="hud__control-row"><span>Jump</span><strong>Space</strong></div>
      <div class="hud__control-row"><span>Slide</span><strong>S / Down</strong></div>
      <div class="hud__control-row"><span>Dash</span><strong>Shift</strong></div>
      <div class="hud__control-row"><span>Attack</span><strong>J / Click</strong></div>
      <div class="hud__control-row"><span>Special</span><strong>E</strong></div>
      <div class="hud__control-row"><span>Restart</span><strong>R / Enter</strong></div>
    `;
    this.objectivesPanel.className = 'hud__objectives';
    this.bossPanel.className = 'hud__boss-bar';
    this.elitePanel.className = 'hud__elite-bar';
    this.warningBanner.className = 'hud__warning';
    this.summaryPanel.className = 'hud__summary';
    this.portraitHint.className = 'hud__portrait-hint';
    this.portraitHint.textContent = 'Rotate device for best experience.';

    this.root.append(
      top,
      this.controlsPanel,
      this.objectivesPanel,
      this.bossPanel,
      this.elitePanel,
      this.warningBanner,
      this.summaryPanel,
      this.hint,
      this.portraitHint,
      this.status,
      this.feedback,
      this.damageFlash
    );
    host.appendChild(this.root);
  }

  update(
    dt: number,
    speedKmh: number,
    distance: number,
    gap: GapInfo | null,
    state: RunnerState,
    stats: HudStatsSnapshot,
    phase3?: HudPhase3Snapshot
  ): void {
    this.speedValue.textContent = `${Math.round(speedKmh)}`;
    this.routeValue.textContent = phase3?.routeName ?? '--';
    this.distanceValue.textContent = `${Math.max(0, Math.floor(distance))}m`;
    this.gapValue.textContent = gap && gap.distance < 44 ? `${gap.distance.toFixed(0)}m / ${gap.length.toFixed(1)}m` : '--';
    this.healthValue.textContent = `${stats.health}/${stats.maxHealth}${stats.shielded ? ' S' : ''}`;
    this.coinValue.textContent = `${stats.coins}`;
    this.tokenValue.textContent = `${stats.routeTokens}`;
    this.energyValue.textContent = `${stats.energy}%`;
    this.specialValue.textContent = phase3?.specialReady ? 'READY' : '--';
    this.comboValue.textContent = stats.comboMultiplier > 1 ? `x${stats.comboMultiplier}` : '--';
    this.scoreValue.textContent = `${stats.score}`;
    this.updatePhase3(phase3);

    const failed = state === 'failed';
    this.status.classList.toggle('is-visible', failed || state === 'intro');

    if (failed) {
      this.status.innerHTML =
        '<h1 class="hud__title">Run Ended</h1><p class="hud__copy">Press R or Enter to restart on the lead coach.</p>';
      this.hint.textContent = 'R / Enter restart';
    } else if (state === 'intro') {
      this.status.innerHTML =
        '<h1 class="hud__title">Train Roof Rush</h1><p class="hud__copy">High-speed rooftop traversal prototype. Press any key to settle into gameplay view.</p>';
      this.hint.textContent = 'W/Up speed  |  A/D move  |  Space jump  |  S slide  |  Shift dash  |  J / Click attack  |  E special';
    } else {
      this.hint.textContent =
        stats.comboLabel !== '--'
          ? stats.comboLabel
          : 'W/Up speed  |  A/D move  |  Space jump  |  S slide  |  Shift dash  |  J / Click attack  |  E special';
    }

    if (this.feedbackTimer > 0) {
      this.feedbackTimer -= dt;
      if (this.feedbackTimer <= 0) {
        this.feedback.classList.remove('is-visible');
      }
    }

    if (this.damageTimer > 0) {
      this.damageTimer -= dt;
      if (this.damageTimer <= 0) {
        this.damageFlash.classList.remove('is-visible');
      }
    }
  }

  showFeedback(text: string, duration = 0.72): void {
    this.feedback.textContent = text;
    this.feedbackTimer = duration;
    this.feedback.classList.add('is-visible');
  }

  showDamageFlash(duration = 0.24): void {
    this.damageTimer = duration;
    this.damageFlash.classList.add('is-visible');
  }

  setGameplayVisible(visible: boolean): void {
    this.root.classList.toggle('is-hidden', !visible);
  }

  setControlHintsVisible(visible: boolean): void {
    this.controlsPanel.classList.toggle('is-hidden', !visible);
  }

  setHighContrastWarnings(enabled: boolean): void {
    this.root.classList.toggle('hud--high-contrast', enabled);
  }

  setComfortSettings(settings: GameSettings): void {
    this.root.style.setProperty('--ui-scale', `${settings.uiScale}`);
    this.root.classList.toggle('hud--reduced-motion', settings.reducedMotion);
  }

  dispose(): void {
    this.root.remove();
  }

  private createPill(label: string, valueNode: HTMLSpanElement): HTMLElement {
    const pill = document.createElement('div');
    const labelNode = document.createElement('span');

    pill.className = 'hud__pill';
    labelNode.className = 'hud__label';
    valueNode.className = 'hud__value';

    labelNode.textContent = label;
    valueNode.textContent = '--';
    pill.append(labelNode, valueNode);

    return pill;
  }

  private updatePhase3(phase3?: HudPhase3Snapshot): void {
    if (!phase3) {
      return;
    }

    this.objectivesPanel.innerHTML = `
      <div class="hud__panel-title">Objectives</div>
      ${phase3.missions
        .map(
          (mission) =>
            `<div class="hud__objective ${mission.completed ? 'is-complete' : ''}"><span>${mission.label}</span><strong>${Math.floor(
              mission.progress
            )}/${mission.target}</strong></div>`
        )
        .join('')}
    `;

    this.updateBar(
      this.bossPanel,
      phase3.boss.active,
      phase3.boss.name,
      phase3.boss.health,
      phase3.boss.maxHealth,
      phase3.boss.vulnerable ? 'VULNERABLE' : phase3.boss.state.toUpperCase()
    );
    this.updateBar(
      this.elitePanel,
      phase3.elite.active,
      phase3.elite.name,
      phase3.elite.health,
      phase3.elite.maxHealth,
      phase3.elite.state.toUpperCase()
    );

    const warning = phase3.warning || phase3.setPiece.label;
    this.warningBanner.textContent = warning;
    this.warningBanner.classList.toggle('is-visible', Boolean(warning));

    if (phase3.summary) {
      this.summaryPanel.classList.add('is-visible');
      this.summaryPanel.innerHTML = `
        <h2>${phase3.summary.victory ? 'Level Complete' : 'Run Summary'}</h2>
        <div class="hud__grade">${phase3.summary.grade}</div>
        <div class="hud__summary-grid">
          <span>Reason</span><strong>${phase3.summary.endReason ?? 'Run ended.'}</strong>
          <span>Distance</span><strong>${Math.floor(phase3.summary.distance)}m</strong>
          <span>Coins</span><strong>${phase3.summary.coins}</strong>
          <span>Enemies</span><strong>${phase3.summary.enemiesDefeated}</strong>
          <span>Perfect Dodges</span><strong>${phase3.summary.perfectDodges}</strong>
          <span>Max Flow</span><strong>x${phase3.summary.maxCombo}</strong>
          <span>Objectives</span><strong>${phase3.summary.objectivesCompleted}/${phase3.summary.objectivesTotal}</strong>
          <span>Boss</span><strong>${phase3.summary.bossDefeated ? 'Defeated' : 'Escaped'}</strong>
        </div>
        <p>Press R or Enter to run again.</p>
      `;
    } else {
      this.summaryPanel.classList.remove('is-visible');
    }
  }

  private updateBar(panel: HTMLElement, visible: boolean, name: string, health: number, maxHealth: number, status: string): void {
    panel.classList.toggle('is-visible', visible);
    if (!visible) {
      panel.innerHTML = '';
      return;
    }

    const ratio = Math.max(0, Math.min(1, health / Math.max(1, maxHealth)));
    panel.innerHTML = `
      <div class="hud__bar-label"><span>${name}</span><strong>${status}</strong></div>
      <div class="hud__bar-track"><i style="transform: scaleX(${ratio})"></i></div>
    `;
  }
}

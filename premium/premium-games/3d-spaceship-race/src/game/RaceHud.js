function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class RaceHud {
  constructor(container, { inputController = null, onRaceMenu = null } = {}) {
    this.root = document.createElement('div');
    this.root.className = 'race-hud';
    this.onRaceMenu = onRaceMenu;
    this.mobileButtonNodes = new Map();
    this.mobileButtonLabels = new Map();
    this.mobileButtonHints = new Map();
    this.mobileControlCleanup = [];

    this.topBar = document.createElement('div');
    this.topBar.className = 'race-hud__topbar';

    this.controls = document.createElement('div');
    this.controls.className = 'race-hud__controls';
    this.controlsSignature = '';
    this.challengeSignature = '';
    this.commentarySignature = '';
    this.trackLegendSignature = '';
    this.mapMarkerNodes = new Map();
    this.mapLegendNodes = new Map();

    this.raceMenuButton = document.createElement('button');
    this.raceMenuButton.type = 'button';
    this.raceMenuButton.className = 'race-hud__menu-button';
    this.raceMenuButton.textContent = 'Match Menu';
    this.raceMenuButton.setAttribute('aria-label', 'Open match menu');
    this.raceMenuButton.hidden = true;
    this.raceMenuButton.addEventListener('click', () => {
      this.onRaceMenu?.();
    });

    this.telemetry = document.createElement('div');
    this.telemetry.className = 'race-hud__telemetry';

    this.status = document.createElement('div');
    this.status.className = 'race-hud__status';

    this.position = document.createElement('div');
    this.position.className = 'race-hud__metric';

    this.lap = document.createElement('div');
    this.lap.className = 'race-hud__metric';

    this.speed = document.createElement('div');
    this.speed.className = 'race-hud__metric';

    this.lapTime = document.createElement('div');
    this.lapTime.className = 'race-hud__metric';

    this.bestLap = document.createElement('div');
    this.bestLap.className = 'race-hud__metric';

    this.split = document.createElement('div');
    this.split.className = 'race-hud__metric';

    this.draft = document.createElement('div');
    this.draft.className = 'race-hud__metric';

    this.boost = document.createElement('div');
    this.boost.className = 'race-hud__metric race-hud__metric--boost';

    this.boostLabel = document.createElement('div');
    this.boostLabel.className = 'race-hud__boost-label';

    this.boostMeter = document.createElement('div');
    this.boostMeter.className = 'race-hud__meter';

    this.boostFill = document.createElement('div');
    this.boostFill.className = 'race-hud__meter-fill';

    this.boostMeter.appendChild(this.boostFill);
    this.boost.append(this.boostLabel, this.boostMeter);

    this.item = document.createElement('div');
    this.item.className = 'race-hud__metric';

    this.telemetry.append(
      this.status,
      this.position,
      this.lap,
      this.speed,
      this.lapTime,
      this.bestLap,
      this.split,
      this.draft,
      this.boost,
      this.item
    );

    this.challengePanel = document.createElement('div');
    this.challengePanel.className = 'race-hud__challenges';

    this.challengeTitle = document.createElement('div');
    this.challengeTitle.className = 'race-hud__challenge-title';
    this.challengeTitle.textContent = 'Run Goals';

    this.challengeList = document.createElement('div');
    this.challengeList.className = 'race-hud__challenge-list';

    this.challengePanel.append(this.challengeTitle, this.challengeList);

    this.commentaryPanel = document.createElement('div');
    this.commentaryPanel.className = 'race-hud__commentary';

    this.commentaryTitle = document.createElement('div');
    this.commentaryTitle.className = 'race-hud__commentary-title';
    this.commentaryTitle.textContent = 'Live Commentary';

    this.commentaryHeadline = document.createElement('div');
    this.commentaryHeadline.className = 'race-hud__commentary-headline';

    this.commentaryList = document.createElement('div');
    this.commentaryList.className = 'race-hud__commentary-list';

    this.commentaryPanel.append(this.commentaryTitle, this.commentaryHeadline, this.commentaryList);

    this.mapPanel = document.createElement('div');
    this.mapPanel.className = 'race-hud__map';

    this.mapTitle = document.createElement('div');
    this.mapTitle.className = 'race-hud__map-title';
    this.mapTitle.textContent = 'Track Radar';

    this.mapFrame = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.mapFrame.setAttribute('viewBox', '0 0 100 100');
    this.mapFrame.setAttribute('class', 'race-hud__map-svg');

    this.mapPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.mapPath.setAttribute('class', 'race-hud__map-path');

    this.mapMarkers = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.mapMarkers.setAttribute('class', 'race-hud__map-markers');

    this.mapFrame.append(this.mapPath, this.mapMarkers);

    this.mapLegend = document.createElement('div');
    this.mapLegend.className = 'race-hud__map-legend';

    this.mapPanel.append(this.mapTitle, this.mapFrame, this.mapLegend);

    this.center = document.createElement('div');
    this.center.className = 'race-hud__center';

    this.centerMain = document.createElement('div');
    this.centerMain.className = 'race-hud__main';

    this.centerSub = document.createElement('div');
    this.centerSub.className = 'race-hud__sub';

    this.center.append(this.centerMain, this.centerSub);

    this.toast = document.createElement('div');
    this.toast.className = 'race-hud__toast';

    this.mobileBrief = document.createElement('div');
    this.mobileBrief.className = 'race-hud__mobile-brief';

    this.mobileBriefTitle = document.createElement('div');
    this.mobileBriefTitle.className = 'race-hud__mobile-brief-title';
    this.mobileBriefTitle.textContent = 'Pulse';

    this.mobileBriefHeadline = document.createElement('div');
    this.mobileBriefHeadline.className = 'race-hud__mobile-brief-headline';

    this.mobileBriefText = document.createElement('div');
    this.mobileBriefText.className = 'race-hud__mobile-brief-text';

    this.mobileBrief.append(this.mobileBriefTitle, this.mobileBriefHeadline, this.mobileBriefText);

    this.mobileControls = document.createElement('div');
    this.mobileControls.className = 'race-hud__mobile';

    this.mobileSteer = document.createElement('div');
    this.mobileSteer.className = 'race-hud__mobile-bank';

    this.mobileActions = document.createElement('div');
    this.mobileActions.className = 'race-hud__mobile-actions';

    this.mobileCenter = document.createElement('div');
    this.mobileCenter.className = 'race-hud__mobile-center';

    this.mobileLegend = document.createElement('div');
    this.mobileLegend.className = 'race-hud__mobile-legend';
    this.mobileLegend.innerHTML = '<strong>Touch Flight</strong><span>Neon race control deck</span>';

    this.mobileThrottle = this.createMobileButton('accelerate', {
      symbol: '▲',
      label: 'Thrust',
      hint: 'Hold'
    });
    this.mobileThrottle.classList.add('race-hud__mobile-button--throttle');

    this.mobileLeft = this.createMobileButton('left', {
      symbol: '◀',
      label: 'Bank Left',
      hint: 'Left'
    });

    this.mobileRight = this.createMobileButton('right', {
      symbol: '▶',
      label: 'Bank Right',
      hint: 'Right'
    });

    this.mobileDrift = this.createMobileButton('drift', {
      symbol: '≈',
      label: 'Drift',
      hint: 'Drift'
    });

    this.mobileBoost = this.createMobileButton('boost', {
      symbol: '⚡',
      label: 'Boost',
      hint: 'Charge'
    });
    this.mobileBoost.classList.add('race-hud__mobile-button--warm');

    this.mobileItem = this.createMobileButton('item', {
      symbol: '✦',
      label: 'Power-Up',
      hint: 'Empty',
      tapOnly: true
    });
    this.mobileItem.classList.add('race-hud__mobile-button--warm');

    this.mobilePause = this.createMobileButton('pause', {
      symbol: '⏸',
      label: 'Pause',
      hint: 'Menu',
      tapOnly: true
    });

    this.mobileSteer.append(this.mobileLeft, this.mobileRight);
    this.mobileActions.append(this.mobileDrift, this.mobileBoost, this.mobileItem, this.mobilePause);
    this.mobileCenter.append(this.mobileLegend, this.mobileThrottle);
    this.mobileControls.append(this.mobileSteer, this.mobileCenter, this.mobileActions);

    this.currentTrackMapId = null;

    this.topBar.append(this.telemetry, this.controls, this.challengePanel);
    this.root.append(this.topBar, this.commentaryPanel, this.mapPanel, this.center, this.toast, this.mobileBrief, this.mobileControls);
    container.appendChild(this.root);

    if (inputController) {
      this.bindMobileInput(inputController);
    }
  }

  setText(node, value) {
    const nextValue = value ?? '';

    if (node.textContent !== nextValue) {
      node.textContent = nextValue;
    }
  }

  setOpacity(node, visible) {
    const nextOpacity = visible ? '1' : '0';

    if (node.style.opacity !== nextOpacity) {
      node.style.opacity = nextOpacity;
    }
  }

  createMobileButton(action, { symbol = '', label, hint, tapOnly = false } = {}) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'race-hud__mobile-button';
    button.dataset.action = action;
    button.dataset.tapOnly = tapOnly ? 'true' : 'false';
    button.setAttribute('aria-label', label);

    const labelNode = document.createElement('strong');
    labelNode.textContent = symbol || label;

    const hintNode = document.createElement('span');
    hintNode.textContent = hint;

    button.append(labelNode, hintNode);
    this.mobileButtonNodes.set(action, button);
    this.mobileButtonLabels.set(action, labelNode);
    this.mobileButtonHints.set(action, hintNode);
    return button;
  }

  bindMobileInput(inputController) {
    for (const [action, button] of this.mobileButtonNodes.entries()) {
      const press = (event) => {
        if (button.disabled) {
          return;
        }

        if (event.cancelable) {
          event.preventDefault();
        }

        button.classList.add('is-active');
        inputController.setVirtualAction(action, true);

        if (typeof button.setPointerCapture === 'function' && event.pointerId != null) {
          try {
            button.setPointerCapture(event.pointerId);
          } catch {
            // Ignore browsers that reject pointer capture for synthetic cases.
          }
        }
      };

      const release = (event) => {
        if (event?.cancelable) {
          event.preventDefault();
        }

        button.classList.remove('is-active');
        inputController.setVirtualAction(action, false);
      };

      button.addEventListener('pointerdown', press);
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
      button.addEventListener('contextmenu', (event) => event.preventDefault());

      this.mobileControlCleanup.push(() => {
        release();
        button.removeEventListener('pointerdown', press);
        button.removeEventListener('pointerup', release);
        button.removeEventListener('pointercancel', release);
        button.removeEventListener('lostpointercapture', release);
      });
    }
  }

  setControls(labels) {
    const signature = JSON.stringify(labels ?? {});

    if (signature === this.controlsSignature) {
      return;
    }

    this.controlsSignature = signature;
    this.controls.innerHTML = `
      <span><strong>${escapeHtml(labels?.accelerate ?? 'W / Up')}</strong><em>Accelerate</em></span>
      <span><strong>${escapeHtml(labels?.steerLeft ?? 'A / Left')}</strong><em>Steer Left</em></span>
      <span><strong>${escapeHtml(labels?.steerRight ?? 'D / Right')}</strong><em>Steer Right</em></span>
      <span><strong>${escapeHtml(labels?.drift ?? 'Shift')}</strong><em>Drift</em></span>
      <span><strong>${escapeHtml(labels?.boost ?? 'Space')}</strong><em>Boost</em></span>
      <span><strong>${escapeHtml(labels?.item ?? 'E')}</strong><em>Power-Up</em></span>
      <span><strong>${escapeHtml(labels?.pause ?? 'Esc')}</strong><em>Pause</em></span>
    `;
    this.controls.append(this.raceMenuButton);
  }

  update({
    status,
    position,
    totalRacers,
    lap,
    lapsTotal,
    speed,
    boostEnergy,
    boostActive,
    itemLabel,
    centerText,
    centerSubtext,
    toastText,
    showTelemetry,
    mobileHud = null,
    raceMenu = null,
    timing = null,
    challenges = [],
    commentary = null,
    trackMap = null
  }) {
    const compactSplit = timing?.splitLabel
      ? timing.splitLabel.replace(/^SPLIT\s+/i, '')
      : '--';
    const compactDraft = timing?.draftLabel
      ? timing.draftLabel
        .replace(/^DRAFT\s+/i, '≈ ')
        .replace(/^TRACK\s+/i, '⌁ ')
        .replace(/^GHOST\s+/i, '◎ ')
      : '⌁ --';

    this.setText(this.status, status);
    this.setText(this.position, `# ${position}/${totalRacers}`);
    this.setText(this.lap, `◎ ${lap}/${lapsTotal}`);
    this.setText(this.speed, `⇢ ${Math.round(speed)} U/S`);
    this.setText(this.lapTime, `◷ ${timing?.lapTimeLabel ?? '--:--.---'}`);
    this.setText(this.bestLap, `★ ${timing?.bestLapLabel ?? '--:--.---'}`);
    this.setText(this.split, `Δ ${compactSplit}`);
    this.setText(this.draft, compactDraft);
    this.setText(this.boostLabel, `⚡ ${Math.round(boostEnergy)}%`);

    const boostWidth = `${boostEnergy}%`;

    if (this.boostFill.style.width !== boostWidth) {
      this.boostFill.style.width = boostWidth;
    }

    const boostOpacity = boostActive ? '1' : '0.78';

    if (this.boostFill.style.opacity !== boostOpacity) {
      this.boostFill.style.opacity = boostOpacity;
    }

    this.setText(this.item, `✦ ${itemLabel}`);
    this.setText(this.centerMain, centerText ?? '');
    this.setText(this.centerSub, centerSubtext ?? '');
    this.setText(this.toast, toastText ?? '');
    this.updateRaceMenuButton(raceMenu);

    this.updateChallenges(challenges);
    this.updateCommentary(commentary);

    this.updateTrackMap(trackMap);

    this.setOpacity(this.topBar, showTelemetry);
    this.setOpacity(this.controls, showTelemetry);
    this.setOpacity(this.telemetry, showTelemetry);
    this.setOpacity(this.challengePanel, showTelemetry && challenges.length > 0);
    this.setOpacity(this.commentaryPanel, showTelemetry && Boolean(commentary?.entries?.length));
    this.setOpacity(this.mapPanel, showTelemetry && Boolean(trackMap));
    this.setOpacity(this.center, Boolean(centerText || centerSubtext));
    this.setOpacity(this.toast, Boolean(toastText));
    this.updateMobileBrief(showTelemetry, commentary);
    this.updateMobileHud(mobileHud);
  }

  updateRaceMenuButton(raceMenu) {
    const visible = Boolean(raceMenu?.visible);
    const label = raceMenu?.label || 'Match Menu';

    if (this.raceMenuButton.textContent !== label) {
      this.raceMenuButton.textContent = label;
    }

    this.raceMenuButton.hidden = !visible;
    this.raceMenuButton.disabled = Boolean(raceMenu?.disabled);
  }

  updateMobileBrief(showTelemetry, commentary) {
    const latestEntry = commentary?.entries?.[0]?.text ?? '';
    const headline = commentary?.headline ?? '';
    const visible = showTelemetry && Boolean(headline || latestEntry);

    this.mobileBrief.classList.toggle('race-hud__mobile-brief--visible', visible);
    this.setText(this.mobileBriefHeadline, headline || 'Flight data stable');
    this.setText(this.mobileBriefText, latestEntry || 'Run clean, keep boost in reserve.');
  }

  updateMobileHud(mobileHud) {
    const visible = Boolean(mobileHud?.visible);
    this.mobileControls.classList.toggle('race-hud__mobile--visible', visible);

    const itemHint = this.mobileButtonHints.get('item');
    if (itemHint) {
      itemHint.textContent = mobileHud?.itemHint ?? 'Empty';
    }

    const boostHint = this.mobileButtonHints.get('boost');
    if (boostHint) {
      boostHint.textContent = mobileHud?.boostHint ?? 'Charge';
    }

    const throttleHint = this.mobileButtonHints.get('accelerate');
    if (throttleHint) {
      throttleHint.textContent = mobileHud?.throttleHint ?? 'Hold';
    }

    for (const [action, button] of this.mobileButtonNodes.entries()) {
      const active = Boolean(mobileHud?.activeActions?.[action]);
      const disabled = Boolean(mobileHud?.disabledActions?.[action]);
      button.classList.toggle('is-active', active);
      button.disabled = disabled;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  updateChallenges(challenges) {
    const signature = challenges
      .map((challenge) => `${challenge.label}|${challenge.progress}`)
      .join('||');

    if (signature === this.challengeSignature) {
      return;
    }

    this.challengeSignature = signature;
    const fragment = document.createDocumentFragment();

    for (const challenge of challenges) {
      const row = document.createElement('div');
      row.className = 'race-hud__challenge';

      const label = document.createElement('span');
      label.textContent = challenge.label;

      const progress = document.createElement('strong');
      progress.textContent = challenge.progress;

      row.append(label, progress);
      fragment.appendChild(row);
    }

    this.challengeList.replaceChildren(fragment);
  }

  updateCommentary(commentary) {
    const commentaryEntries = (commentary?.entries ?? []).slice(0, 5);
    this.setText(this.commentaryHeadline, commentary?.headline ?? '');

    const signature = `${commentary?.headline ?? ''}::${commentaryEntries
      .map((entry) => `${entry.id}|${entry.tone}|${entry.text}`)
      .join('||')}`;

    if (signature === this.commentarySignature) {
      return;
    }

    this.commentarySignature = signature;
    const fragment = document.createDocumentFragment();

    for (const entry of commentaryEntries) {
      const item = document.createElement('div');
      item.className = `race-hud__commentary-entry race-hud__commentary-entry--${entry.tone}`;
      item.textContent = entry.text;
      fragment.appendChild(item);
    }

    this.commentaryList.replaceChildren(fragment);
  }

  clearTrackMap() {
    this.currentTrackMapId = null;
    this.trackLegendSignature = '';
    this.mapPath.setAttribute('d', '');
    this.mapMarkers.replaceChildren();
    this.mapLegend.replaceChildren();
    this.mapMarkerNodes.clear();
    this.mapLegendNodes.clear();
  }

  createMarkerNode() {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const ping = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    group.appendChild(ping);
    return {
      group,
      ping,
      outline: null,
      outlineType: ''
    };
  }

  syncMarkerOutline(node, marker) {
    const nextType = marker.isPlayer ? 'player' : marker.isGhost ? 'ghost' : '';

    if (node.outlineType === nextType) {
      return;
    }

    if (node.outline) {
      node.outline.remove();
      node.outline = null;
    }

    node.outlineType = nextType;

    if (nextType === 'player') {
      node.outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      node.outline.setAttribute('class', 'race-hud__map-player-outline');
      node.outline.setAttribute('d', 'M0 -7 L7 0 L0 7 L-7 0 Z');
      node.group.appendChild(node.outline);
    } else if (nextType === 'ghost') {
      node.outline = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      node.outline.setAttribute('class', 'race-hud__map-ghost-outline');
      node.outline.setAttribute('r', '5.4');
      node.group.appendChild(node.outline);
    }
  }

  updateTrackMap(trackMap) {
    if (!trackMap) {
      if (this.currentTrackMapId !== null || this.mapMarkerNodes.size > 0 || this.mapLegendNodes.size > 0) {
        this.clearTrackMap();
      }
      return;
    }

    if (trackMap.id !== this.currentTrackMapId) {
      this.currentTrackMapId = trackMap.id;
      this.trackLegendSignature = '';
      this.mapPath.setAttribute('d', this.createPathData(trackMap.points));
    }

    const activeKeys = new Set();

    for (const marker of trackMap.markers) {
      const key = marker.key ?? `${marker.isGhost ? 'ghost' : marker.label}`;
      activeKeys.add(key);

      let node = this.mapMarkerNodes.get(key);

      if (!node) {
        node = this.createMarkerNode();
        this.mapMarkerNodes.set(key, node);
        this.mapMarkers.appendChild(node.group);
      }

      const transform = `translate(${(marker.x * 80 + 10).toFixed(2)} ${(marker.y * 80 + 10).toFixed(2)})`;
      if (node.group.getAttribute('transform') !== transform) {
        node.group.setAttribute('transform', transform);
      }

      const pingClass = `race-hud__map-ping ${marker.isLeader ? 'is-leader' : ''} ${marker.isGhost ? 'is-ghost' : ''}`.trim();
      if (node.ping.getAttribute('class') !== pingClass) {
        node.ping.setAttribute('class', pingClass);
      }

      const radius = marker.isPlayer ? '4.6' : marker.isGhost ? '2.8' : '3.2';
      if (node.ping.getAttribute('r') !== radius) {
        node.ping.setAttribute('r', radius);
      }

      if (node.ping.getAttribute('fill') !== marker.color) {
        node.ping.setAttribute('fill', marker.color);
      }

      const opacity = marker.isPlayer ? '1' : marker.isGhost ? '0.55' : '0.86';
      if (node.ping.getAttribute('opacity') !== opacity) {
        node.ping.setAttribute('opacity', opacity);
      }

      this.syncMarkerOutline(node, marker);
      this.mapMarkers.appendChild(node.group);
    }

    for (const [key, node] of this.mapMarkerNodes.entries()) {
      if (!activeKeys.has(key)) {
        node.group.remove();
        this.mapMarkerNodes.delete(key);
      }
    }

    this.updateTrackLegend(trackMap, activeKeys);
  }

  createLegendNode() {
    const row = document.createElement('div');
    const swatch = document.createElement('span');
    const rank = document.createElement('strong');
    const label = document.createElement('span');

    swatch.className = 'race-hud__map-swatch';
    row.append(swatch, rank, label);

    return { row, swatch, rank, label };
  }

  updateTrackLegend(trackMap, activeKeys) {
    const signature = trackMap.markers
      .map((marker) => `${marker.key ?? marker.label}|${marker.position}|${marker.label}|${marker.color}|${marker.isPlayer ? 1 : 0}|${marker.isGhost ? 1 : 0}`)
      .join('||');

    if (signature === this.trackLegendSignature) {
      return;
    }

    this.trackLegendSignature = signature;
    const fragment = document.createDocumentFragment();

    for (const marker of trackMap.markers) {
      const key = marker.key ?? `${marker.isGhost ? 'ghost' : marker.label}`;
      let node = this.mapLegendNodes.get(key);

      if (!node) {
        node = this.createLegendNode();
        this.mapLegendNodes.set(key, node);
      }

      node.row.className = `race-hud__map-legend-row ${marker.isPlayer ? 'is-player' : ''} ${marker.isGhost ? 'is-ghost' : ''}`.trim();
      node.swatch.style.setProperty('--swatch', marker.color);
      this.setText(node.rank, marker.isGhost ? 'GH' : `P${marker.position}`);
      this.setText(node.label, marker.label);
      fragment.appendChild(node.row);
    }

    for (const [key, node] of this.mapLegendNodes.entries()) {
      if (!activeKeys.has(key)) {
        node.row.remove();
        this.mapLegendNodes.delete(key);
      }
    }

    this.mapLegend.replaceChildren(fragment);
  }

  createPathData(points) {
    if (!points || points.length === 0) {
      return '';
    }

    const commands = points.map((point, index) => {
      const x = (point.x * 80 + 10).toFixed(2);
      const y = (point.y * 80 + 10).toFixed(2);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    });

    commands.push('Z');
    return commands.join(' ');
  }

  dispose() {
    this.mobileControlCleanup.forEach((cleanup) => cleanup());
    this.mobileControlCleanup = [];
    this.root.remove();
  }
}

import { CAPTAIN_BOSS } from '../config.js';
import { flatDistance } from '../utils/math.js';

export class CaptainBossSystem {
  constructor({ hud, radio, audio, effects, onSupport, onDefeated }) {
    this.hud = hud;
    this.radio = radio;
    this.audio = audio;
    this.effects = effects;
    this.onSupport = onSupport;
    this.onDefeated = onDefeated;
    this.captain = null;
    this.phase = 'pursuit';
    this.supportTimer = CAPTAIN_BOSS.supportCooldown;
    this.empTimer = CAPTAIN_BOSS.empCooldown;
    this.defeated = false;
  }

  reset() {
    this.captain = null;
    this.phase = 'pursuit';
    this.supportTimer = CAPTAIN_BOSS.supportCooldown;
    this.empTimer = CAPTAIN_BOSS.empCooldown;
    this.defeated = false;
    this.hud.updateBoss?.({ visible: false });
  }

  setCaptain(vehicle) {
    this.captain = vehicle;
    this.phase = 'pursuit';
    this.defeated = false;
    this.supportTimer = CAPTAIN_BOSS.supportCooldown * 0.7;
    this.empTimer = CAPTAIN_BOSS.empCooldown;
    this.hud.showEvent(CAPTAIN_BOSS.phases.pursuit.message);
    this.radio?.push(`${CAPTAIN_BOSS.label} is joining the pursuit.`, 'Command');
    this.audio.playCaptain?.();
    this.effects.empPulse(vehicle.group.position, 1.5);
  }

  update(dt, { player, vehicles }) {
    if (!this.captain || this.captain.destroyed) {
      if (this.captain && !this.defeated) {
        this.defeated = true;
        this.onDefeated?.(this.captain);
      }
      this.hud.updateBoss?.({ visible: false });
      return;
    }
    const ratio = this.captain.health / this.captain.maxHealth;
    const nextPhase = ratio <= CAPTAIN_BOSS.phases.aggressive.maxHealthRatio
      ? 'aggressive'
      : ratio <= CAPTAIN_BOSS.phases.intercept.maxHealthRatio
        ? 'intercept'
        : 'pursuit';
    if (nextPhase !== this.phase) {
      this.phase = nextPhase;
      this.hud.showEvent(CAPTAIN_BOSS.phases[this.phase].message);
      this.audio.playWarning();
    }
    this.supportTimer -= dt;
    this.empTimer -= dt;
    const distance = player ? flatDistance(player.group.position, this.captain.group.position) : Infinity;
    if (this.empTimer <= 0 && player && distance < CAPTAIN_BOSS.warningDistance) {
      player.applyEmp(this.phase === 'aggressive' ? 2.7 : 1.8);
      this.effects.empPulse(player.group.position, 1);
      this.hud.showEvent('Captain EMP burst incoming');
      this.audio.playEmp();
      this.empTimer = this.phase === 'aggressive' ? CAPTAIN_BOSS.empCooldown * 0.68 : CAPTAIN_BOSS.empCooldown;
    }
    if (this.supportTimer <= 0) {
      const activeSupport = vehicles.filter((vehicle) => vehicle.unitKind === 'captainSupport' && !vehicle.destroyed).length;
      if (activeSupport < CAPTAIN_BOSS.maxSupport) this.onSupport?.();
      this.supportTimer = this.phase === 'aggressive' ? CAPTAIN_BOSS.supportCooldown * 0.72 : CAPTAIN_BOSS.supportCooldown;
    }
    this.hud.updateBoss?.({
      visible: true,
      label: CAPTAIN_BOSS.label,
      title: CAPTAIN_BOSS.title,
      phase: this.phase,
      ratio,
      health: this.captain.health,
      maxHealth: this.captain.maxHealth,
    });
  }

  getTargetPosition() {
    return this.captain && !this.captain.destroyed ? this.captain.group.position : null;
  }
}

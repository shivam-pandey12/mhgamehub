export class LoadingSystem {
  private readonly root = document.createElement('div');
  private readonly bar = document.createElement('i');
  private readonly label = document.createElement('p');

  constructor(host: HTMLElement) {
    this.root.className = 'loading-screen is-visible';
    this.root.innerHTML = `
      <div class="loading-screen__panel">
        <span>Preparing rooftop systems</span>
        <h1>Train Roof Rush</h1>
        <div class="loading-screen__track"></div>
      </div>
    `;
    this.root.querySelector('.loading-screen__track')?.appendChild(this.bar);
    this.label.className = 'loading-screen__label';
    this.label.textContent = 'Loading procedural train...';
    this.root.querySelector('.loading-screen__panel')?.appendChild(this.label);
    host.appendChild(this.root);
    this.setProgress(0.08, 'Warming renderer...');
  }

  setProgress(progress: number, label: string): void {
    this.bar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
    this.label.textContent = label;
  }

  async prepare(): Promise<void> {
    const steps = [
      [0.28, 'Building train silhouettes...'],
      [0.48, 'Preparing city speed cues...'],
      [0.68, 'Checking save data...'],
      [0.84, 'Priming controls and HUD...'],
      [1, 'Ready to rush.']
    ] as const;

    for (const [progress, label] of steps) {
      await this.delay(110);
      this.setProgress(progress, label);
    }
  }

  complete(): void {
    this.root.classList.add('is-complete');
    window.setTimeout(() => this.root.remove(), 420);
  }

  showError(error: unknown): void {
    this.root.classList.add('is-error');
    this.setProgress(1, 'Startup issue detected');
    this.label.textContent = error instanceof Error ? error.message : 'Train Roof Rush could not start.';
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}

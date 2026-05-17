export function buildShareText(result = {}) {
  if (result.kind === 'match') {
    return `${result.winner} in Ivory Golf Royale 3D (${result.coursePack}, ${result.courseLength} holes). Final score: ${result.score}.`;
  }
  if (result.kind === 'course') {
    return `I finished ${result.coursePack} ${result.courseLength}-hole course in ${result.score} shots on Ivory Golf Royale 3D. Can you beat it?`;
  }
  return `I scored ${result.shots} shots on ${result.levelName} in Ivory Golf Royale 3D. Can you beat it?`;
}

export function copyShareText(result) {
  const text = buildShareText(result);
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => text);
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  return Promise.resolve(text);
}

export function downloadShareImage(result = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#fffaf0');
  gradient.addColorStop(0.55, '#e8f6ff');
  gradient.addColorStop(1, '#d9c48c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  ctx.fillStyle = 'rgba(255,255,255,0.58)';
  ctx.fillRect(70, 70, 1060, 490);
  ctx.strokeStyle = '#c5a15d';
  ctx.lineWidth = 6;
  ctx.strokeRect(70, 70, 1060, 490);

  ctx.fillStyle = '#5f4314';
  ctx.font = '700 56px Georgia, serif';
  ctx.fillText('Ivory Golf Royale 3D', 115, 165);
  ctx.font = '600 32px Inter, Arial, sans-serif';
  ctx.fillStyle = '#2f6f50';
  ctx.fillText(result.coursePack ?? 'Ivory Garden', 115, 220);

  ctx.fillStyle = '#151820';
  ctx.font = '700 64px Inter, Arial, sans-serif';
  const headline = result.kind === 'match'
    ? (result.winner ?? 'Match Complete')
    : (result.levelName ?? `${result.courseLength ?? 3}-Hole Course`);
  ctx.fillText(headline, 115, 330);

  ctx.font = '500 36px Inter, Arial, sans-serif';
  const detail = result.kind === 'match'
    ? `Final score ${result.score ?? '--'}`
    : result.kind === 'course'
      ? `${result.score ?? '--'} adjusted shots | ${result.stars ?? 0} stars`
      : `${result.shots ?? '--'} shots | Par ${result.par ?? '--'} | ${result.stars ?? 0} stars`;
  ctx.fillText(detail, 115, 395);

  ctx.fillStyle = '#947233';
  ctx.font = '600 28px Inter, Arial, sans-serif';
  ctx.fillText('Premium trick-shot mini golf for GameHub', 115, 500);

  const link = document.createElement('a');
  link.download = `ivory-golf-result-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

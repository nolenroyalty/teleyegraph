export function videoReady(video) {
  return (
    video.readyState >= 3 && !video.paused && (video.src || video.srcObject)
  );
}

export function isBlinking(results) {
  const THRESHOLD = 0.5;

  if (results.faceBlendshapes && results.faceBlendshapes[0]) {
    const categories = results.faceBlendshapes[0].categories;
    const leftBlink = categories[9].score;
    const rightBlink = categories[10].score;
    const value = leftBlink + rightBlink / 2.0;
    return value >= THRESHOLD;
  }
  return false;
}

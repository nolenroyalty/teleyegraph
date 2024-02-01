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

export function decodeMorse(currentDurations) {
  var ref = {
    ".-": "a",
    "-...": "b",
    "-.-.": "c",
    "-..": "d",
    ".": "e",
    "..-.": "f",
    "--.": "g",
    "....": "h",
    "..": "i",
    ".---": "j",
    "-.-": "k",
    ".-..": "l",
    "--": "m",
    "-.": "n",
    "---": "o",
    ".--.": "p",
    "--.-": "q",
    ".-.": "r",
    "...": "s",
    "-": "t",
    "..-": "u",
    "...-": "v",
    ".--": "w",
    "-..-": "x",
    "-.--": "y",
    "--..": "z",
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    "-----": "0",
  };

  if (currentDurations in ref) {
    // return uppercased string
    return ref[currentDurations].toUpperCase();
  } else {
    console.warn(`no match for ${currentDurations}`);
    return null;
  }
}

export function range(start, end, step = 1) {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  const length = Math.max(Math.ceil((end - start) / step), 0);
  const range = Array(length);

  for (let idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}

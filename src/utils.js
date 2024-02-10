import React from "react";

export function videoReady(video) {
  return (
    video &&
    video.readyState >= 3 &&
    !video.paused &&
    (video.src || video.srcObject)
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

export function setToLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage(key, defaultValue) {
  const value = window.localStorage.getItem(key);
  if (value === null) {
    return defaultValue;
  }
  return JSON.parse(value);
}

export const CODES = [
  [".-", "a"],
  ["-...", "b"],
  ["-.-.", "c"],
  ["-..", "d"],
  [".", "e"],
  ["..-.", "f"],
  ["--.", "g"],
  ["....", "h"],
  ["..", "i"],
  [".---", "j"],
  ["-.-", "k"],
  [".-..", "l"],
  ["--", "m"],
  ["-.", "n"],
  ["---", "o"],
  [".--.", "p"],
  ["--.-", "q"],
  [".-.", "r"],
  ["...", "s"],
  ["-", "t"],
  ["..-", "u"],
  ["...-", "v"],
  [".--", "w"],
  ["-..-", "x"],
  ["-.--", "y"],
  ["--..", "z"],
  [".----", "1"],
  ["..---", "2"],
  ["...--", "3"],
  ["....-", "4"],
  [".....", "5"],
  ["-....", "6"],
  ["--...", "7"],
  ["---..", "8"],
  ["----.", "9"],
  ["-----", "0"],
];

export const CODES_BY_SIGNAL = CODES.reduce((acc, [signal, letter]) => {
  acc[signal] = letter;
  return acc;
}, {});

export const SIGNALS_BY_CODE = CODES.reduce((acc, [signal, letter]) => {
  acc[letter] = signal;
  return acc;
}, {});

export function decodeMorse(currentDurations) {
  if (currentDurations in CODES_BY_SIGNAL) {
    // return uppercased string
    return CODES_BY_SIGNAL[currentDurations].toUpperCase();
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

const usePrevious = (value, initialValue) => {
  const ref = React.useRef(initialValue);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useEffectDebugger = (
  effectHook,
  dependencies,
  dependencyNames = []
) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency,
        },
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log("[use-effect-debugger] ", changedDeps);
  }

  React.useEffect(effectHook, dependencies);
};

import React from "react";
import { SoundContext } from "../SoundProvider";
import { SettingsContext } from "../SettingsProvider";

const DEBOUNCE_THRESHOLDS = { fromVideo: 150, fromButton: 0 };
/* This should be an effect lol */

function MorseBeepManager({ eyesClosed }) {
  const playing = React.useRef(false);
  const timeout = React.useRef(null);
  const { sounds } = React.useContext(SoundContext);
  const { speedMult } = React.useContext(SettingsContext);
  const beep = sounds.beep;

  const getDebounce = React.useCallback(() => {
    const fromVideo = eyesClosed.fromVideo
      ? DEBOUNCE_THRESHOLDS.fromVideo
      : 99999;
    const fromButton = eyesClosed.fromButton
      ? DEBOUNCE_THRESHOLDS.fromButton
      : 99999;
    let min = Math.min(fromVideo, fromButton);
    if (speedMult > 1) {
      min = min / speedMult;
    }
    console.log(`getDebounce: ${min}`);
    return min;
  }, [speedMult, eyesClosed]);

  React.useEffect(() => {
    const nowPlaying = eyesClosed.fromVideo || eyesClosed.fromButton;
    if (nowPlaying && playing.current) {
      // already playing
      return;
    } else if (nowPlaying && !playing.current) {
      const debounce = getDebounce();
      timeout.current = setTimeout(() => {
        beep.play();
        playing.current = true;
      }, debounce);
      return () => {
        timeout.current && clearTimeout(timeout.current);
        timeout.current = null;
      };
    } else if (!nowPlaying && playing.current) {
      beep.stop();
      playing.current = false;
    }
  }, [eyesClosed, beep, getDebounce]);
  return <></>;
}

export default MorseBeepManager;

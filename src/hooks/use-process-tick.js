import React from "react";
import { SoundContext } from "../components/SoundProvider";
import { SettingsContext } from "../components/SettingsProvider";

const BASE_TICK_TIME = 750;
const BEST_FPS_GUESS = 60;

function useProcessTick({ videoDisplayed, playSound }) {
  const { sounds } = React.useContext(SoundContext);
  const { metronomeEnabled, speedMult } = React.useContext(SettingsContext);

  const tickTime = BASE_TICK_TIME / speedMult;
  const ticksPerFrame = 1000 / tickTime;
  const TPS = BEST_FPS_GUESS / ticksPerFrame;

  const frameCountIndex = React.useRef(0);
  const signalState = React.useRef({ open: 0, closed: 0, decision: "unknown" });
  const recentFrameCounts = React.useRef([TPS, TPS, TPS, TPS, TPS]);

  React.useEffect(() => {
    function handleTick() {
      if (!videoDisplayed) {
        return;
      }

      if (metronomeEnabled) {
        sounds.tick.play();
      }

      recentFrameCounts.current[frameCountIndex.current] =
        signalState.current.open + signalState.current.closed;
      signalState.current = { open: 0, closed: 0, decision: "unknown" };
      frameCountIndex.current = (frameCountIndex.current + 1) % 5;
    }

    const timerId = setInterval(handleTick, tickTime);
    return () => {
      console.log("Resetting tick handler");
      clearInterval(timerId);
    };
  }, [
    signalState,
    videoDisplayed,
    sounds,
    playSound,
    tickTime,
    metronomeEnabled,
  ]);

  const estimateFps = React.useCallback(() => {
    const averageFrames = recentFrameCounts.current.reduce(
      (sum, count) => sum + count,
      0
    );
    const averageFps = averageFrames / recentFrameCounts.current.length;
    return averageFps;
  }, [recentFrameCounts]);

  return { estimateFps, signalState };
}

export default useProcessTick;

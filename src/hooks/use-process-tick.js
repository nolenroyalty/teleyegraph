import React from "react";
import { SoundContext } from "../components/SoundProvider";

function useProcessTick({ videoDisplayed, playSound }) {
  const TICK_TIME = 1000;
  const BEST_FPS_GUESS = 60;
  const TICKS_PER_FRAME = TICK_TIME / 1000;
  const TPS = BEST_FPS_GUESS / TICKS_PER_FRAME;

  const frameCountIndex = React.useRef(0);
  const signalState = React.useRef({ open: 0, closed: 0, decision: "unknown" });
  const recentFrameCounts = React.useRef([TPS, TPS, TPS, TPS, TPS]);
  const { sounds } = React.useContext(SoundContext);

  React.useEffect(() => {
    function handleTick() {
      if (!videoDisplayed) {
        return;
      }

      sounds.tick.play();

      recentFrameCounts.current[frameCountIndex.current] =
        signalState.current.open + signalState.current.closed;
      signalState.current = { open: 0, closed: 0, decision: "unknown" };
      frameCountIndex.current = (frameCountIndex.current + 1) % 5;
    }

    const timerId = setInterval(handleTick, TICK_TIME);
    return () => clearInterval(timerId);
  }, [signalState, videoDisplayed, sounds, playSound]);

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

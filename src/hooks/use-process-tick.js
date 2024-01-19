import React from "react";

function useProcessTick({ setTickState, videoDisplayed }) {
  const TICK_TIME = 1000;
  const BEST_FPS_GUESS = 60;
  const TICKS_PER_FRAME = TICK_TIME / 1000;
  const TPS = BEST_FPS_GUESS / TICKS_PER_FRAME;

  const frameCountIndex = React.useRef(0);
  const framesThisTick = React.useRef(0);
  const [recentFrameCounts, setRecentFrameCounts] = React.useState([
    TPS,
    TPS,
    TPS,
    TPS,
    TPS,
  ]);

  React.useEffect(() => {
    function handleTick() {
      if (!videoDisplayed) {
        return;
      }
      setRecentFrameCounts((counts) => {
        const newCounts = [...counts];
        newCounts[frameCountIndex.current] = framesThisTick.current;
        // Since this function runs asyncronously, we need to reset the
        // framesThisTick count here - if we reset it after then its value
        // will be 0 here!
        framesThisTick.current = 0;
        return newCounts;
      });

      frameCountIndex.current = (frameCountIndex.current + 1) % 5;
      setTickState({ open: 0, closed: 0 });
    }

    const timerId = setInterval(handleTick, TICK_TIME);
    return () => clearInterval(timerId);
  }, [framesThisTick, setTickState, videoDisplayed]);

  const estimateFps = React.useCallback(() => {
    const averageFrames = recentFrameCounts.reduce(
      (sum, count) => sum + count,
      0
    );
    const averageFps = averageFrames / recentFrameCounts.length;
    return averageFps;
  }, [recentFrameCounts]);

  return { estimateFps, framesThisTick };
}

export default useProcessTick;

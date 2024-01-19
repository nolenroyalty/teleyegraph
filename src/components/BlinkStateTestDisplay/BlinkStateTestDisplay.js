import React from "react";

function BlinkStateTestDisplay({ recentFrameCounts, tickState }) {
  function estimateFps(frameCounts) {
    const averageFrames = frameCounts.reduce((sum, count) => sum + count, 0);
    const averageFps = averageFrames / frameCounts.length;
    return averageFps;
  }

  const estimatedFps = estimateFps(recentFrameCounts);
  const framesThisTick = tickState.open + tickState.closed;
  const neededToCountAsBlink = Math.ceil(estimatedFps / 2);

  let blinkString = "Unknown";
  if (tickState.open >= neededToCountAsBlink) {
    blinkString = "Open";
  } else if (tickState.closed >= neededToCountAsBlink) {
    blinkString = "Closed";
  }

  return (
    <div>
      <p>
        <em>Blink State This Tick:</em> {blinkString}
        <br />
        <em>fps:</em> {estimatedFps}
        <br />
        <em>frames this tick:</em> {framesThisTick}
        <br />
        <em>open:</em> {tickState.open}
        <br />
        <em>closed:</em> {tickState.closed}
        <br />
      </p>
    </div>
  );
}

export default BlinkStateTestDisplay;

import React from "react";

function BlinkStateTestDisplay({ estimateFps, tickState }) {
  const estimatedFps = estimateFps();
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

import React from "react";

function RowDisplay({ label, data }) {
  return (
    <li>
      <em>{label}:</em> {data}
    </li>
  );
}

function BlinkStateTestDisplay({
  estimateFps,
  decisionThisTick,
  currentSignal,
  currentChar,
  currentWord,
  text,
}) {
  return (
    <ul>
      {[
        ["Decision This Tick", decisionThisTick],
        ["Estimated FPS", estimateFps()],
        ["currentSignal", currentSignal.state],
        ["currentChar", currentChar],
        ["currentWord", currentWord],
        ["text", text],
      ].map(([label, data]) => {
        return <RowDisplay key={label} label={label} data={data} />;
      })}
    </ul>
  );
}

export default BlinkStateTestDisplay;

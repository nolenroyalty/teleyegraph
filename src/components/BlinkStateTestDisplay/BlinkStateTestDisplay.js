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
  currentSignal,
  currentChar,
  currentWord,
  text,
}) {
  return (
    <ul>
      {[
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

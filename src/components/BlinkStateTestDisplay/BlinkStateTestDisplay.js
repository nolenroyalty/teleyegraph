import React from "react";

function RowDisplay({ label, data }) {
  return (
    <li>
      <em>{label}:</em> {data}
    </li>
  );
}

const TextDisplay = React.memo(({ text }) => {
  return <p>{text}</p>;
});

function BlinkStateTestDisplay({
  estimateFps,
  currentSignal,
  currentChar,
  currentWord,
  text,
}) {
  return (
    <>
      <ul>
        {[
          ["Estimated FPS", estimateFps()],
          ["currentSignal", currentSignal.state],
          ["currentChar", currentChar],
          ["currentWord", currentWord],
        ].map(([label, data]) => {
          return <RowDisplay key={label} label={label} data={data} />;
        })}
      </ul>
      <TextDisplay text={text} />
    </>
  );
}

export default BlinkStateTestDisplay;

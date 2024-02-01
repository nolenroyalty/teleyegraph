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
      <TextDisplay text={text} />
    </>
  );
}

export default BlinkStateTestDisplay;

import React from "react";
import styled from "styled-components";
import SignalDisplay from "../SignalDisplay";

function CurrentSignalDisplay({ currentSignal }) {
  const ref = React.useRef();
  let first = "none";
  let second = "none";
  let third = "none";
  if (currentSignal.state === "none") {
  } else if (currentSignal.state === "." && currentSignal.count === 1) {
    second = "dot";
  } else if (currentSignal.state === "." && currentSignal.count === 2) {
    first = "dash-left";
    second = "dash-center";
  } else if (currentSignal.state === "-") {
    first = "dash-left";
    second = "dash-center";
    third = "dash-right";
  }

  const width = ref.current?.offsetWidth || 0;
  const height = ref.current?.offsetHeight || 0;
  const targetSize = Math.min(width / 3, height) + "px";

  first = "dash-left";
  second = "dash-center";
  third = "dash-right";

  return (
    <Wrapper ref={ref} style={{ "--target-size": targetSize }}>
      <SignalDisplay state={first} />
      <SignalDisplay state={second} />
      <SignalDisplay state={third} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, var(--target-size));
  grid-template-rows: var(--target-size);
  justify-content: center;
  filter: drop-shadow(6px 5px 5px hsl(0deg 0% 0% / 0.3));
`;

export default CurrentSignalDisplay;

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

  return (
    <Wrapper ref={ref} style={{ "--target-size": targetSize }}>
      <SignalDisplay state={first} />
      <SignalDisplay state={second} />
      <SignalDisplay state={third} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  --padding: max(1vh, 1vw);

  display: grid;
  grid-template-columns: repeat(3, calc(var(--target-size) - var(--padding)));
  grid-template-rows: calc(var(--target-size) - var(--padding));
  justify-content: center;
  align-content: center;
  filter: drop-shadow(6px 5px 5px hsl(0deg 0% 0% / 0.3));
  height: 0px;

  flex: 1 1 75px;
  max-height: min(calc(0.13 * 100vh), 150px);
  min-height: 50px;
`;

export default React.memo(CurrentSignalDisplay);

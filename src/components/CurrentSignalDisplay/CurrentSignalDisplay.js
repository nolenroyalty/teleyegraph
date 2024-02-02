import React from "react";
import styled from "styled-components";
import SignalDisplay from "../SignalDisplay";

function CurrentSignalDisplay({ currentSignal }) {
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

  return (
    <Wrapper>
      <DisplayGrid>
        <SignalDisplay state={first} />
        <SignalDisplay state={second} />
        <SignalDisplay state={third} />
      </DisplayGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-content: center;
`;

const DisplayGrid = styled.div`
  filter: drop-shadow(6px 5px 5px hsl(0deg 0% 0% / 0.3));
  background: none;

  grid-template-columns: repeat(3, 1fr);
  display: grid;
  justify-content: center;
  align-items: center;

  aspect-ratio: 3/1;
  max-height: 100%;
  width: min(400px, calc((100vw - 64px)));
`;

export default CurrentSignalDisplay;

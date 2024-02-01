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
  first = "dash-left";
  second = "dash-center";
  third = "dash-right";

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
  padding: 40px 0px;

  display: grid;
  place-items: center;
`;

const DisplayGrid = styled.div`
  filter: drop-shadow(6px 5px 5px hsl(0deg 0% 0% / 0.3));
  width: 75%;
  grid-template-columns: repeat(3, 1fr);
  aspect-ratio: 3/1;
  display: grid;
  justify-content: center;
  align-items: center;
`;

export default CurrentSignalDisplay;

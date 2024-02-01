import React from "react";
import styled from "styled-components";
import SignalDisplay from "../SignalDisplay";
import { COLORS } from "../../constants";

function CurrentCharacterDisplay({ currentChar, fadeCount }) {
  const arr = [];
  let color = COLORS["black"];
  if (fadeCount === 1) {
    color = COLORS["grey-20"];
  } else if (fadeCount > 1) {
    color = COLORS["grey-30"];
  }

  const addSignal = (state) => {
    arr.push(<SignalDisplay key={arr.length} state={state} color={color} />);
  };

  for (const c of currentChar) {
    if (c === ".") {
      addSignal("dot");
    } else if (c === "-") {
      ["dash-left", "dash-center", "dash-right"].forEach(addSignal);
    } else {
      console.warn(`UNKNOWN CHAR ${c}`);
    }
  }
  while (arr.length < 15) {
    addSignal("none");
  }

  return <Wrapper>{arr}</Wrapper>;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  grid-template-rows: 33% 67%;
  aspect-ratio: 15/3;
  background: slategrey;
`;

export default React.memo(CurrentCharacterDisplay);

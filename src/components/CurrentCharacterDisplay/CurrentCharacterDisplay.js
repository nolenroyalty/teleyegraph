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
      console.warn(`UNKNOWN CHAR`);
      console.log({ c });
    }
  }
  while (arr.length < 15) {
    addSignal("none");
  }

  return <Wrapper>{arr}</Wrapper>;
}

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  filter: drop-shadow(4px 5px 5px hsl(0deg 0% 0% / 0.35));
  grid-template-columns: repeat(15, 1fr);
  gap: 2px;
  width: 100%;

  flex: 1 1 75px;
  min-height: 50px;
`;

export default React.memo(CurrentCharacterDisplay);

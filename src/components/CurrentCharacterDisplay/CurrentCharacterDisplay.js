import React from "react";
import styled from "styled-components";
import SignalDisplay from "../SignalDisplay";

function CurrentCharacterDisplay({ currentChar }) {
  const arr = [];
  let count = 0;
  for (const c of currentChar) {
    if (c === ".") {
      arr.push(<SignalDisplay key={count} state={"dot"} />);
      count += 1;
    } else if (c === "-") {
      arr.push(<SignalDisplay key={count} state={"dash-left"} />);
      count += 1;
      arr.push(<SignalDisplay key={count} state={"dash-center"} />);
      count += 1;
      arr.push(<SignalDisplay key={count} state={"dash-right"} />);
      count += 1;
    } else {
      console.warn(`UNKNOWN CHAR ${c}`);
    }
  }
  while (arr.length < 15) {
    arr.push(<SignalDisplay key={count} state={"none"} />);
    count += 1;
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

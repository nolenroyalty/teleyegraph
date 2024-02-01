import React from "react";
import styled from "styled-components";
import { DITS_TO_ADD_CHARACTER } from "../../constants";

function CurrentWordDisplay({ currentWord, candidateChar }) {
  const calculateOpacity = (count) => {
    return Math.min(1, count / DITS_TO_ADD_CHARACTER);
  };

  return (
    <Wrapper>
      {currentWord}
      <Candidate style={{ "--opacity": calculateOpacity(candidateChar.count) }}>
        {candidateChar.char}
      </Candidate>
    </Wrapper>
  );
}

const Candidate = styled.span`
  opacity: var(--opacity);
  will-change: opacity;
  transition: opacity 200ms ease;
`;

const Wrapper = styled.p`
  font-size: 2em;
  min-height: 2em;
  background: slateblue;
`;

export default CurrentWordDisplay;

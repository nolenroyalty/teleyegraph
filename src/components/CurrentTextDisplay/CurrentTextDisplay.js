import React from "react";
import styled from "styled-components";
import { DITS_TO_ADD_CHARACTER, DITS_TO_ADD_WORD } from "../../constants";

function CurrentTextDisplay({ text, candidateWord }) {
  const calculateOpacity = (count) => {
    const level = Math.max(0, count - DITS_TO_ADD_CHARACTER + 1);
    const max = DITS_TO_ADD_WORD - DITS_TO_ADD_CHARACTER;
    return Math.min(1, level / max);
  };

  return (
    <Wrapper>
      {text}
      <Candidate style={{ "--opacity": calculateOpacity(candidateWord.count) }}>
        {candidateWord.word}
      </Candidate>
    </Wrapper>
  );
}

const Candidate = styled.span`
  opacity: var(--opacity);
  will-change: opacity;
  transition: opacity 500ms ease;
`;

const Wrapper = styled.p`
  font-size: 1.5em;
  background: lightpink;
  min-height: 1em;
`;

export default CurrentTextDisplay;

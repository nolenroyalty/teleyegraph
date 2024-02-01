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
      LOREM IPSUM IS SOME HELPER TEXT MAN
      <Candidate
        style={{ "--opacity": calculateOpacity(candidateWord.count) + 0.1 }}
      >
        {candidateWord.word} CANDIDATE
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
  padding: 10px 8px;

  /*
    100% - width of above grid
    15 - cells in grid
    .75 - scale of a circle
    .5 - divide by two to get radius
    .5 - divide by two because of padding on each side
    1px - optical alignment.
  */
  padding: 10px calc((100% / 15) * 0.75 * 0.5 * 0.5 - 1px);
`;

export default CurrentTextDisplay;

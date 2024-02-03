import React from "react";
import styled from "styled-components";
import {
  COLORS,
  DITS_TO_ADD_CHARACTER,
  DITS_TO_ADD_WORD,
} from "../../constants";

function CurrentWordDisplay({ currentWord, candidateChar, fadeCount }) {
  const calculateCandidateOpacity = (count) => {
    const val = Math.min(1, count / DITS_TO_ADD_CHARACTER);
    return val === 0 ? 0 : val + 0.1;
  };

  const calculateSelfOpacity = (count) => {
    if (fadeCount < DITS_TO_ADD_CHARACTER) {
      return 1;
    }

    return (
      1 -
      (fadeCount - DITS_TO_ADD_CHARACTER) /
        (DITS_TO_ADD_WORD - DITS_TO_ADD_CHARACTER)
    );
  };

  return (
    <Wrapper style={{ "--opacity": calculateSelfOpacity(fadeCount) }}>
      {currentWord}
      <Candidate
        style={{
          "--opacity": calculateCandidateOpacity(candidateChar.count),
        }}
      >
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
  /*
    100% - width of above grid
    15 - cells in grid
    .75 - scale of a circle
    .5 - divide by two to get radius
    .5 - divide by two because of padding on each side
    2px - optical alignment.
  */
  padding: 0 calc((100% / 15) * 0.75 * 0.5 * 0.5 - 2px);
  opacity: var(--opacity);
  will-change: color, opacity;
  transition:
    color 200ms ease,
    opacity 200ms ease;
  font-size: 2em;
  /* min-height: 2em; */
`;

export default React.memo(CurrentWordDisplay);

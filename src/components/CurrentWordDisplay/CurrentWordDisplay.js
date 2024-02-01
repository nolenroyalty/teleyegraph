import React from "react";
import styled from "styled-components";
import {
  COLORS,
  DITS_TO_ADD_CHARACTER,
  DITS_TO_ADD_WORD,
} from "../../constants";

function CurrentWordDisplay({ currentWord, candidateChar, fadeCount }) {
  const calculateCandidateOpacity = (count) => {
    return Math.min(1, count / DITS_TO_ADD_CHARACTER);
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

  // let color = COLORS.black;
  // if (fadeCount === DITS_TO_ADD_WORD - 1) {
  //   color = COLORS["grey-40"];
  // } else if (fadeCount === DITS_TO_ADD_WORD - 2) {
  //   color = COLORS["grey-30"];
  // } else if (fadeCount === DITS_TO_ADD_WORD - 3) {
  //   color = COLORS["grey-20"];
  // }

  return (
    <Wrapper style={{ "--opacity": calculateSelfOpacity(fadeCount) }}>
      {currentWord}
      <Candidate
        style={{ "--opacity": calculateCandidateOpacity(candidateChar.count) }}
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
  /* color: var(--color); */
  opacity: var(--opacity);
  will-change: color, opacity;
  transition:
    color 200ms ease,
    opacity 200ms ease;
  font-size: 2em;
  min-height: 2em;
  background: slateblue;
`;

export default CurrentWordDisplay;

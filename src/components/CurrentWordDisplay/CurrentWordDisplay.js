import React from "react";
import styled from "styled-components";
import {
  COLORS,
  DITS_TO_ADD_CHARACTER,
  DITS_TO_ADD_WORD,
} from "../../constants";

function CurrentWordDisplay({ currentWord, candidateChar, signalCounts }) {
  const offCount = signalCounts.off;
  const candidateOpacity =
    offCount === 0 ? 0 : 0.1 + offCount / DITS_TO_ADD_CHARACTER;

  const calculateSelfOpacity = () => {
    if (offCount < DITS_TO_ADD_CHARACTER) {
      return 1;
    }

    return (
      1 -
      (offCount - DITS_TO_ADD_CHARACTER) /
        (DITS_TO_ADD_WORD - DITS_TO_ADD_CHARACTER)
    );
  };

  return (
    <>
      <Wrapper style={{ "--opacity": calculateSelfOpacity() }}>
        {currentWord}
        <Candidate
          style={{
            "--opacity": candidateOpacity,
          }}
        >
          {candidateChar}
        </Candidate>
      </Wrapper>
    </>
  );
}

const Candidate = styled.span`
  opacity: var(--opacity);
  will-change: opacity;
  transition: opacity 200ms ease;
`;

const Wrapper = styled.span`
  padding: 0 6px;
  opacity: var(--opacity);
  will-change: color, opacity;
  transition:
    color 200ms ease,
    opacity 200ms ease;
  --font-size: 1.5rem;
  @media (max-width: 600px) {
    padding: 0 2px;
    --font-size: 1.25rem;
  }
  font-size: var(--font-size);
  min-height: calc(1.5 * var(--font-size));
`;

export default React.memo(CurrentWordDisplay);

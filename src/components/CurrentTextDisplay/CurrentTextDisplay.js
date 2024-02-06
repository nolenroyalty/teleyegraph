import React from "react";
import styled from "styled-components";
import { DITS_TO_ADD_CHARACTER, DITS_TO_ADD_WORD } from "../../constants";

function CurrentTextDisplay({ text, candidateWord, signalCounts }) {
  const containerRef = React.useRef();
  const candidateRef = React.useRef();

  const calculateOpacity = () => {
    const count = signalCounts.off;
    const level = Math.max(0, count - DITS_TO_ADD_CHARACTER + 1);
    const max = DITS_TO_ADD_WORD - DITS_TO_ADD_CHARACTER;
    const val = Math.min(1, level / max);
    return val === 0 ? 0 : val + 0.1;
  };

  React.useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      if (
        scrollHeight > clientHeight &&
        containerRef.current.scrollTop !== scrollHeight
      ) {
        console.log({
          scrollHeight,
          clientHeight,
          scrollTop: containerRef.current.scrollTop,
        });
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  }, [text, candidateWord.word]);

  return (
    <Wrapper ref={containerRef}>
      {text}
      <Candidate
        ref={candidateRef}
        style={{ "--opacity": calculateOpacity(candidateWord.count) }}
      >
        {candidateWord}
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
  --font-size: 1.25rem;
  @media (max-width: 600px) {
    --font-size: 1rem;
  }
  font-size: var(--font-size);
  scroll-behavior: smooth;

  padding: 0px 2px;
  overflow: auto;
  --three-lines: calc(3 * 1.5 * var(--font-size));
  min-height: var(--three-lines);
  flex: 0 0 var(--three-lines);
`;

export default React.memo(CurrentTextDisplay);

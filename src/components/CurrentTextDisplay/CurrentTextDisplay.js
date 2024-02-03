import React from "react";
import styled from "styled-components";
import { DITS_TO_ADD_CHARACTER, DITS_TO_ADD_WORD } from "../../constants";

function CurrentTextDisplay({ text, candidateWord }) {
  const containerRef = React.useRef();
  const candidateRef = React.useRef();

  const calculateOpacity = (count) => {
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
  padding: 10px 8px;
  scroll-behavior: smooth;

  /*
    100% - width of above grid
    15 - cells in grid
    .75 - scale of a circle
    .5 - divide by two to get radius
    .5 - divide by two because of padding on each side
    1px - optical alignment.
  */
  padding: 10px calc((100% / 15) * 0.75 * 0.5 * 0.5 - 1px);
  overflow: auto;
`;

export default React.memo(CurrentTextDisplay);

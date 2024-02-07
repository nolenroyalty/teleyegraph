import React from "react";

import Main from "../Main";
import styled from "styled-components";
import SoundProvider from "../SoundProvider";
import MuteIcon from "../MuteIcon";
import Header from "../Header";

function App() {
  return (
    <SoundProvider>
      <MuteIcon />
      <MaxWidthWrapper>
        <Header />
        <Main />
      </MaxWidthWrapper>
    </SoundProvider>
  );
}

const MaxWidthWrapper = styled.div`
  --max-width: 800px;
  --padding: 2rem;
  --max-inner-width: calc(var(--max-width) - var(--padding) * 2);
  max-width: var(--max-width);
  width: min(100vw, var(--max-width));
  height: 100%;
  padding: calc(var(--padding) / 4) var(--padding) calc(var(--padding) / 2);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  /*
    take the max inner width, divide by the aspect ratio, and add 1 rem
    for a little padding
  */
  --max-video-height: calc(var(--max-inner-width) * 9 / 16 + 1rem);
`;

export default App;

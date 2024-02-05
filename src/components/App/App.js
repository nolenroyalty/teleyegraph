import React from "react";

import Main from "../Main";
import styled from "styled-components";
import SoundProvider from "../SoundProvider";

function App() {
  return (
    <SoundProvider>
      <MaxWidthWrapper>
        <HeaderAux />
        <Main />
      </MaxWidthWrapper>
    </SoundProvider>
  );
}

const HeaderAux = React.memo(() => {
  return (
    <Header>
      <Title>
        Tel<ShadowSpan>👁️</ShadowSpan>graph
      </Title>
    </Header>
  );
});

const Header = styled.header`
  text-align: center;
  flex: 0 0 auto;
  letter-spacing: 4px;
`;

const Title = styled.h1`
  font-family: "Jacques Francois Shadow", cursive;
  --font-size: clamp(2.2rem, min(5vw, 5vh) + 1rem, 4.2rem);
  font-size: var(--font-size);
  line-height: 1;
  text-transform: uppercase;
  padding: 0;
  padding-bottom: 0.25em;
  color: var(--color-grey-20);
  // never wrap
  white-space: nowrap;
`;

const ShadowSpan = styled.span`
  filter: drop-shadow(4px 4px 4px hsl(0deg 0% 0% / 0.75));
  margin: 0 -6px;
`;

const MaxWidthWrapper = styled.div`
  --max-width: 800px;
  --padding: 2rem;
  --max-inner-width: calc(var(--max-width) - var(--padding) * 2);
  max-width: var(--max-width);
  width: min(100vw, var(--max-width));
  height: 100%;
  padding: calc(var(--padding) / 2) var(--padding);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  /*
    take the max inner width, divide by the aspect ratio, and add 1 rem
    for a little padding
  */
  --max-video-height: calc(var(--max-inner-width) * 9 / 16 + 1rem);
`;

export default App;

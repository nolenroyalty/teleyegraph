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
`;

const Title = React.memo(
  styled.h1`
    font-family: "Jacques Francois Shadow", cursive;
    font-size: clamp(2.2rem, 5vw + 1rem, 4.2rem);
    line-height: 4.5rem;
    text-transform: uppercase;
    padding: 0;
    color: var(--color-grey-20);
    // never wrap
    white-space: nowrap;
  `,
  []
);

const ShadowSpan = styled.span`
  filter: drop-shadow(4px 4px 4px hsl(0deg 0% 0% / 0.75));
`;

const MaxWidthWrapper = styled.div`
  --max-width: 800px;
  --padding: 2rem;
  --max-inner-width: calc(var(--max-width) - var(--padding) * 2);
  max-width: var(--max-width);
  width: min(100vw, var(--max-width));
  height: 100%;
  padding: var(--padding);
  margin: 0 auto;
  display: grid;
  gap: calc(8px + 1vh);
  align-content: space-between;

  /*
    take the max inner width, divide by the aspect ratio, and add 1 rem
    for a little padding
  */
  --max-video-height: calc(var(--max-inner-width) * 9 / 16 + 1rem);

  grid-template-rows:
    [header] 4.5rem [video] minmax(150px, var(--max-video-height))
    [mainsignal] minmax(75px, 200px)
    [charsignal] 3rem [word] 2.5em [text] 7.5em [button] 100px;

  grid-template-columns: min(100vw - 4em, 800px - 4em);
`;

export default App;

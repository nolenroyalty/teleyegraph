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
        <SubHead>
          <SubHeadItem>Office of Origin:</SubHeadItem>
          <SubHeadItem>
            <SiteLink href="https://eieio.games">
              eieio game<NoSpacing>s</NoSpacing>
            </SiteLink>
          </SubHeadItem>
        </SubHead>
      </Title>
    </Header>
  );
});

const Header = styled.header`
  flex: 0 0 auto;
  padding-bottom: 0.25em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  display: inline-block;
  text-align: center;
  letter-spacing: 4px;
  font-family: "Jacques Francois Shadow", cursive;
  --font-size: clamp(2.2rem, min(5vw, 5vh) + 1rem, 4.2rem);
  font-size: var(--font-size);
  line-height: 1;
  text-transform: uppercase;
  padding: 0;
  color: var(--color-grey-20);
  // never wrap
  white-space: nowrap;
  width: min-content;
`;

const ShadowSpan = styled.span`
  filter: drop-shadow(4px 4px 4px hsl(0deg 0% 0% / 0.75));
  margin: 0 -6px;
`;

const SubHead = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 4px 4px 0 2px;
`;

const SubHeadItem = styled.h2`
  letter-spacing: 4px;
  white-space: nowrap;
  font-size: clamp(0.5rem, calc(0.5rem + 1vw), 1.125rem);
  font-family: "JMH Typewriter", sans-serif;
`;

const SiteLink = styled.a`
  color: var(--color-grey-20);
  text-decoration: underline;
  //move underline down
  text-underline-offset: 0.1em;
  //thicker underline
  text-decoration-thickness: 0.1em;
  // dashed underline
  text-decoration-skip-ink: none;
`;

const NoSpacing = styled.span`
  letter-spacing: 0;
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

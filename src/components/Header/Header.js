import React from "react";
import styled from "styled-components";

function Header() {
  return (
    <Wrapper>
      <Title>
        Tel<ShadowSpan>👁️</ShadowSpan>grap<NoSpacing>h</NoSpacing>
        <SubHead>
          <SubHeadItem>Office of Origin:</SubHeadItem>
          <SubHeadItem>
            <SiteLink href="https://eieio.games">
              eieio game<NoSpacing>s</NoSpacing>
            </SiteLink>
          </SubHeadItem>
        </SubHead>
      </Title>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  flex: 0 0 auto;
  padding-bottom: 0.25em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  display: inline-block;
  text-align: center;
  letter-spacing: 16px;
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

  @media (max-width: 800px) {
    letter-spacing: 8px;
  }
`;

const ShadowSpan = styled.span`
  filter: drop-shadow(4px 4px 4px hsl(0deg 0% 0% / 0.75));
  margin: 0 2px 0 -4px;
`;

const SubHead = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 4px 0px 0 2px;
`;

const SubHeadItem = styled.h2`
  letter-spacing: 4px;
  white-space: nowrap;
  font-size: 1rem;

  @media (max-width: 600px) {
    font-size: 0.875rem;
    letter-spacing: 2px;
  }

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

export default React.memo(Header);

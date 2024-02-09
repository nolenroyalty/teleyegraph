import React from "react";
import styled from "styled-components";
import { CODES } from "../../utils";
import { SettingsContext } from "../SettingsProvider";

function MorseDisplay() {
  const { forceShowMorseDisplay } = React.useContext(SettingsContext);
  const translateOverride = forceShowMorseDisplay ? "translateX(0)" : undefined;
  return (
    <Wrapper style={{ "--translate-override": translateOverride }}>
      {CODES.map(([code, letter]) => (
        <p key={code}>
          <LetterAndCode>
            <span>{letter}</span> <span>{code}</span>
          </LetterAndCode>
        </p>
      ))}
    </Wrapper>
  );
}

const LetterAndCode = styled.div`
  display: flex;
  justify-content: start;
  gap: 20px;
`;

const Wrapper = styled.div`
  display: grid;
  position: fixed;
  gap: 5px 5px;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: min-content;
  transition: transform 0.3s ease;
  --translate-amount: 0%;
  @media (max-width: 1100px) {
    --translate-amount: 150%;
  }
  @media (max-height: 600px) {
    --translate-amount: 150%;
  }
  will-change: transform;
  transform: translateX(var(--translate-override, var(--translate-amount)));
  width: min-content;
  grid-template-columns: repeat(2, 75px);
`;

export default MorseDisplay;

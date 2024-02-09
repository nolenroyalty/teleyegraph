import React from "react";
import styled from "styled-components";
import MuteIcon from "../MuteIcon";
import AdvancedSettingsButton from "../AdvancedSettingsButton";

function SettingsBar() {
  return (
    <>
      <Wrapper>
        <AdvancedSettingsButton />
        <Spacer />
        <MuteIcon />
      </Wrapper>
    </>
  );
}

/* AdvancedSettingsButtons adds another div to the
wrapper when it's clicked, so we do this instead of setting
gap (which would cause our spacing to get funny when the other
  element is added) */
const Spacer = styled.span`
  width: 20px;

  @media (max-width: 600px) {
    display: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 600px) {
    justify-content: space-between;
    right: 20px;
  }

  position: fixed;
  bottom: 20px;
  left: 20px;

  pointer-events: none;
`;

export default SettingsBar;

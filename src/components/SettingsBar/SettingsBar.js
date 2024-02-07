import React from "react";
import styled from "styled-components";
import MuteIcon from "../MuteIcon";
import AdvancedSettingsButton from "../AdvancedSettingsButton";

function SettingsBar() {
  return (
    <>
      <Wrapper>
        <AdvancedSettingsButton />
        <MuteIcon />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  pointer-events: none;
`;

export default SettingsBar;

import React from "react";
import styled from "styled-components";
import MuteIcon from "../MuteIcon";
import AdvancedSettingsButton from "../AdvancedSettingsButton";
import AdvancedSettingsDisplay from "../AdvancedSettingsDisplay";

function SettingsBar() {
  const [displayAdvancedSettings, setDisplayAdvancedSettings] =
    React.useState(false);
  return (
    <>
      {/* {displayAdvancedSettings && (
        <AdvancedSettingsDisplay
          closeDisplay={() => setDisplayAdvancedSettings(false)}
        />
      )} */}
      <Wrapper>
        <AdvancedSettingsButton
          setDisplayAdvancedSettings={setDisplayAdvancedSettings}
        />
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

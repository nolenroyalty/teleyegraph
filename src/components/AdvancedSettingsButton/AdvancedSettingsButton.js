import React from "react";
import SettingsButton from "../SettingsButton";
import Icon from "../Icon";

function AdvancedSettingsButton({ setDisplayAdvancedSettings }) {
  return (
    <SettingsButton
      onClick={(e) => {
        setDisplayAdvancedSettings((s) => !s);
      }}
    >
      <Icon name="settings" />
    </SettingsButton>
  );
}

export default AdvancedSettingsButton;

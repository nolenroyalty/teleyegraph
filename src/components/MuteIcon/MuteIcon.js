import React from "react";
import Icon from "../Icon";
import SettingsButton from "../SettingsButton";

import { SoundContext } from "../SoundProvider";

function MuteIcon() {
  const { muted, setMuted } = React.useContext(SoundContext);
  return (
    <SettingsButton onClick={() => setMuted((muted) => !muted)}>
      <Icon name={muted ? "volume-off" : "volume-on"} />
    </SettingsButton>
  );
}

export default MuteIcon;

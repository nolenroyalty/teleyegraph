import React from "react";
import { VolumeX, Volume2, Settings } from "react-feather";

const ICONS = {
  "volume-off": VolumeX,
  "volume-on": Volume2,
  settings: Settings,
};

function Icon({ name }) {
  const IconComponent = ICONS[name];
  if (!IconComponent) {
    throw new Error(`Icon ${name} not found`);
  }
  return <IconComponent size={36} strokeWidth={2} />;
}

export default Icon;

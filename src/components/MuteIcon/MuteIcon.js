import React from "react";
import { VolumeX, Volume2 } from "react-feather";
import styled from "styled-components";

import { SoundContext } from "../SoundProvider";

function MuteIcon() {
  const { muted, setMuted } = React.useContext(SoundContext);

  return (
    <Button onClick={() => setMuted((muted) => !muted)}>
      {muted ? (
        <VolumeX size={36} strokeWidth={2} />
      ) : (
        <Volume2 size={36} strokeWidth={2} />
      )}
    </Button>
  );
}

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  color: hsl(0deg 0% 10% / 0.7);

  position: fixed;
  top: 15px;
  right: 15px;

  @media (max-width: 600px) {
    top: initial;
    bottom: 20px;
    right: 10px;
  }
`;

export default MuteIcon;

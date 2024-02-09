import React from "react";
import styled from "styled-components";
import * as Switch from "@radix-ui/react-switch";
import { COLORS } from "../../constants";
import SettingsLabel from "../SettingsLabel";

function SettingsSwitch({ label, htmlFor, enabled, setEnabled }) {
  return (
    <>
      <SettingsLabel htmlFor={htmlFor}>{label}</SettingsLabel>
      <SwitchWrapper>
        <SwitchRoot
          id={htmlFor}
          checked={enabled}
          onCheckedChange={(checked) => setEnabled(checked)}
        >
          <SwitchThumb />
        </SwitchRoot>
      </SwitchWrapper>
    </>
  );
}

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;

const SwitchRoot = styled(Switch.Root)`
  width: 42px;
  height: 25px;
  border-radius: 99999px;
  padding: 0;
  border: none;
  position: relative;
  box-shadow: 0 2px 4px hsl(0deg 0% 0% / 0.2);
  background-color: ${COLORS["grey-30"]};
  -webkit-tap-highlight-color: transparent;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px hsl(0deg 0% 50% / 0.9);
  }

  &[data-state="checked"] {
    background-color: ${COLORS["black"]};
  }
`;

const SwitchThumb = styled(Switch.Thumb)`
  display: block;
  width: 21px;
  height: 21px;
  transition: transform 100ms;
  transform: translateX(2px);
  will-change: transform;
  background-color: white;
  border-radius: 9999px;

  &[data-state="checked"] {
    transform: translateX(19px);
  }
`;

export default SettingsSwitch;

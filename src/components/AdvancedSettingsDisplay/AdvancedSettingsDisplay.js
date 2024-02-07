import React from "react";
import styled from "styled-components";
import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";
import { COLORS } from "../../constants";

function AdvancedSettingsDisplay({ closeDisplay }) {
  const [metronomeEnabled, setMetronomeEnabled] = React.useState(true);
  const [speedMult, setSpeedMult] = React.useState(1);

  return (
    <Wrapper>
      <MetronomeEnabled
        metronomeEnabled={metronomeEnabled}
        setMetronomeEnabled={setMetronomeEnabled}
      />
      <SpeedSlider speedMult={speedMult} setSpeedMult={setSpeedMult} />
      <SettingsButton
        onClick={(e) => {
          setMetronomeEnabled(true);
          setSpeedMult(1);
        }}
      >
        Reset
      </SettingsButton>
      <SettingsButton
        style={{ "--justify-self": "end" }}
        onClick={(e) => {
          closeDisplay();
        }}
      >
        Close
      </SettingsButton>
    </Wrapper>
  );
}

const SettingsButton = styled.button`
  padding: 5px 10px;
  border: none;
  outline: none;
  font-size: 1.25em;
  align-self: end;
  justify-self: var(--justify-self, start);
  border-radius: 10px;
  background: #160b0578;
  color: ${COLORS["white"]};
`;

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  min-width: 250px;
  bottom: 75px;
  background: hsl(0deg 0% 80% / 0.5);
  border-radius: 0px 10px 10px 0px;
  padding: 20px;

  display: grid;
  gap: 8px 16px;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto 150px;
  align-content: start;
  backdrop-filter: blur(4px) invert(0.2);
`;

function SpeedSlider({ speedMult, setSpeedMult }) {
  return (
    <>
      <SettingLabel htmlFor="speed-slider">Speed</SettingLabel>
      <SliderRoot
        id="speed-slider"
        value={[speedMult]}
        onValueChange={([value]) => setSpeedMult(value)}
        defaultValue={1}
        min={0.25}
        max={4}
        step={0.1}
      >
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb />
      </SliderRoot>
    </>
  );
}

const SliderRoot = styled(Slider.Root)`
  position: relative;
  display: flex;
  width: 200px;
  align-items: center;
  user-select: none;
  touch-action: none;
`;

const SliderTrack = styled(Slider.Track)`
  background-color: ${COLORS["grey-30"]};
  position: relative;
  flex-grow: 1;
  height: 3px;
  border-radius: 9999px;
`;

const SliderRange = styled(Slider.Range)`
  position: absolute;
  background-color: ${COLORS["white"]};
  height: 100%;
  border-radius: 9999px;
`;

const SliderThumb = styled(Slider.Thumb)`
  display: block;
  width: 20px;
  height: 20px;
  background-color: ${COLORS["white"]};
  border-radius: 9999px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px black;
  }
`;

function MetronomeEnabled({ metronomeEnabled, setMetronomeEnabled }) {
  return (
    <>
      <SettingLabel htmlFor="metronome-enabled">Metronome</SettingLabel>
      <SwitchWrapper>
        <SwitchRoot
          id="metronome-enabled"
          checked={metronomeEnabled}
          onCheckedChange={(checked) => setMetronomeEnabled(checked)}
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

const SettingLabel = styled.label`
  font-size: 1.25em;
  display: flex;
  align-items: center;
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
    box-shadow: 0 0 0 2px black;
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

export default AdvancedSettingsDisplay;

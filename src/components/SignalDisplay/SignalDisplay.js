import React from "react";
import styled, { keyframes } from "styled-components";
import { COLORS } from "../../constants";
import { SettingsContext } from "../SettingsProvider";
const BASE_TRANSITION_SPEED = 400;

function SignalDisplay({ state, color = COLORS["black"] }) {
  const style = { "--opacity": 1, "--color": color };
  const { speedMult } = React.useContext(SettingsContext);

  const transitionSpeed = Math.max(
    200,
    speedMult <= 1 ? BASE_TRANSITION_SPEED : BASE_TRANSITION_SPEED / speedMult
  );

  style["--transition-speed"] = `${transitionSpeed}ms`;

  if (state === "dot") {
    style["--border-radius"] = "50%";
    style["--scale"] = "1";
  } else if (state === "none") {
    style["--opacity"] = "0";
    style["--scale"] = "0, 0";
    style["--border-radius"] = "25%";
  } else {
    style["--scale"] = "1";

    if (state === "dash-left") {
      style["--border-radius"] = "50% 0 0 50%";
    } else if (state === "dash-center") {
      style["--border-radius"] = "0";
      // Without this we sometimes get a tiny gap between the center and the left or right
      style["--scale"] = "1.35, 1";
    } else if (state === "dash-right") {
      style["--border-radius"] = "0 50% 50% 0";
    }
  }

  return <Signal style={style} />;
}

const Signal = styled.span`
  display: block;
  width: 100%;

  aspect-ratio: 1/1;
  transform: scale(var(--scale, 1)) translateX(var(--translate-x, 0));
  background-color: var(--color);

  will-change: border-radius, transform, opacity, background-color;

  transition:
    border-radius var(--transition-speed) ease-out,
    transform var(--transition-speed) ease,
    opacity var(--transition-speed) ease,
    background-color var(--transition-speed) ease;

  opacity: var(--opacity);
  border-radius: var(--border-radius);
`;

export default SignalDisplay;

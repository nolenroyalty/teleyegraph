import React from "react";
import styled, { keyframes } from "styled-components";

function SignalDisplay({ state }) {
  const style = { "--opacity": 1 };
  if (state === "dot") {
    style["--border-radius"] = "50%";
    style["--height"] = "100%";
    style["--scale"] = "0.75, 0.75";
  } else if (state === "none") {
    style["--opacity"] = "0";
    style["--scale"] = "0, 0";
    style["--border-radius"] = "25%";
  } else {
    // TODO can this be a transform??
    style["--height"] = "50%";
    style["--scale"] = "1, 1";

    if (state === "dash-left") {
      style["--border-radius"] = "50% 0 0 50%";
    } else if (state === "dash-center") {
      style["--border-radius"] = "0";
    } else if (state === "dash-right") {
      style["--border-radius"] = "0 50% 50% 0";
    }
  }

  return <Signal style={style} />;
}

const Signal = styled.span`
  display: block;
  width: 100%;
  height: 100%;
  transform: scale(var(--scale, 1));
  background-color: var(--signal-color);

  will-change: border-radius, transform, opacity;

  transition:
    border-radius 500ms ease-out,
    transform 500ms ease,
    height 500ms ease,
    opacity 500ms ease;

  opacity: var(--opacity);
  border-radius: var(--border-radius);
`;

export default SignalDisplay;
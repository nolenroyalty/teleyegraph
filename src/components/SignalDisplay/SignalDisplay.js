import React from "react";
import styled, { keyframes } from "styled-components";

function SignalDisplay({ state }) {
  const style = { "--opacity": 1 };
  if (state === "dot") {
    style["--border-radius"] = "50%";
    style["--height"] = "100%";
  } else if (state === "none") {
    style["--opacity"] = "0";
  } else {
    // TODO can this be a transform??
    style["--height"] = "50%";

    if (state === "dash-left") {
      style["--border-radius"] = "50px 0 0 50px";
    } else if (state === "dash-center") {
      style["--border-radius"] = "0";
    } else if (state === "dash-right") {
      style["--border-radius"] = "0 50px 50px 0";
    }
  }

  return <Signal style={style} />;
}

const Signal = styled.div`
  width: 100%;
  min-width: 100px;
  height: var(--height);
  background-color: var(--signal-color);

  will-change: border-radius, transform, opacity;

  transition:
    border-radius 500ms ease,
    transform 500ms ease,
    height 500ms ease,
    opacity 500ms ease;

  opacity: var(--opacity);
  border-radius: var(--border-radius);
`;

export default SignalDisplay;

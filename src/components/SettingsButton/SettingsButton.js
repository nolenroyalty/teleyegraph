import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";

function SettingsButton({ children, ...props }, forwardedRef) {
  return (
    <Button ref={forwardedRef} {...props}>
      {children}
    </Button>
  );
}

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  pointer-events: auto;
  color: ${COLORS["grey-20"]};
  will-change: transform;
  transition: transform 100ms;

  transform: ${(p) => (p.$scaleUp ? "scale(1.1)" : "scale(1)")};

  &:hover {
    transform: scale(1.1);
  }
`;

export default React.forwardRef(SettingsButton);

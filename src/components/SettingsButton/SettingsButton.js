import React from "react";
import styled from "styled-components";

function SettingsButton({ children, ...props }) {
  return <Button {...props}>{children}</Button>;
}

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  pointer-events: auto;

  color: hsl(0deg 0% 10% / 0.7);
`;

export default SettingsButton;

import React from "react";
import styled from "styled-components";

function SettingsLabel({ htmlFor, children }) {
  return <Wrapper htmlFor={htmlFor}>{children}</Wrapper>;
}

const Wrapper = styled.label`
  font-size: 1.25em;
  display: flex;
  align-items: center;
`;

export default SettingsLabel;

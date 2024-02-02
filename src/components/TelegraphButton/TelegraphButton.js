import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";

function TelegraphButton({ setEyesClosed }) {
  return (
    <Button
      onMouseDown={(e) => setEyesClosed(true)}
      onMouseUp={(e) => setEyesClosed(false)}
      onTouchStart={(e) => {
        e.preventDefault();
        setEyesClosed(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        setEyesClosed(false);
      }}
    />
  );
}
const Button = styled.button`
  margin: 0 auto;
  background-color: ${COLORS["grey-30"]};
  border: none;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  color: ${COLORS["white"]};
`;

export default TelegraphButton;

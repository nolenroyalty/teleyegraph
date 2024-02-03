import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";

function TelegraphButton({ eyesClosed }) {
  return (
    <Button
      onMouseDown={(e) => (eyesClosed.current = true)}
      onMouseUp={(e) => (eyesClosed.current = false)}
      onTouchStart={(e) => {
        e.preventDefault();
        eyesClosed.current = true;
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        eyesClosed.current = false;
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

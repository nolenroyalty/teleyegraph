import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";

function TelegraphButton({ eyesClosed, setEyesClosed }) {
  return (
    <Button
      $pressed={eyesClosed.fromButton || eyesClosed.fromVideo}
      onMouseDown={(e) => {
        e.preventDefault();
        setEyesClosed(true);
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        setEyesClosed(false);
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        setEyesClosed(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        setEyesClosed(false);
      }}
    >
      <Front $pressed={eyesClosed.fromButton || eyesClosed.fromVideo}></Front>
    </Button>
  );
}

const Front = styled.span`
  display: block;
  width: 100%;

  height: 100%;

  border-radius: 50%;

  --back1: hsl(43deg 34% 88%);
  --back2: hsl(41deg 33% 64%);
  --back3: hsl(35deg 32% 45%);
  --back4: hsl(22deg 28% 29%);
  --back5: hsl(18deg 28% 14%);

  --c-1: #6d6d6d;

  --c-2: #454545;
  --c-3: #262626;

  background-image: conic-gradient(
      hsl(0deg 0% 90% / 0.2),
      hsl(0deg 0% 90% / 0.3),
      hsl(0deg 0% 90% / 0),
      hsl(0deg 0% 90% / 0.15),
      hsl(0deg 0% 90% / 0.1),
      hsl(0deg 0% 90% / 0.2),
      hsl(0deg 0% 90% / 0.3),
      hsl(0deg 0% 90% / 0),
      hsl(0deg 0% 90% / 0.15),
      hsl(0deg 0% 90% / 0.1),
      hsl(0deg 0% 90% / 0.15)
    ),
    radial-gradient(circle at 50% 50%, var(--c-1) 0%, var(--c-2), var(--c-3));
  filter: brightness(90%) blur(1px);

  transform: ${(p) => (p.$pressed ? "translate(3px, 4px)" : undefined)};
  position: absolute;
  will-change: transform;
  transition: ${(p) =>
    p.$pressed ? "transform 0.1s ease-out" : "transform 0.3s ease"};
  top: 0;
  left: 0;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;

const Button = styled.button`
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  position: relative;
  margin: 0 auto;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  aspect-ratio: 1/1;
  flex: 0 1 75px;
  min-height: 50px;
  box-shadow: 3px 4px 2px 0px hsl(0deg 0% 0% / 0.4);
`;

export default TelegraphButton;

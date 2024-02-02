import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";

function VideoDisplay({
  videoRef,
  setVideoDisplayed,
  videoDisplayed,
  onButtonPress,
}) {
  console.log("VIDEO RENDER");
  const [buttonPressed, setButtonPressed] = React.useState(false);
  const enableCam = React.useCallback(() => {
    onButtonPress();
    setButtonPressed(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        const listener = (event) => {
          setVideoDisplayed(true);
          videoRef.current.removeEventListener("loadeddata", listener);
        };

        videoRef.current.addEventListener("loadeddata", listener);
      })
      .catch((err) => {
        console.log(`couldn't set up cam: ${err}`);
      });
  }, [setVideoDisplayed, onButtonPress, videoRef]);

  return (
    <Wrapper videoDisplayed={videoDisplayed}>
      <VideoWrapper videoDisplayed={videoDisplayed}>
        <Video videoDisplayed={videoDisplayed} ref={videoRef} autoPlay muted />
      </VideoWrapper>
      <Button disabled={buttonPressed} onClick={enableCam}>
        Enable Video
      </Button>
    </Wrapper>
  );
}

const Button = styled.button`
  width: fit-content;
  padding: 5px 20px;
  border: none;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto auto;
  height: fit-content;
  box-shadow: 2px 2px 8px 2px hsl(0deg 0% 0% / 0.3);
  border-radius: 10px;
  position: absolute;
  font-size: 1.5em;
  display: grid;
  place-content: center;

  color: ${COLORS["white"]};
  background: ${COLORS["primary"]};

  will-change: opacity;
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};
  opacity: ${(p) => (p.disabled ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const VideoWrapper = styled.div`
  aspect-ratio: 3/2;
  max-height: 100%;
  height: min(25vh, 16em);
  background-color: ${(p) =>
    p.videoDisplayed ? "transparent" : "hsl(0deg 0% 0% / 0.1)"};
  will-change: background-color;
  transition: background-color 0.3s ease;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  position: relative;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 100%;
  place-items: center;
`;

const Video = styled.video`
  aspect-ratio: 3/2;
  max-height: 100%;
  margin: 0 auto;
  display: block;
  will-change: opacity;
  transition: opacity 2s ease;
  opacity: ${(p) => (p.videoDisplayed ? 1 : 0)};
`;

export default React.memo(VideoDisplay);

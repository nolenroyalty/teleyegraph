import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";
import { SoundContext } from "../SoundProvider";

function VideoDisplay({ videoRef, setVideoDisplayed, videoDisplayed }) {
  console.log("VIDEO RENDER");
  const [buttonPressed, setButtonPressed] = React.useState(false);
  const { resetAudioPaths } = React.useContext(SoundContext);

  const enableCam = React.useCallback(() => {
    console.log("ENABLE CAM");
    resetAudioPaths();
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
  }, [resetAudioPaths, setVideoDisplayed, videoRef]);

  return (
    <Wrapper>
      <VideoWrapper $videoDisplayed={videoDisplayed}>
        <OneMoreWrapper>
          <Video
            $videoDisplayed={videoDisplayed}
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
        </OneMoreWrapper>
        <Button disabled={buttonPressed} onClick={enableCam}>
          <p>Enable Video</p>
        </Button>
      </VideoWrapper>
    </Wrapper>
  );
}

const OneMoreWrapper = styled.div`
  width: fit-content;
  height: 100%;
  margin: 0 auto;
  border-radius: 8px;
`;

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
  @media (max-width: 800px) {
    font-size: 1.25em;
  }

  color: ${COLORS["white"]};
  background: #160b0578;

  will-change: opacity;
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};
  opacity: ${(p) => (p.disabled ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const VideoWrapper = styled.div`
  max-height: 100%;
  background-color: ${(p) =>
    p.$videoDisplayed ? "transparent" : "hsl(0deg 0% 0% / 0.1)"};
  will-change: background-color;
  transition: background-color 0.3s ease;
  aspect-ratio: 16/9;
  margin: 0 auto;
  position: relative;
  border-radius: 4.5% / 8%;

  /* iOS doesn't like this being attached to the video element so we put it
    here.
  */
  filter: sepia(0.75);
`;

const Wrapper = styled.div`
  height: 0px;
  flex: 2 2 225px;

  @media (max-width: 800px) {
    --width: calc(100vw - 64px);
    --max-video-height: calc(var(--width) * 9 / 16);
  }

  max-height: var(--max-video-height);
`;

const Video = styled.video`
  filter: drop-shadow(2px 2px 8px black);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  margin: 0 auto;
  display: block;
  will-change: opacity;
  transition: opacity 1.5s ease;
  opacity: ${(p) => (p.$videoDisplayed ? 1 : 0)};
  border-radius: 16px;
`;

export default React.memo(VideoDisplay);

import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";
import VideoDisplay from "../VideoDisplay";
import EnableVideoButton from "../EnableVideoButton";

function VideoWrapper({ videoRef, setVideoDisplayed, onButtonPress }) {
  return (
    <Wrapper>
      <VideoDisplay ref={videoRef} />
      <Button>
        <ButtonSpan>Enable Video</ButtonSpan>
      </Button>
      {/* <ButtonWrapper>
        <EnableVideoButton
          videoRef={videoRef}
          setVideoDisplayed={setVideoDisplayed}
          onButtonPress={onButtonPress}
        />
      </ButtonWrapper> */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  position: relative;
  place-content: center;
`;

const Video = styled.video``;

const Button = styled.button`
  position: absolute;
  font-size: 1.5em;
  width: 100%;
  height: 100%;
  background: hsl(0deg 0% 0% / 0.3);
  border: none;
`;

const ButtonSpan = styled.span`
  display: inline-block;
  width: 75%;
  background: ${COLORS["grey-40"]};
  color: ${COLORS["white"]};
  border-radius: 20px;
  padding: 10px;
  box-shadow: 2px 2px 10px 5px hsl(0deg 0% 0% / 0.3);
`;

const ButtonWrapper = styled.div`
  position: absolute;
  display: inline;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  width: fit-content;
  height: fit-content;
  margin: auto auto;
`;

export default React.memo(VideoWrapper);

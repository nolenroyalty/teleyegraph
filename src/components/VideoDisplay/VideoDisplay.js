import React from "react";
import styled from "styled-components";

function VideoDisplay({ setVideoDisplayed, onButtonPress }, ref) {
  console.log("VIDEO RENDER");
  function enableCam() {
    onButtonPress();
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        ref.current.srcObject = stream;
        setVideoDisplayed(true);
      })
      .catch((err) => {
        console.log(`couldn't set up cam: ${err}`);
      });
  }

  return (
    <>
      <Video ref={ref} autoPlay muted></Video>
      <Button onClick={enableCam}>enable</Button>
    </>
  );
}

const Video = styled.video`
  width: 200px;
  height: 200px;
  margin: 100px auto 20px;
`;

const Button = styled.button`
  width: fit-content;
  padding: 5px 20px;
  height: 100%;
  margin: 20px auto 20px;
  border: 1px solid black;
  border-radius: 10px;
`;

export default React.memo(React.forwardRef(VideoDisplay));

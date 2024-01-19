import React from "react";
import styled from "styled-components";

function VideoDisplay({ setVideoDisplayed }, ref) {
  function enableCam() {
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
      <button onClick={enableCam}>enable</button>
    </>
  );
}

const Video = styled.video`
  width: 200px;
  height: 100%;
`;

export default React.memo(React.forwardRef(VideoDisplay));

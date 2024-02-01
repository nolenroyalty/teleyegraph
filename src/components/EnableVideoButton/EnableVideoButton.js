import React from "react";
import styled from "styled-components";

function EnableVideoButton({ videoRef, setVideoDisplayed, onButtonPress }) {
  const enableCam = React.useCallback(() => {
    onButtonPress();
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setVideoDisplayed(true);
      })
      .catch((err) => {
        console.log(`couldn't set up cam: ${err}`);
      });
  }, [setVideoDisplayed, onButtonPress, videoRef]);
  return <Button onClick={enableCam}>enable</Button>;
}

const Button = styled.button`
  width: fit-content;
  padding: 5px 20px;
  margin: 20px auto 20px;
  border: 1px solid black;
  border-radius: 10px;
`;

export default EnableVideoButton;

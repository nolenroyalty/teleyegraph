import React from "react";
import styled from "styled-components";

function VideoDisplay({}, ref) {
  console.log("VIDEO RENDER");

  return <Video ref={ref} autoPlay muted></Video>;
}

const Video = styled.video`
  width: 200px;
  height: 200px;
  margin: 100px auto 20px;
`;

export default React.memo(React.forwardRef(VideoDisplay));

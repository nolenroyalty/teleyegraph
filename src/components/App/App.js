import React from "react";
import VideoDisplay from "../VideoDisplay";
import BlinkStateTestDisplay from "../BlinkStateTestDisplay";

import useLandmarker from "../../hooks/use-landmarker";
import useProcessFrame from "../../hooks/use-process-frame";
import useProcessTick from "../../hooks/use-process-tick";

function App() {
  const videoRef = React.useRef();
  const [videoDisplayed, setVideoDisplayed] = React.useState(false);

  const [tickState, setTickState] = React.useState({ open: 0, closed: 0 });
  const landmarker = useLandmarker();
  const framesThisTick = React.useRef(0);
  useProcessFrame({ landmarker, videoRef, framesThisTick, setTickState });
  const { recentFrameCounts } = useProcessTick({
    framesThisTick,
    setTickState,
    videoDisplayed,
  });

  return (
    <main>
      <VideoDisplay ref={videoRef} setVideoDisplayed={setVideoDisplayed} />
      <BlinkStateTestDisplay
        tickState={tickState}
        recentFrameCounts={recentFrameCounts}
      />
    </main>
  );
}

export default App;

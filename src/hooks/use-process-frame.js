import React from "react";
import { videoReady, isBlinking } from "../utils";

function useProcessFrame({
  landmarker,
  videoRef,
  framesThisTick,
  setTickState,
}) {
  React.useEffect(() => {
    let reqId;

    function handleFrame() {
      reqId = window.requestAnimationFrame(handleFrame);
      if (!landmarker || !videoReady(videoRef.current)) {
        return;
      }

      framesThisTick.current += 1;
      const results = landmarker.detectForVideo(
        videoRef.current,
        performance.now()
      );

      if (isBlinking(results)) {
        setTickState((tickState) => ({
          ...tickState,
          closed: tickState.closed + 1,
        }));
      } else {
        setTickState((tickState) => ({
          ...tickState,
          open: tickState.open + 1,
        }));
      }
    }

    reqId = window.requestAnimationFrame(handleFrame);

    return () => {
      window.cancelAnimationFrame(reqId);
    };
  }, [framesThisTick, landmarker, setTickState, videoRef]);
}

export default useProcessFrame;

import React from "react";
import { videoReady, isBlinking } from "../utils";
import useLandmarker from "./use-landmarker";

function useProcessFrame({
  videoRef,
  signalState,
  estimateFps,
  callOnTickTransition,
  eyesClosed,
}) {
  const [decisionThisTick, setDecisionThisTick] = React.useState("unknown");
  const landmarker = useLandmarker();

  React.useEffect(() => {
    let reqId;

    function handleFrame() {
      reqId = window.requestAnimationFrame(handleFrame);
      if (!landmarker || !videoReady(videoRef.current)) {
        return;
      }

      const results = landmarker.detectForVideo(
        videoRef.current,
        performance.now()
      );

      if (eyesClosed || isBlinking(results)) {
        signalState.current.closed += 1;
      } else {
        signalState.current.open += 1;
      }

      function setDecisionAndMaybeHandleTransition(decision) {
        setDecisionThisTick((state) => {
          if (state === "unknown") {
            callOnTickTransition(decision);
          }
          return decision;
        });
      }

      const neededToCountAsBlink = Math.ceil(estimateFps() / 2);
      if (signalState.current.open >= neededToCountAsBlink) {
        setDecisionAndMaybeHandleTransition("open");
      } else if (signalState.current.closed >= neededToCountAsBlink) {
        setDecisionAndMaybeHandleTransition("closed");
      } else {
        // TBD: do we want to call the transition handler here?
        setDecisionThisTick("unknown");
      }
    }

    reqId = window.requestAnimationFrame(handleFrame);

    return () => {
      window.cancelAnimationFrame(reqId);
    };
  }, [signalState, landmarker, videoRef, estimateFps, callOnTickTransition]);

  return { decisionThisTick };
}

export default useProcessFrame;

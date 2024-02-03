import React from "react";
import { videoReady, isBlinking } from "../utils";
import useLandmarker from "./use-landmarker";
import { useEffectDebugger } from "../utils";

function useProcessFrame({
  videoRef,
  signalState,
  estimateFps,
  callOnTickTransition,
  eyesClosed,
}) {
  const [decisionThisTick, setDecisionThisTick] = React.useState("unknown");
  const requestRef = React.useRef();
  const landmarker = useLandmarker();

  React.useEffect(() => {
    const f = (time) => {
      requestRef.current = window.requestAnimationFrame(f);
      if (!landmarker || !videoReady(videoRef.current)) {
        return;
      }

      const results = landmarker.detectForVideo(videoRef.current, time);
      if (eyesClosed.current || isBlinking(results)) {
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
    };

    requestRef.current = window.requestAnimationFrame(f);

    return () => {
      console.log("canceling animation frame");
      window.cancelAnimationFrame(requestRef.current);
    };
  }, [
    callOnTickTransition,
    estimateFps,
    eyesClosed,
    landmarker,
    signalState,
    videoRef,
  ]);

  return { decisionThisTick };
}

export default useProcessFrame;

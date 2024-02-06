import React from "react";
import { videoReady, isBlinking } from "../utils";
import useLandmarker from "./use-landmarker";
import { useEffectDebugger } from "../utils";

function useProcessFrame({
  videoRef,
  signalState,
  estimateFps,
  eyesClosedRef,
  setEyesClosed,
  setSignalCounts,
}) {
  const requestRef = React.useRef();
  const landmarker = useLandmarker();

  React.useEffect(() => {
    const f = (time) => {
      if (!landmarker || !videoReady(videoRef.current)) {
        requestRef.current = window.requestAnimationFrame(f);
        return;
      }

      const results = landmarker.detectForVideo(videoRef.current, time);
      if (isBlinking(results)) {
        setEyesClosed(true);
        signalState.current.closed += 1;
      } else if (eyesClosedRef.current.fromButton) {
        signalState.current.closed += 1;
      } else {
        setEyesClosed(false);
        signalState.current.open += 1;
      }

      function maybeTransition(decision) {
        if (signalState.current.decision === "unknown") {
          signalState.current.decision = decision;
          if (decision === "open") {
            setSignalCounts((prev) => ({
              off: prev.off + 1,
              on: 0,
              consumed: false,
            }));
          } else if (decision === "closed") {
            setSignalCounts((prev) => ({
              on: prev.on + 1,
              off: 0,
              consumed: false,
            }));
          }
        }
      }

      const neededToCountAsBlink = Math.ceil(estimateFps() / 2);
      if (signalState.current.open >= neededToCountAsBlink) {
        maybeTransition("open");
      } else if (signalState.current.closed >= neededToCountAsBlink) {
        maybeTransition("closed");
      }

      requestRef.current = window.requestAnimationFrame(f);
    };

    const num = Math.floor(Math.random() * 10000);
    console.log(`starting animation frame ${num}`);
    requestRef.current = window.requestAnimationFrame(f);

    return () => {
      console.log(`canceling animation frame ${num}`);
      window.cancelAnimationFrame(requestRef.current);
    };
  }, [
    estimateFps,
    eyesClosedRef,
    landmarker,
    signalState,
    videoRef,
    setEyesClosed,
    setSignalCounts,
  ]);

  return {};
}

export default useProcessFrame;

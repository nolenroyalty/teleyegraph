import React from "react";

import VideoDisplay from "../VideoDisplay";
import BlinkStateTestDisplay from "../BlinkStateTestDisplay";

import useLandmarker from "../../hooks/use-landmarker";
import useProcessFrame from "../../hooks/use-process-frame";
import useProcessTick from "../../hooks/use-process-tick";
import useSound from "../../hooks/use-sound";
import { decodeMorse } from "../../utils";

function App() {
  const videoRef = React.useRef();
  const { play: playBlock, resetAudioPath: resetBlock } = useSound({
    audioPath: "/block.mp3",
  });

  const { play: playCymbal, resetAudioPath: resetCymbal } = useSound({
    audioPath: "/cymbal.mp3",
  });

  const resetAllAudio = React.useCallback(() => {
    resetBlock();
    resetCymbal();
  }, [resetBlock, resetCymbal]);

  const [videoDisplayed, setVideoDisplayed] = React.useState(false);
  const landmarker = useLandmarker();
  const [currentSignal, setCurrentSignal] = React.useState({ state: "none" });
  const [currentChar, setCurrentChar] = React.useState([]);
  const [currentWord, setCurrentWord] = React.useState("");
  const [text, setText] = React.useState("");

  const signalCount = React.useRef({ on: 0, off: 0 });

  function callOnTickTransition(decision) {
    if (decision === "open") {
      signalCount.current.on = 0;
      signalCount.current.off += 1;

      if (signalCount.current.off === 1) {
        if (currentSignal.state !== "none") {
          setCurrentChar((currentChar) => {
            return [...currentChar, currentSignal.state];
          });
        }
        setCurrentSignal({ state: "none" });
      } else if (signalCount.current.off === 3) {
        const decoded = decodeMorse(currentChar.join(""));
        if (decoded !== null) {
          playCymbal();
          setCurrentWord((currentWord) => currentWord + decoded);
        } else {
          // nroyalty: HANDLE ERROR
        }
        setCurrentChar([]);
      } else if (signalCount.current.off === 7) {
        setText((currentText) => `${currentText} ${currentWord}`);
        setCurrentWord("");
      }
    } else if (decision === "closed") {
      signalCount.current.off = 0;
      signalCount.current.on += 1;

      if (signalCount.current.on === 3) {
        setCurrentSignal({ state: "-" });
      } else if (signalCount.current.on < 3) {
        setCurrentSignal({ state: ".", count: signalCount.current.on });
      }
    }
  }

  const { estimateFps, signalState } = useProcessTick({
    videoDisplayed,
    playSound: playBlock,
  });

  const { decisionThisTick } = useProcessFrame({
    landmarker,
    videoRef,
    signalState,
    estimateFps,
    callOnTickTransition,
  });

  return (
    <main>
      <VideoDisplay
        ref={videoRef}
        setVideoDisplayed={setVideoDisplayed}
        onButtonPress={resetAllAudio}
      />
      <BlinkStateTestDisplay
        estimateFps={estimateFps}
        currentSignal={currentSignal}
        currentChar={currentChar}
        currentWord={currentWord}
        text={text}
      />
    </main>
  );
}

export default App;

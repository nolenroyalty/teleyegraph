import React from "react";

import VideoDisplay from "../VideoDisplay";
import BlinkStateTestDisplay from "../BlinkStateTestDisplay";

import useLandmarker from "../../hooks/use-landmarker";
import useProcessFrame from "../../hooks/use-process-frame";
import useProcessTick from "../../hooks/use-process-tick";
import useSound from "../../hooks/use-sound";
import { decodeMorse } from "../../utils";
import CurrentSignalDisplay from "../CurrentSignalDisplay";
import styled from "styled-components";

function App() {
  const videoRef = React.useRef();
  const eyesClosedRef = React.useRef();
  const [audioDependencies, setAudioDependencies] = React.useState([]);

  const addAudioDependency = React.useCallback((audioPath) => {
    setAudioDependencies((dependencies) => [...dependencies, audioPath]);
  }, []);

  const removeAudioDependency = React.useCallback(({ key }) => {
    setAudioDependencies((dependencies) => {
      return dependencies.filter((dependency) => dependency.key !== key);
    });
  }, []);

  const { play: playBlock } = useSound({
    audioPath: "/block.mp3",
    addAudioDependency,
    removeAudioDependency,
  });

  const { play: playCymbal } = useSound({
    audioPath: "/cymbal.mp3",
    addAudioDependency,
    removeAudioDependency,
  });

  const resetAllAudio = React.useCallback(() => {
    audioDependencies.forEach(({ resetAudioPath }) => {
      resetAudioPath();
    });
  }, [audioDependencies]);

  const [videoDisplayed, setVideoDisplayed] = React.useState(false);
  const landmarker = useLandmarker();
  const [currentSignal, setCurrentSignal] = React.useState({ state: "none" });
  const [currentChar, setCurrentChar] = React.useState([]);
  const [currentWord, setCurrentWord] = React.useState("");
  const [text, setText] = React.useState("");
  const [eyesClosed, setEyesClosed] = React.useState(false);

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
        console.log("on", signalCount.current.on);
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
    eyesClosed,
  });

  return (
    <main>
      <MaxWidthWrapper>
        <VideoDisplay
          ref={videoRef}
          setVideoDisplayed={setVideoDisplayed}
          onButtonPress={resetAllAudio}
        />
        <label htmlFor="eyesClosedBox">
          Eyes Closed {eyesClosed ? "Yes " : "No "}
          <input
            id="eyesClosedBox"
            type="checkbox"
            checked={eyesClosed}
            onChange={(event) => setEyesClosed(event.target.checked)}
            ref={eyesClosedRef}
          />
        </label>
        <BlinkStateTestDisplay
          estimateFps={estimateFps}
          currentSignal={currentSignal}
          currentChar={currentChar}
          currentWord={currentWord}
          text={text}
        />
        <CurrentSignalDisplay currentSignal={currentSignal} />
      </MaxWidthWrapper>
    </main>
  );
}

const MaxWidthWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: silver;
`;

export default App;

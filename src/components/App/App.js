import React from "react";

import VideoDisplay from "../VideoDisplay";

import useLandmarker from "../../hooks/use-landmarker";
import useProcessFrame from "../../hooks/use-process-frame";
import useProcessTick from "../../hooks/use-process-tick";
import useSound from "../../hooks/use-sound";
import { decodeMorse } from "../../utils";
import CurrentSignalDisplay from "../CurrentSignalDisplay";
import CurrentCharacterDisplay from "../CurrentCharacterDisplay";
import CurrentWordDisplay from "../CurrentWordDisplay";
import CurrentTextDisplay from "../CurrentTextDisplay";
import TelegraphButton from "../TelegraphButton";
import styled from "styled-components";
import {
  MAX_SIGNALS_IN_CHAR,
  DITS_TO_ADD_CHARACTER,
  DITS_TO_ADD_WORD,
  COLORS,
} from "../../constants";

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

  const { play: playBlock } = useSound(
    {
      audioPath: "/block.mp3",
      addAudioDependency,
      removeAudioDependency,
    },
    []
  );

  const { play: playCymbal } = useSound(
    {
      audioPath: "/cymbal.mp3",
      addAudioDependency,
      removeAudioDependency,
    },
    []
  );

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
  const [candidateChar, setCandidateChar] = React.useState({ count: 0 });
  const [candidateWord, setCandidateWord] = React.useState({ count: 0 });
  const [text, setText] = React.useState("");
  const [eyesClosed, setEyesClosed] = React.useState(false);

  const signalCount = React.useRef({ on: 0, off: 0 });
  const resetCandidateChar = (clearChar) => {
    /* Gross hack - we want to preserve nice fade-ins / outs when we
       reset the character due to closing our eyes (so we don't want to clear
       the current char so that it fades out) - but when we *add* the character
       we want to make sure to clear the candidate so that we don't have two
       chars on screen while the candidate fades. Oh well. */
    if (clearChar) {
      setCandidateChar({ count: 0 });
    } else {
      setCandidateChar((c) => {
        return { ...c, count: 0 };
      });
    }
  };
  function callOnTickTransition(decision) {
    if (decision === "open") {
      signalCount.current.on = 0;
      signalCount.current.off += 1;

      if (signalCount.current.off === 1) {
        if (currentSignal.state !== "none") {
          setCurrentChar((currentChar) => {
            if (currentChar.length >= MAX_SIGNALS_IN_CHAR) {
              console.warn(
                `not adding ${currentSignal.state} because current character \
already has ${MAX_SIGNALS_IN_CHAR} signals`
              );
              return currentChar;
            }
            const newChar = [...currentChar, currentSignal.state];
            const decoded = decodeMorse(newChar.join(""));
            if (decoded !== null) {
              setCandidateChar({ char: decoded, count: 1 });
            } else {
              // HACK and gross edge case - this means we've written out an invalid
              // character and I'm not sure how to show that well in the UI. For now
              // I guess we set the candidate char to a warning?
              setCandidateChar({ char: "⁉️", count: 1 });
              console.warn(`Error decoding candidate char ${newChar.join("")}`);
            }
            return newChar;
          });
        }
        setCurrentSignal({ state: "none" });
      } else if (signalCount.current.off < DITS_TO_ADD_CHARACTER) {
        setCandidateChar((currentSignal) => {
          return { ...currentSignal, count: signalCount.current.off };
        });
      } else if (signalCount.current.off === DITS_TO_ADD_CHARACTER) {
        resetCandidateChar(true);
        const decoded = decodeMorse(currentChar.join(""));
        if (decoded !== null) {
          playCymbal();
          setCurrentWord((currentWord) => {
            const newWord = currentWord + decoded;
            setCandidateWord({
              count: signalCount.current.off,
              word: " " + newWord,
            });
            return newWord;
          });
        } else {
          // nroyalty: HANDLE ERROR
        }
        setCurrentChar([]);
      } else if (
        signalCount.current.off > DITS_TO_ADD_CHARACTER &&
        signalCount.current.off < DITS_TO_ADD_WORD
      ) {
        setCandidateWord((currentWord) => {
          return { ...currentWord, count: signalCount.current.off };
        });
      } else if (signalCount.current.off === DITS_TO_ADD_WORD) {
        setText((currentText) => `${currentText} ${currentWord}`);
        setCurrentWord("");
        setCandidateWord({ count: 0 });
      }
    } else if (decision === "closed") {
      resetCandidateChar();
      setCandidateWord((current) => {
        // same fading hack as above
        return { ...current, count: 0 };
      });
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
    eyesClosed,
  });

  return (
    <Background>
      <MaxWidthWrapper>
        <Header>
          <Title>tel👁️graph</Title>
        </Header>
        <VideoDisplay
          videoRef={videoRef}
          videoDisplayed={videoDisplayed}
          setVideoDisplayed={setVideoDisplayed}
          onButtonPress={resetAllAudio}
        />
        <CurrentSignalDisplay currentSignal={currentSignal} />
        <CurrentCharacterDisplay
          currentChar={currentChar}
          fadeCount={candidateChar.count}
        />
        <CurrentWordDisplay
          currentWord={currentWord}
          candidateChar={candidateChar}
          fadeCount={candidateWord.count}
        />
        <CurrentTextDisplay text={text} candidateWord={candidateWord} />
        <TelegraphButton setEyesClosed={setEyesClosed} />
      </MaxWidthWrapper>
    </Background>
  );
}

const Header = styled.header`
  text-align: center;
  font-style: italic;
`;

const Title = styled.h1``;

const Background = styled.div`
  min-height: 100%;
  width: 100%;
  background-image: linear-gradient(
    235deg,
    ${COLORS["grey-40"]} 25%,
    ${COLORS["grey-50"]} 80%
  );
`;

const MaxWidthWrapper = styled.div`
  max-width: 800px;
  height: 100%;
  padding: 2em 2em;
  margin: 0 auto;
  display: grid;
  gap: 8px;

  grid-template-rows:
    [header] 75px [video] 250px
    [mainsignal] 100px
    [charsignal] 4em [word] 2.5em [text] 7.5em [button] 100px;
`;

export default App;

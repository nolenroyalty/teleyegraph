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
import styled, { createGlobalStyle } from "styled-components";
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
  const [currentWord, setCurrentWord] = React.useState("WORD");
  const [candidateChar, setCandidateChar] = React.useState({ count: 0 });
  const [candidateWord, setCandidateWord] = React.useState({ count: 0 });
  const [text, setText] = React.useState("CURRENT TEXT");
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
    <MaxWidthWrapper>
      <Header>
        <Title>
          Tel<ShadowSpan>👁️</ShadowSpan>graph
        </Title>
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
  );
}

const Header = styled.header`
  text-align: center;
  /* font-style: italic; */
`;

const Title = styled.h1`
  font-family: "Jacques Francois Shadow", cursive;
  // nroyalty: MAKE THIS SCALE!
  font-size: clamp(2.2rem, 5vw + 1rem, 4.2rem);
  line-height: 4.5rem;
  text-transform: uppercase;
  padding: 0;
  color: var(--color-grey-20);
  // never wrap
  white-space: nowrap;
`;

const ShadowSpan = styled.span`
  filter: drop-shadow(4px 4px 4px hsl(0deg 0% 0% / 0.75));
`;

const MaxWidthWrapper = styled.div`
  --max-width: 800px;
  --padding: 2rem;
  --max-inner-width: calc(var(--max-width) - var(--padding) * 2);
  max-width: var(--max-width);
  width: min(100vw, var(--max-width));
  height: 100%;
  padding: var(--padding);
  margin: 0 auto;
  display: grid;
  gap: calc(8px + 1vh);
  align-content: space-between;

  font-family: "JMH Typewriter", monospace;

  /*
    take the max inner width, divide by the aspect ratio, and add 1 rem
    for a little padding
  */
  --max-video-height: calc(var(--max-inner-width) * 9 / 16 + 1rem);

  grid-template-rows:
    [header] 4.5rem [video] minmax(150px, var(--max-video-height))
    [mainsignal] minmax(75px, 200px)
    [charsignal] 3rem [word] 2.5em [text] 7.5em [button] 100px;

  grid-template-columns: min(100vw - 4em, 800px - 4em);
`;

export default App;

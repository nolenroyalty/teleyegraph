import React from "react";
import styled from "styled-components";
import { SoundContext } from "../SoundProvider";

import VideoDisplay from "../VideoDisplay";
import CurrentSignalDisplay from "../CurrentSignalDisplay";
import CurrentCharacterDisplay from "../CurrentCharacterDisplay";
import CurrentWordDisplay from "../CurrentWordDisplay";
import CurrentTextDisplay from "../CurrentTextDisplay";
import TelegraphButton from "../TelegraphButton";
import MorseBeepManager from "../MorseBeepManager";

import useProcessFrame from "../../hooks/use-process-frame";
import useProcessTick from "../../hooks/use-process-tick";
import useStateRefCombo from "../../hooks/use-state-ref-combo";
import useResettableCandidate from "../../hooks/use-resettable-candidate";

import { decodeMorse } from "../../utils";
import {
  MAX_SIGNALS_IN_CHAR,
  DITS_TO_ADD_CHARACTER,
  DITS_TO_ADD_WORD,
  DITS_IN_DASH,
} from "../../constants";

function Main() {
  const videoRef = React.useRef();
  const [videoDisplayed, setVideoDisplayed] = React.useState(false);
  const [currentSignal, setCurrentSignal] = React.useState({ state: "none" });
  const [currentChar, setCurrentChar] = React.useState([]);
  const [candidateChar, setCandidateChar, resetCandidateChar] =
    useResettableCandidate();
  const [currentWord, setCurrentWord] = React.useState("");
  const [candidateWord, setCandidateWord, resetCandidateWord] =
    useResettableCandidate();
  const [text, setText] = React.useState("");
  const [signalCounts, setSignalCounts] = React.useState({
    consumed: true,
    on: 0,
    off: 0,
  });

  const { sounds } = React.useContext(SoundContext);
  const {
    state: eyesClosed,
    ref: eyesClosedRef,
    setState: setEyesClosed,
  } = useStateRefCombo({
    fromVideo: false,
    fromButton: false,
  });

  const { estimateFps, signalState } = useProcessTick({
    videoDisplayed,
  });

  useProcessFrame({
    videoRef,
    signalState,
    estimateFps,
    eyesClosedRef,
    setEyesClosed: React.useCallback(
      (val) => {
        setEyesClosed((prev) => ({ ...prev, fromVideo: val }));
      },
      [setEyesClosed]
    ),
    setSignalCounts,
  });

  const handleOn = () => {
    resetCandidateChar();
    resetCandidateWord();
    if (signalCounts.on < DITS_IN_DASH) {
      setCurrentSignal({ state: ".", count: signalCounts.on });
    } else if (signalCounts.on === DITS_IN_DASH) {
      setCurrentSignal({ state: "-" });
    }
  };

  const handleOffOne = () => {
    if (currentChar.length >= MAX_SIGNALS_IN_CHAR) {
      console.warn("Current character has too many signals - not adding.");
    } else {
      const newChar = [...currentChar, currentSignal.state];
      const decoded = decodeMorse(newChar.join(""));
      setCurrentChar(newChar);
      if (decoded !== null) {
        setCandidateChar({ char: decoded, count: 1 });
      } else {
        setCandidateChar({ char: "⁉️", count: 1 });
        console.warn(`Error decoding candidate char ${newChar.join("")}`);
      }
    }
    setCurrentSignal({ state: "none" });
  };

  const handleOffAddChar = () => {
    resetCandidateChar({ hard: true });
    if (currentChar.length === 0) {
      return;
    }
    const decoded = decodeMorse(currentChar.join(""));
    if (decoded !== null) {
      sounds.addChar.play(); // nroyalty: useEffect?
      const newWord = currentWord + decoded;
      setCurrentWord(newWord);
      setCandidateWord({ count: signalCounts.off, word: " " + newWord });
    } else {
      // nroyalty: HANDLE ERROR
    }
    setCurrentChar([]);
  };

  const maybeConsumeSignal = () => {
    if (signalCounts.consumed) {
      return;
    }
    setSignalCounts((prev) => ({ ...prev, consumed: true }));
    console.log("consuming");
    if (signalCounts.on > 0) {
      handleOn();
    } else if (signalCounts.off === 1 && currentSignal.state !== "none") {
      handleOffOne();
    } else if (signalCounts.off < DITS_TO_ADD_CHARACTER) {
      setCandidateChar((candidate) => ({
        ...candidate,
        count: signalCounts.off,
      }));
    } else if (signalCounts.off === DITS_TO_ADD_CHARACTER) {
      handleOffAddChar();
    } else if (
      signalCounts.off > DITS_TO_ADD_CHARACTER &&
      signalCounts.off < DITS_TO_ADD_WORD
    ) {
      setCandidateWord((currentWord) => {
        return { ...currentWord, count: signalCounts.off };
      });
    } else if (signalCounts.off === DITS_TO_ADD_WORD) {
      setText((currentText) => `${currentText} ${currentWord}`);
      setCurrentWord("");
      resetCandidateWord({ hard: true });
    }
  };
  maybeConsumeSignal();

  return (
    <Wrapper>
      <MorseBeepManager eyesClosed={eyesClosed} />
      <VideoDisplay
        videoRef={videoRef}
        videoDisplayed={videoDisplayed}
        setVideoDisplayed={setVideoDisplayed}
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
      <TelegraphButton
        eyesClosed={eyesClosed}
        setEyesClosed={React.useCallback(
          (val) => {
            setEyesClosed((prev) => ({ ...prev, fromButton: val }));
          },
          [setEyesClosed]
        )}
      />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  gap: 1rem;
`;

export default Main;

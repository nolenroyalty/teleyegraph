import React from "react";
import Feather from "react-feather";
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
  const [candidateChar, setCandidateChar] = React.useState("");
  const [currentWord, setCurrentWord] = React.useState("");
  const [candidateWord, setCandidateWord] = React.useState("");
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
        setEyesClosed((prev) => {
          if (prev.fromVideo !== val) {
            return { ...prev, fromVideo: val };
          } else {
            return prev;
          }
        });
      },
      [setEyesClosed]
    ),
    setSignalCounts,
  });

  const handleOffOne = () => {
    if (currentChar.length >= MAX_SIGNALS_IN_CHAR) {
      console.warn("Current character has too many signals - not adding.");
    } else {
      const newChar = [...currentChar, currentSignal.state];
      const decoded = decodeMorse(newChar.join(""));
      setCurrentChar(newChar);
      if (decoded !== null) {
        setCandidateChar(decoded);
      } else {
        setCandidateChar("⁉️");
        console.warn(`Error decoding candidate char ${newChar.join("")}`);
      }
    }
    setCurrentSignal({ state: "none" });
  };

  const handleOffAddChar = () => {
    setCandidateChar("");
    if (currentChar.length === 0) {
      return;
    }
    const decoded = decodeMorse(currentChar.join(""));
    if (decoded !== null) {
      sounds.addChar.play();
      const newWord = currentWord + decoded;
      setCurrentWord(newWord);
      setCandidateWord(" " + newWord);
    } else {
      // nroyalty: HANDLE ERROR
    }
    setCurrentChar([]);
  };

  /* NOTE: We avoid resetting candidate chars and words to the empty
  string when the user opens their eyes because it allows for a nice fade,
  and we'll set a new candidate before showing them again anyway. */
  const maybeConsumeSignal = () => {
    if (signalCounts.consumed) {
      return;
    }
    setSignalCounts((prev) => ({ ...prev, consumed: true }));
    console.log("consuming");
    if (signalCounts.on > 0 && signalCounts.on < DITS_IN_DASH) {
      setCurrentSignal({ state: ".", count: signalCounts.on });
    } else if (signalCounts.on === DITS_IN_DASH) {
      setCurrentSignal({ state: "-" });
    } else if (signalCounts.off === 1 && currentSignal.state !== "none") {
      handleOffOne();
    } else if (signalCounts.off === DITS_TO_ADD_CHARACTER) {
      handleOffAddChar();
    } else if (signalCounts.off === DITS_TO_ADD_WORD) {
      setText((currentText) => `${currentText} ${currentWord}`);
      setCurrentWord("");
      setCandidateWord("");
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
        signalCounts={signalCounts}
      />
      <CurrentWordDisplay
        currentWord={currentWord}
        candidateChar={candidateChar}
        signalCounts={signalCounts}
      />
      <CurrentTextDisplay
        text={text}
        candidateWord={candidateWord}
        signalCounts={signalCounts}
      />
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

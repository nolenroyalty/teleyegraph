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
  const [candidateChar, setCandidateChar] = React.useState({
    count: 0,
  });
  const [candidateWord, setCandidateWord] = React.useState({ count: 0 });
  const [text, setText] = React.useState("");
  const { sounds } = React.useContext(SoundContext);
  const [signalCounts, setSignalCounts] = React.useState({
    consumed: true,
    on: 0,
    off: 0,
  });

  const [currentChar, setCurrentChar] = React.useState([]);
  const [currentSignal, setCurrentSignal] = React.useState({ state: "none" });

  const [eyesClosed, setEyesClosed] = React.useState({
    fromVideo: false,
    fromButton: false,
  });
  const eyesClosedRef = React.useRef(eyesClosed);

  const [currentWord, setCurrentWord] = React.useState("");

  const { estimateFps, signalState } = useProcessTick({
    videoDisplayed,
  });

  const setButtonEyesClosed = React.useCallback(
    (val) => {
      setEyesClosed((prev) => {
        const next = { ...prev, fromButton: val };
        eyesClosedRef.current = next;
        return next;
      });
    },
    [setEyesClosed]
  );

  const setVideoEyesClosed = React.useCallback(
    (val) => {
      setEyesClosed((prev) => {
        const next = { ...prev, fromVideo: val };
        eyesClosedRef.current = next;
        return next;
      });
    },
    [setEyesClosed]
  );

  useProcessFrame({
    videoRef,
    signalState,
    estimateFps,
    eyesClosedRef,
    setEyesClosed: setVideoEyesClosed,
    setSignalCounts,
  });

  const makeResetCandidate =
    (setCandidate) =>
    ({ hard = false } = {}) => {
      /* Gross hack - we often want to preserve nice fade-ins / fade-outs
        when resetting a character or word. This happens when, for example, we're
        showing the character that we'd generate for the current signal and then
        the user closes their eyes, which changes the current signal. If we wiped
        the candidate immediately it wouldn't fade. Instead we just reset the count
        so that it fades out.

        We want to do a hard reset when we're adding a new character or word to the
        page, because that character/word will take the place of the candidate.

        Doing all of this means that we have to be more careful about managing
        our candidate state to avoid showing stale values, but it's worth it. */
      if (hard) {
        setCandidate({ count: 0 });
      } else {
        setCandidate((c) => {
          return { ...c, count: 0 };
        });
      }
    };

  // eslint-disable-next-line
  const resetCandidateChar = React.useCallback(
    makeResetCandidate(setCandidateChar),
    [setCandidateChar]
  );
  // eslint-disable-next-line
  const resetCandidateWord = React.useCallback(
    makeResetCandidate(setCandidateWord),
    [setCandidateWord]
  );

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

  if (signalCounts.consumed) {
  } else {
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
  }

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
        setEyesClosed={setButtonEyesClosed}
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

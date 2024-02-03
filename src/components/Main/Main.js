import React from "react";
import { SoundContext } from "../SoundProvider";

import VideoDisplay from "../VideoDisplay";
import CurrentSignalDisplay from "../CurrentSignalDisplay";
import CurrentCharacterDisplay from "../CurrentCharacterDisplay";
import CurrentWordDisplay from "../CurrentWordDisplay";
import CurrentTextDisplay from "../CurrentTextDisplay";
import TelegraphButton from "../TelegraphButton";

// import useLandmarker from "../../hooks/use-landmarker";
import useProcessFrame from "../../hooks/use-process-frame";
import useProcessTick from "../../hooks/use-process-tick";

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
  const [candidateChar, setCandidateChar] = React.useState({ count: 0 });
  const [candidateWord, setCandidateWord] = React.useState({ count: 0 });
  const [text, setText] = React.useState("CURRENT TEXT");
  const eyesClosed = React.useRef(false);
  const signalCount = React.useRef({ on: 0, off: 0 });

  const { sounds } = React.useContext(SoundContext);

  // This is gross but we have a bunch of state that we want to be able
  // to update *and* read from our tick functions. We don't want *those*
  // functions to re-render when we change this state (because it causes
  // some thrasy behavior especially with request animation frame) - but
  // we do want to have the rest of our app re-render based on the state.
  // So we do this...
  const wordRef = React.useRef("WORD");
  const [currentWord, _setCurrentWord] = React.useState("WORD");
  const setCurrentWord = React.useCallback((word) => {
    wordRef.current = word;
    _setCurrentWord(word);
  }, []);

  const charRef = React.useRef([]);
  const [currentChar, _setCurrentChar] = React.useState([]);
  const setCurrentChar = React.useCallback((char) => {
    charRef.current = char;
    _setCurrentChar(char);
  }, []);

  const signalRef = React.useRef({ state: "none" });
  const [currentSignal, _setCurrentSignal] = React.useState({ state: "none" });
  const setCurrentSignal = React.useCallback(
    (signal) => {
      signalRef.current = signal;
      _setCurrentSignal(signal);
    },
    [_setCurrentSignal]
  );

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

  const handleFirstOffSignal = React.useCallback(() => {
    if (signalRef.current.state !== "none") {
      if (charRef.current.length >= MAX_SIGNALS_IN_CHAR) {
        console.warn(
          `not adding ${signalRef.current.state} because current character \
  already has ${MAX_SIGNALS_IN_CHAR} signals`
        );
      } else {
        const newChar = [...charRef.current, signalRef.current.state];
        const decoded = decodeMorse(newChar.join(""));
        setCurrentChar(newChar);
        if (decoded !== null) {
          setCandidateChar({ char: decoded, count: 1 });
        } else {
          // HACK and gross edge case - this means we've written out an invalid
          // character and I'm not sure how to show that well in the UI. For now
          // I guess we set the candidate char to a warning?
          setCandidateChar({ char: "⁉️", count: 1 });
          console.warn(`Error decoding candidate char ${newChar.join("")}`);
        }
      }
    }
    setCurrentSignal({ state: "none" });
  }, [setCurrentChar, setCurrentSignal]);

  const handleOnSignal = React.useCallback(() => {
    resetCandidateChar();
    resetCandidateWord();
    signalCount.current.off = 0;
    signalCount.current.on += 1;

    if (signalCount.current.on === DITS_IN_DASH) {
      setCurrentSignal({ state: "-" });
    } else if (signalCount.current.on < DITS_IN_DASH) {
      setCurrentSignal({ state: ".", count: signalCount.current.on });
    }
  }, [resetCandidateChar, resetCandidateWord, setCurrentSignal]);

  const HandleAddChar = React.useCallback(() => {
    resetCandidateChar({ hard: true });
    const decoded = decodeMorse(charRef.current.join(""));
    if (decoded !== null) {
      sounds.addChar.play();
      setCurrentWord(wordRef.current + decoded);
      setCandidateWord({
        count: signalCount.current.off,
        word: " " + wordRef.current,
      });
    } else {
      // nroyalty: HANDLE ERROR
    }
    setCurrentChar([]);
  }, [resetCandidateChar, setCurrentChar, setCurrentWord, sounds.addChar]);

  const callOnTickTransition = React.useCallback(
    (decision) => {
      if (decision === "open") {
        signalCount.current.on = 0;
        signalCount.current.off += 1;

        if (signalCount.current.off === 1) {
          handleFirstOffSignal();
        } else if (signalCount.current.off < DITS_TO_ADD_CHARACTER) {
          setCandidateChar((currentSignal) => {
            return { ...currentSignal, count: signalCount.current.off };
          });
        } else if (signalCount.current.off === DITS_TO_ADD_CHARACTER) {
          HandleAddChar();
        } else if (
          signalCount.current.off > DITS_TO_ADD_CHARACTER &&
          signalCount.current.off < DITS_TO_ADD_WORD
        ) {
          setCandidateWord((currentWord) => {
            return { ...currentWord, count: signalCount.current.off };
          });
        } else if (signalCount.current.off === DITS_TO_ADD_WORD) {
          setText((currentText) => `${currentText} ${wordRef.current}`);
          setCurrentWord("");
          resetCandidateWord({ hard: true });
        }
      } else if (decision === "closed") {
        handleOnSignal();
      }
    },
    [
      handleFirstOffSignal,
      HandleAddChar,
      setCurrentWord,
      resetCandidateWord,
      handleOnSignal,
    ]
  );

  const { estimateFps, signalState } = useProcessTick({
    videoDisplayed,
  });

  const { decisionThisTick } = useProcessFrame({
    videoRef,
    signalState,
    estimateFps,
    callOnTickTransition,
    eyesClosed,
  });

  return (
    <>
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
      <TelegraphButton eyesClosed={eyesClosed} />
    </>
  );
}

export default Main;

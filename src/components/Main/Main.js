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

  const signalCount = React.useRef({ on: 0, off: 0 });

  const { sounds } = React.useContext(SoundContext);

  // const {
  //   state: eyesClosed,
  //   ref: eyesClosedRef,
  //   setState: setEyesClosed,
  // } = useStateRefCombo({ fromVideo: false, fromButton: false });

  // const {
  //   state: currentWord,
  //   ref: wordRef,
  //   setState: setCurrentWord,
  // } = useStateRefCombo("");

  const {
    state: currentChar,
    ref: charRef,
    setState: setCurrentChar,
  } = useStateRefCombo([]);

  const {
    state: currentSignal,
    ref: signalRef,
    setState: setCurrentSignal,
  } = useStateRefCombo({ state: "none" });

  const [eyesClosed, setEyesClosed] = React.useState({
    fromVideo: false,
    fromButton: false,
  });
  const eyesClosedRef = React.useRef(eyesClosed);

  const [currentWord, setCurrentWord] = React.useState("");
  const wordRef = React.useRef("");

  // const [currentChar, setCurrentChar] = React.useState([]);
  // const charRef = React.useRef([]);

  // const [currentSignal, setCurrentSignal] = React.useState({ state: "none" });
  // const signalRef = React.useRef({ state: "none" });

  // const setCurrentSignal = React.useCallback(
  //   (val) => {
  //     _setCurrentSignal((prev) => {
  //       console.log(`set cur ${val.state} | prev ${prev.state}`);
  //       const _new = typeof val === "function" ? val(prev) : val;
  //       signalRef.current = _new;
  //       return _new;
  //     });
  //   },
  //   [_setCurrentSignal]
  // );

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
  }, [charRef, setCurrentChar, setCurrentSignal, signalRef]);

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

  const handleAddChar = React.useCallback(() => {
    resetCandidateChar({ hard: true });
    const decoded = decodeMorse(charRef.current.join(""));
    if (decoded !== null) {
      sounds.addChar.play();
      setCurrentWord(wordRef.current + decoded);
      wordRef.current = wordRef.current + decoded;
      setCandidateWord({
        count: signalCount.current.off,
        word: " " + wordRef.current,
      });
    } else {
      // nroyalty: HANDLE ERROR
    }
    setCurrentChar([]);
  }, [
    charRef,
    resetCandidateChar,
    setCurrentChar,
    setCurrentWord,
    sounds.addChar,
    wordRef,
  ]);

  React.useEffect(() => {
    console.log(
      `CURRENT SIGNAL: ${currentSignal.state} | ${currentSignal.count} | ${signalRef.current.state} | ${signalRef.current.count}`
    );
  }, [currentSignal, signalRef]);

  const callOnTickTransition = React.useCallback(
    (decision) => {
      const i = Math.random();
      console.log(
        `${i} CALL ON TICK TRANSITION ${decision} signalCount: ${signalCount.current.off}`
      );

      if (decision === "open") {
        signalCount.current.on = 0;
        signalCount.current.off += 1;

        if (signalCount.current.off === 1) {
          console.log(`${i} HERE`);
          handleFirstOffSignal();
        } else if (signalCount.current.off < DITS_TO_ADD_CHARACTER) {
          setCandidateChar((candidate) => {
            return { ...candidate, count: signalCount.current.off };
          });
        } else if (signalCount.current.off === DITS_TO_ADD_CHARACTER) {
          handleAddChar();
        } else if (
          signalCount.current.off > DITS_TO_ADD_CHARACTER &&
          signalCount.current.off < DITS_TO_ADD_WORD
        ) {
          setCandidateWord((currentWord) => {
            return { ...currentWord, count: signalCount.current.off };
          });
        } else if (signalCount.current.off === DITS_TO_ADD_WORD) {
          setText((currentText) => {
            const next = `${currentText} ${wordRef.current}`;
            setCurrentWord("");
            wordRef.current = "";
            return next;
          });

          resetCandidateWord({ hard: true });
        }
      } else if (decision === "closed") {
        handleOnSignal();
      }
    },
    [
      handleAddChar,
      handleOnSignal,
      setCurrentWord,
      resetCandidateWord,
      handleFirstOffSignal,
    ]
  );

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

  const { decisionThisTick } = useProcessFrame({
    videoRef,
    signalState,
    estimateFps,
    callOnTickTransition,
    eyesClosedRef,
    setEyesClosed: setVideoEyesClosed,
  });

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

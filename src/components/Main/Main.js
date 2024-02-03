import React from "react";
import { SoundContext } from "../SoundProvider";

import VideoDisplay from "../VideoDisplay";
import CurrentSignalDisplay from "../CurrentSignalDisplay";
import CurrentCharacterDisplay from "../CurrentCharacterDisplay";
import CurrentWordDisplay from "../CurrentWordDisplay";
import CurrentTextDisplay from "../CurrentTextDisplay";
import TelegraphButton from "../TelegraphButton";

import useLandmarker from "../../hooks/use-landmarker";
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
  const landmarker = useLandmarker(); // move
  const [currentSignal, setCurrentSignal] = React.useState({ state: "none" });
  const [currentChar, setCurrentChar] = React.useState([]);
  const [currentWord, setCurrentWord] = React.useState("WORD");
  const [candidateChar, setCandidateChar] = React.useState({ count: 0 });
  const [candidateWord, setCandidateWord] = React.useState({ count: 0 });
  const [text, setText] = React.useState("CURRENT TEXT");
  const [eyesClosed, setEyesClosed] = React.useState(false);
  const signalCount = React.useRef({ on: 0, off: 0 });

  const { sounds } = React.useContext(SoundContext);

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

  const resetCandidateChar = makeResetCandidate(setCandidateChar);
  const resetCandidateWord = makeResetCandidate(setCandidateWord);

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
        resetCandidateChar({ hard: true });
        const decoded = decodeMorse(currentChar.join(""));
        if (decoded !== null) {
          sounds.addChar.play();
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
        resetCandidateWord({ hard: true });
      }
    } else if (decision === "closed") {
      resetCandidateChar();
      resetCandidateWord();
      signalCount.current.off = 0;
      signalCount.current.on += 1;

      if (signalCount.current.on === DITS_IN_DASH) {
        setCurrentSignal({ state: "-" });
      } else if (signalCount.current.on < DITS_IN_DASH) {
        setCurrentSignal({ state: ".", count: signalCount.current.on });
      }
    }
  }

  const { estimateFps, signalState } = useProcessTick({
    videoDisplayed,
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
      <TelegraphButton setEyesClosed={setEyesClosed} />
    </>
  );
}

export default Main;

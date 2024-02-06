import React from "react";
import { SoundContext } from "../SoundProvider";

function MorseBeepManager({ eyesClosed }) {
  const { sounds } = React.useContext(SoundContext);
  const [playing, setPlaying] = React.useState(false);
  const beep = sounds.beep;

  React.useEffect(() => {
    const nowPlaying = eyesClosed.fromVideo || eyesClosed.fromButton;
    if (nowPlaying && playing) {
      return;
    } else if (nowPlaying && !playing) {
      beep?.restart();
      beep?.play();
      beep?.setLoop(true);
      setPlaying(true);
    } else if (!nowPlaying && playing) {
      beep?.reset();
      beep?.setLoop(false);
      setPlaying(false);
    } else if (!nowPlaying && !playing) {
      return;
    } else {
      console.error("MorseBeepManager: unexpected state");
    }
  }, [eyesClosed, playing, beep]);

  return <></>;
}

export default MorseBeepManager;

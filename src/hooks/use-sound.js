import React from "react";

function useSound({ audioPath }) {
  const audio = React.useRef(new Audio());

  const resetAudioPath = React.useCallback(() => {
    audio.current.src = audioPath;
  }, [audioPath]);

  const play = React.useCallback(() => {
    audio.current.play();
  }, [audio]);

  return { resetAudioPath, play };
}

export default useSound;

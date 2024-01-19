import React from "react";

function useSound({ audioPath, addAudioDependency }) {
  const audio = React.useRef(new Audio());

  const resetAudioPath = React.useCallback(() => {
    audio.current.src = audioPath;
  }, [audioPath]);

  React.useEffect(() => {
    addAudioDependency(resetAudioPath);
  }, [addAudioDependency, resetAudioPath]);

  const play = React.useCallback(() => {
    audio.current.play();
  }, [audio]);

  return { resetAudioPath, play };
}

export default useSound;

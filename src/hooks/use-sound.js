import React from "react";

function useSound({ audioPath, addAudioDependency, removeAudioDependency }) {
  const audio = React.useRef(new Audio());

  const resetAudioPath = React.useCallback(() => {
    console.log("RESET AUDIO PATH");
    audio.current.src = audioPath;
  }, [audioPath]);

  React.useEffect(() => {
    const key = crypto.randomUUID();

    addAudioDependency({ key, resetAudioPath });

    return () => {
      removeAudioDependency({ key });
    };
  }, [addAudioDependency, removeAudioDependency, resetAudioPath]);

  const play = React.useCallback(() => {
    audio.current.play();
  }, [audio]);

  return { resetAudioPath, play };
}

export default useSound;

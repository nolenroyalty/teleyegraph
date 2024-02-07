import React from "react";
import { SoundContext } from "../SoundProvider";

function useSound({ path, initialVolume, changeToForceAudioReset }) {
  const audio = React.useMemo(() => new Audio(path), [path]);
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(initialVolume);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
  const { muted } = React.useContext(SoundContext);

  const play = React.useCallback(() => {
    setPlaying(true);
  }, []);

  const stop = React.useCallback(() => {
    setPlaying(false);
  }, []);

  React.useEffect(() => {
    audio.volume = muted ? 0 : volume;
  }, [audio, muted, volume]);

  React.useEffect(() => {
    if (playing) {
      audio.currentTime = 0;
      audio.play();
    } else {
      audio.pause();
    }
  }, [audio, playing]);

  React.useEffect(() => {
    audio.src = path;
  }, [audio, path, changeToForceAudioReset]);

  React.useEffect(() => {
    audio.playbackRate = playbackSpeed;
  }, [audio, playbackSpeed]);

  return { play, stop, setVolume, setPlaybackSpeed };

  // const audio = React.useRef(new Audio());

  // const resetAudioPath = React.useCallback(() => {
  //   console.log("RESET AUDIO PATH");
  //   audio.current.src = audioPath;
  //   audio.current.volume = 0.15;
  // }, [audioPath]);

  // React.useEffect(() => {
  //   const key = crypto.randomUUID();

  //   addAudioDependency({ key, resetAudioPath });

  //   return () => {
  //     removeAudioDependency({ key });
  //   };
  // }, [addAudioDependency, removeAudioDependency, resetAudioPath]);

  // const play = React.useCallback(() => {
  //   audio.current.play();
  // }, [audio]);

  return { resetAudioPath, play };
}

export default useSound;

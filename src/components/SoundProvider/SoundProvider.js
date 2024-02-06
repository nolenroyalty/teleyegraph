import React from "react";

export const SoundContext = React.createContext();

/* So the deal is that we need to load all of our sounds in
  after a button is pressed so that they actually play. We do this
  when the user enables video. This just manages that process and provides
  a little sound API.
  */

const SOUNDS = [
  { name: "tick", path: "/block.mp3", volume: 0.15 },
  { name: "addChar", path: "/cymbal.mp3", volume: 0.15 },
  { name: "beep", path: "/morse-20-seconds.mp3", volume: 0.1 },
];

function SoundProvider({ children }) {
  const [sounds, setSounds] = React.useState({
    sounds: {},
    resetAudioPaths: () => {},
  });

  const createAudio = React.useCallback(({ path, volume }) => {
    const audio = new Audio(path);
    audio.volume = volume;
    const resetAudioPath = () => (audio.src = path);
    const play = () => audio?.play();
    const reset = () => {
      audio.pause();
      audio.currentTime = 0;
    };

    const restart = () => {
      audio.currentTime = 0;
      audio.volume = volume;
    };
    const setPlaybackSpeed = (speed) => (audio.playbackRate = speed);
    const setLoop = (loop) => (audio.loop = loop);
    const setVolume = (volume) => (audio.volume = volume);
    const obj = {
      audio,
      resetAudioPath,
      play,
      reset,
      setPlaybackSpeed,
      setLoop,
      setVolume,
      restart,
    };

    return obj;
  }, []);

  const resetAudioPaths = React.useCallback(() => {
    Object.values(sounds).forEach((sound) => {
      sound.resetAudioPath();
    });
    console.log("RESET ALL AUDIO PATHS");
    console.log({ sounds });
  }, [sounds]);

  React.useEffect(() => {
    const newSounds = SOUNDS.reduce((acc, { name, path, volume }) => {
      acc[name] = createAudio({ path, volume });
      return acc;
    }, {});
    setSounds(newSounds);
  }, [createAudio]);

  const value = React.useMemo(
    () => ({ sounds, resetAudioPaths }),
    [sounds, resetAudioPaths]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export default SoundProvider;

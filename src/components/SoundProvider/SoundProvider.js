import React from "react";

export const SoundContext = React.createContext();
const SOUNDS = [
  { name: "tick", path: "/block.mp3" },
  { name: "addChar", path: "/cymbal.mp3" },
];

function SoundProvider({ children }) {
  const [sounds, setSounds] = React.useState({
    sounds: {},
    resetAudioPaths: () => {},
  });

  const createAudio = React.useCallback(({ path }) => {
    const audio = new Audio(path);
    audio.volume = 0.15;
    const resetAudioPath = () => (audio.src = path);
    const play = () => audio?.play();
    const obj = { audio, resetAudioPath, play };

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
    const newSounds = SOUNDS.reduce((acc, { name, path }) => {
      acc[name] = createAudio({ path });
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
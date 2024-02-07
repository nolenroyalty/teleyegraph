import React from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { useEffectDebugger } from "../../utils";

export const SoundContext = React.createContext();

/* So the deal is that we need to load all of our sounds in
  after a button is pressed so that they actually play. We do this
  when the user enables video. This just manages that process and provides
  a little sound API.
  */

/* This is not the right way to handle this problem. If I could do it again I'd just
  wrap useAudioPlayer in my own custom hook that added the functions that I wanted and
  also took a "force reload" state variable that, via useEffect, caused a load.

  but I didn't do that. Here we are. */

function SoundProvider({ children }) {
  /* These need to be refs to prevent an infinite loop when we reset our audio paths.
  I'm kind of baffled about why - I think that when we call `load` on the audio we 
  get a new audio element, which causes `tick` (etc) to change. But I think that should
  really only cause one re-render - I guess maybe once an audio element has been loaded
  you get a totally new reference on every call to useAudioPlayer?
  */
  const tick = React.useRef(useAudioPlayer());
  const addChar = React.useRef(useAudioPlayer());
  const beep = React.useRef(useAudioPlayer());
  const [muted, setMuted] = React.useState(false);
  const [hasReset, setHasReset] = React.useState(false);

  const configureAudio = React.useCallback((audio, path, volume) => {
    console.log("CONFIGURE AUDIO");

    const play = () => {
      audio.current.seek(0);
      audio.current.setVolume(volume);
      audio.current.play();
    };

    const reload = () => {
      audio.current.load(path);
    };

    const reset = () => {
      audio.current.stop();
      audio.current.seek(0);
    };

    return {
      play,
      stop: audio.current.stop,
      setVolume: audio.current.setVolume,
      setRate: audio.current.setRate,
      fade: audio.current.fade,
      reload,
      reset,
      mute: audio.current.mute,
    };
  }, []);

  const sounds = React.useMemo(() => {
    console.log("CONFIGURE SOUNDS");

    return {
      tick: configureAudio(tick, "/block.mp3", 0.15),
      addChar: configureAudio(addChar, "/cymbal.mp3", 0.15),
      beep: configureAudio(beep, "/morse-20-seconds.mp3", 0.1),
    };
  }, [configureAudio]);

  const resetAudioPaths = React.useCallback(() => {
    console.log("RESET AUDIO PATHS");
    setHasReset(true);
  }, []);

  React.useEffect(() => {
    if (hasReset) {
      Object.values(sounds).forEach((sound) => {
        sound.reload();
      });
    }
  }, [sounds, hasReset]);

  React.useEffect(() => {
    console.log("SET MUTED");
    Object.values(sounds).forEach((sound) => {
      sound.mute(muted);
    });
  }, [sounds, muted]);

  const value = React.useMemo(() => {
    console.log("CREATE VALUE");
    return { sounds, resetAudioPaths, muted, setMuted };
  }, [sounds, resetAudioPaths, muted]);

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export default React.memo(SoundProvider);

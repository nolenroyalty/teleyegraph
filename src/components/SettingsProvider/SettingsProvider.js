import React from "react";
import { getFromLocalStorage, setToLocalStorage } from "../../utils";
export const SettingsContext = React.createContext();

const METRONOME_ENABLED = "metronome-enabled";
const SPEED_MULT = "speed-mult";
const FORCE_SHOW_MORSE_DISPLAY = "force-show-morse-display";

function SettingsProvider({ children }) {
  const [metronomeEnabled, _setMetronomeEnabled] = React.useState(() =>
    getFromLocalStorage(METRONOME_ENABLED, true)
  );
  const setMetronomeEnabled = React.useCallback((value) => {
    setToLocalStorage(METRONOME_ENABLED, value);
    _setMetronomeEnabled(value);
  }, []);

  const [speedMult, _setSpeedMult] = React.useState(() =>
    getFromLocalStorage(SPEED_MULT, 1)
  );

  const setSpeedMult = React.useCallback((value) => {
    setToLocalStorage(SPEED_MULT, value);
    _setSpeedMult(value);
  }, []);

  const [forceShowMorseDisplay, _setForceShowMorseDisplay] = React.useState(
    () => getFromLocalStorage(FORCE_SHOW_MORSE_DISPLAY, false)
  );

  const setForceShowMorseDisplay = React.useCallback((value) => {
    setToLocalStorage(FORCE_SHOW_MORSE_DISPLAY, value);
    _setForceShowMorseDisplay(value);
  }, []);

  const value = React.useMemo(() => {
    return {
      forceShowMorseDisplay,
      setForceShowMorseDisplay,
      metronomeEnabled,
      setMetronomeEnabled,
      speedMult,
      setSpeedMult,
    };
  }, [
    metronomeEnabled,
    setMetronomeEnabled,
    speedMult,
    setSpeedMult,
    forceShowMorseDisplay,
    setForceShowMorseDisplay,
  ]);
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;

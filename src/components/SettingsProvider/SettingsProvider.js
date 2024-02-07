import React from "react";
export const SettingsContext = React.createContext();

function SettingsProvider({ children }) {
  const [metronomeEnabled, setMetronomeEnabled] = React.useState(true);
  const [speedMult, setSpeedMult] = React.useState(1);
  const value = React.useMemo(() => {
    return { metronomeEnabled, setMetronomeEnabled, speedMult, setSpeedMult };
  }, [metronomeEnabled, setMetronomeEnabled, speedMult, setSpeedMult]);
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;

import React from "react";

function useStateRefCombo(initialValue) {
  // This is gross but we have a bunch of state that we want to be able
  // to update *and* read from our tick functions. We don't want *those*
  // functions to re-render when we change this state (because it causes
  // some thrasy behavior especially with request animation frame) - but
  // we do want to have the rest of our app re-render based on the state.
  // So we do this...
  const [state, _setState] = React.useState(initialValue);
  const ref = React.useRef(state);

  const setState = React.useCallback((newState) => {
    ref.current = newState;
    _setState(newState);
  }, []);

  return { state, setState, ref };
}

export default useStateRefCombo;

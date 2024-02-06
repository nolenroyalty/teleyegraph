import React from "react";

/* Maybe in the future this should provide a single object
with a nice API so you don't have to be as careful. But idk how
that works given that we want to be able to change its state.
ugh. */

function useStateRefCombo(initialValue) {
  // This is gross but we have a bunch of state that we want to be able
  // to update *and* read from our tick functions. We don't want *those*
  // functions to re-render when we change this state (because it causes
  // some thrasy behavior especially with request animation frame) - but
  // we do want to have the rest of our app re-render based on the state.
  // So we do this...
  const [state, _setState] = React.useState(initialValue);
  const ref = React.useRef(initialValue);

  const setState = React.useCallback(
    (newState) => {
      const _new =
        typeof newState === "function" ? newState(ref.current) : newState;
      ref.current = _new;
      _setState(_new);
    },
    [ref, _setState]
  );

  return { state, setState, ref };
}

export default useStateRefCombo;

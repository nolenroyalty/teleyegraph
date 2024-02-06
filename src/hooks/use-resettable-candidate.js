import React from "react";

/* Gross hack - we often want to preserve nice fade-ins / fade-outs
    when resetting a character or word. This happens when, for example, we're
    showing the character that we'd generate for the current signal and then
    the user closes their eyes, which changes the current signal. If we wiped
    the candidate immediately it wouldn't fade. Instead we just reset the count
    so that it fades out.

    We want to do a hard reset when we're adding a new character or word to the
    page, because that character/word will take the place of the candidate.

    Doing all of this means that we have to be more careful about managing
    our candidate state to avoid showing stale values, but it's worth it. */

function useResettableCandidate() {
  const [candidate, setCandidate] = React.useState({ count: 0 });
  const reset = React.useCallback(({ hard = false } = {}) => {
    setCandidate((c) => (hard ? { count: 0 } : { ...c, count: 0 }));
  }, []);

  return [candidate, setCandidate, reset];
}

export default useResettableCandidate;

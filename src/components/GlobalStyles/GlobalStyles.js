import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

/*
  Stolen from Josh's Custom CSS Reset
  https://www.joshwcomeau.com/css/custom-css-reset/
*/
*,
*::before,
*::after {
  box-sizing: border-box;
}
* {
  margin: 0;
}
html,
body {
  height: 100%;

  --color-black: hsla(240, 15%, 10%, 1);
  --color-grey-20: hsl(240, 15%, 20%);
  --color-grey-30: hsl(240, 15%, 30%);
  --color-grey-40: hsl(240, 15%, 40%);
  --color-grey-50: hsl(240, 10%, 50%);
  --color-white: hsl(240, 15%, 90%);

  --color-tan-200: hsl(37, 88%, 74%);
  --color-tan-300: hsl(36, 59%, 61%);
  --color-tan-400: hsl(33deg 78% 61%);
  --color-tan-500: hsl(30deg 77% 53%);

  --color-tan-800: hsl(20deg 64% 34%);
  --color-primary: hsl(271, 65%, 45%);

  color: var(--color-black);
}
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;

  font-family: "JMH Typewriter", sans-serif;
  font-weight: 400;

  background-image: 
    url("./noise.svg"),
    radial-gradient(circle at 100% 5%, 
    var(--color-tan-400) 5%, 
    var(--color-tan-300) 30%,
    var(--color-tan-300) 70%,
    var(--color-tan-500) 100%
    );

}
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}
input,
button,
textarea,
select {
  font: inherit;
}
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}
#root,
#__next {
  height: 100%;
  isolation: isolate;
}
`;

export default GlobalStyles;

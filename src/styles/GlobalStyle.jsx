import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&display=swap");

  :root {
    --font-body: Manrope, "Segoe UI", sans-serif;
    --font-display: "Noto Serif", Georgia, serif;

    --surface: #fbf9f5;
    --surface-container-low: #f5f3ef;
    --surface-container: #efeeea;
    --surface-container-high: #eae8e4;
    --surface-container-lowest: #ffffff;
    --outline-variant: #c2c9bb;

    --on-surface: #1b1c1a;
    --on-surface-variant: #42493e;

    --primary: #154212;
    --primary-container: #2d5a27;
    --on-primary: #ffffff;

    --tertiary-container: #7c3a55;
    --on-tertiary-container: #ffaac8;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: var(--font-body);
    color: var(--on-surface);
    background: var(--surface);
    line-height: 1.45;
  }

  h1,h2,h3,h4,p { margin: 0; }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,input {
    font: inherit;
  }

  #root {
    min-height: 100dvh;
  }
`
;
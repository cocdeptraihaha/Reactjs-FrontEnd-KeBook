import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap");

  :root {
    --font-body: "Nunito Sans", "Segoe UI", Arial, sans-serif;
    --font-display: "Nunito Sans", "Segoe UI", Arial, sans-serif;

    --surface: #faf6ef;
    --surface-ink: #17221b;
    --surface-elevated: #fffdf8;
    --surface-card: #f3eadc;
    --surface-card-strong: #e0d2bf;

    --text-primary: #201915;
    --text-secondary: #5b5046;
    --text-muted: #766a5e;

    --brand-950: #16321f;
    --brand-900: #1f4d2e;
    --brand-700: #347542;
    --brand-500: #609565;
    --berry-700: #82334d;
    --berry-600: #a44861;
    --gold-600: #b4782f;
    --blue-700: #315d7d;
    --danger-700: #8f2f3c;

    --line: #d8cfbf;
    --line-strong: #b8aa97;

    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-pill: 999px;

    --shadow-soft: 0 10px 28px rgba(32, 22, 10, 0.08);
    --shadow-card: 0 18px 44px rgba(40, 30, 18, 0.12);
    --shadow-lift: 0 18px 36px rgba(31, 77, 46, 0.16);
    --container-max: 1240px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  html,
  body {
    overflow-x: hidden;
  }

  body {
    margin: 0;
    background:
      linear-gradient(90deg, rgba(31, 77, 46, 0.028) 1px, transparent 1px),
      linear-gradient(rgba(31, 77, 46, 0.024) 1px, transparent 1px),
      radial-gradient(circle at 7% 3%, rgba(96, 149, 101, 0.13), transparent 32%),
      radial-gradient(circle at 92% 4%, rgba(164, 72, 97, 0.12), transparent 34%),
      var(--surface);
    background-size: 42px 42px, 42px 42px, auto, auto, auto;
    font-family: var(--font-body);
    color: var(--text-primary);
    line-height: 1.42;
    text-rendering: optimizeLegibility;
    font-size: 15px;
  }

  @media (min-width: 1200px) {
    body {
      line-height: 1.46;
    }
  }

  h1,
  h2,
  h3,
  h4,
  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  button {
    cursor: pointer;
  }

  button:disabled,
  [aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.58;
  }

  img {
    max-width: 100%;
  }

  :focus-visible {
    outline: 3px solid rgba(180, 120, 47, 0.62);
    outline-offset: 2px;
  }
`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint checks
- `npm run preview`: Locally preview production build

## Development Guidelines

- **React Best Practices**: Follow performance optimization patterns (parallelize fetches, optimize re-renders, use proper hooks like `useMemo`/`useCallback` where expensive).
- **Composition**: Prefer composition and compound components over boolean prop proliferation.
- **Vite/React**: Use standard Vite + React (HMR) workflow. React 19 features preferred (e.g., direct `ref` prop passing).
- **Execution Rule**: For implementation tasks, invoke Claude Code CLI and instruct Claude to perform coding work. Keep prompts concrete: scope, acceptance criteria, and required validation commands.

## Architecture

This is a standard React + Vite frontend application.

- `src/main.jsx`: Application entry point
- `src/App.jsx`: Main application component
- `src/assets/`: Static assets (images, logos)
- `public/`: Public static files (favicon, SVG icons)
- `vite.config.js`: Vite configuration
- `eslint.config.js`: ESLint configuration

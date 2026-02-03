# RPN Stack Calculator

A web-based **Reverse Polish Notation (RPN)** stack calculator built with React, TypeScript, and Vite. Enter numbers and operators in RPN order and watch the stack update with a clear visual.

## Features

- **RPN input**: Type a number, press Enter to push onto the stack; use `+`, `−`, `×`, `÷` to operate on the top two values.
- **Stack visualization**: Stack is shown on the right in an open-top “tube” with blocks for each value, plus **Top of the Stack** and **Size of the Stack**.
- **Slow-motion operations**: When you apply an operator (e.g. 2 + 2), an overlay shows the two operands merging into the result (e.g. 4) before the stack updates.
- **Stack operations**: Dup (duplicate top), Swap (swap top two), Drop (remove top), Clear.
- **Display rounding**: Long decimals (e.g. from 1÷3) are rounded for display (e.g. to 4 decimal places) while keeping full precision in the engine.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command       | Description                |
|---------------|----------------------------|
| `npm run dev` | Start dev server with HMR  |
| `npm run build` | Production build to `dist` |
| `npm run preview` | Preview production build  |
| `npm run lint` | Run ESLint                 |

## Tech stack

- React 19 + TypeScript
- Vite 7
- CSS (no UI framework)

## Project structure

- `src/App.tsx` – UI, reducer, and display formatting
- `src/App.css` – Layout and stack visual styles
- `src/engine/rpn.ts` – RPN engine (stack, push, apply op, dup, swap, drop, clear)

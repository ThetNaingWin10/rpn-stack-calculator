import { useReducer, useState, useCallback } from "react";
import "./App.css";
import {
  initialState,
  appendInput,
  pushInput,
  applyOp,
  clearAll,
  drop,
  dup,
  swap,
  type Op,
  type EngineState,
} from "./engine/rpn";

type Action =
  | { type: "APPEND"; value: string }
  | { type: "ENTER" }
  | { type: "OP"; op: Op }
  | { type: "CLEAR" }
  | { type: "DROP" }
  | { type: "DUP" }
  | { type: "SWAP" };

function reducer(state: EngineState, action: Action): EngineState {
  switch (action.type) {
    case "APPEND":
      return appendInput(state, action.value);
    case "ENTER":
      return pushInput(state);
    case "OP":
      return applyOp(state, action.op);
    case "CLEAR":
      return clearAll();
    case "DROP":
      return drop(state);
    case "DUP":
      return dup(state);
    case "SWAP":
      return swap(state);
    default:
      return state;
  }
}

function computeResult(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return NaN;
  }
}

const OP_SYMBOL: Record<Op, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const ANIMATION_DURATION_MS = 1600;

/** Format a number for display: round to 4 decimal places to avoid long floats like 0.3333333333333333 */
function formatDisplayValue(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Number.isInteger(n)) return String(n);
  const rounded = Math.round(n * 1e4) / 1e4;
  return rounded === Math.round(rounded) ? String(Math.round(rounded)) : String(rounded);
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [opAnimation, setOpAnimation] = useState<{
    a: number;
    b: number;
    op: Op;
    result: number;
  } | null>(null);

  const handleOp = useCallback(
    (op: Op) => {
      if (state.stack.length < 2) return;
      const [b, a] = state.stack;
      const result = computeResult(a, b, op);
      if (op === "/" && b === 0) {
        dispatch({ type: "OP", op });
        return;
      }
      setOpAnimation({ a, b, op, result });
      setTimeout(() => {
        dispatch({ type: "OP", op });
        setOpAnimation(null);
      }, ANIMATION_DURATION_MS);
    },
    [state.stack]
  );

  return (
    <div className="app">
      <header className="header">
        <h1>RPN Stack Calculator</h1>
      </header>

      <div className="main-layout">
        <div className="calculator">
          <div className="input-wrap">
            <input
              className="input"
              value={state.input}
              placeholder="Type number, press Enter"
              readOnly
            />
          </div>

          <div className="keypad">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."].map((n) => (
          <button
            key={n}
            onClick={() => dispatch({ type: "APPEND", value: n })}
          >
            {n}
          </button>
        ))}
        <button
          className="enter"
          onClick={() => dispatch({ type: "ENTER" })}
        >
          Enter
        </button>
      </div>

      <div className="ops-row">
        {(["+", "-", "*", "/"] as const).map((op) => (
          <button
            key={op}
            disabled={state.stack.length < 2 || opAnimation !== null}
            onClick={() => handleOp(op)}
          >
            {OP_SYMBOL[op]}
          </button>
        ))}
      </div>

      <div className="stack-ops">
        <button
          onClick={() => dispatch({ type: "DUP" })}
          disabled={state.stack.length === 0 || opAnimation !== null}
        >
          Dup
        </button>
        <button
          onClick={() => dispatch({ type: "SWAP" })}
          disabled={state.stack.length < 2 || opAnimation !== null}
        >
          Swap
        </button>
        <button
          onClick={() => dispatch({ type: "DROP" })}
          disabled={state.stack.length === 0 || opAnimation !== null}
        >
          Drop
        </button>
        <button
          className="clear"
          onClick={() => dispatch({ type: "CLEAR" })}
        >
          Clear
        </button>
      </div>

          {state.error && <div className="error">{state.error}</div>}
        </div>

        <aside className="stack-visual">
          <div className="stack-container">
            {state.stack.length === 0 ? (
              <div className="stack-block stack-block--empty">Empty</div>
            ) : (
              state.stack.map((v, i) => (
                <div key={`${i}-${v}`} className="stack-block">
                  {formatDisplayValue(v)}
                </div>
              ))
            )}
          </div>
          <h2 className="stack-visual-title">Stack</h2>
          <div className="stack-info">
            <div className="stack-info-row">
              <span className="stack-info-label">Top of the Stack :-</span>
              <span className="stack-info-value">
                {state.stack.length > 0 ? formatDisplayValue(state.stack[0]) : "—"}
              </span>
            </div>
            <div className="stack-info-row">
              <span className="stack-info-label">Size of the Stack :-</span>
              <span className="stack-info-value">{state.stack.length}</span>
            </div>
          </div>
        </aside>
      </div>

      {opAnimation && (
        <div className="op-animation phase-merge" aria-hidden>
          <div className="op-animation-inner">
            <span className="op-operand">{opAnimation.a}</span>
            <span className="op-operator">{OP_SYMBOL[opAnimation.op]}</span>
            <span className="op-operand">{opAnimation.b}</span>
            <span className="op-result-wrap">
              <span className="op-result">= {formatDisplayValue(opAnimation.result)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export type Op = "+" | "-" | "*" | "/";

export type EngineState = {
  stack: number[];
  input: string;
  error: string | null;
};

export const initialState: EngineState = {
  stack: [],
  input: "",
  error: null,
};

export function appendInput(state: EngineState, s: string): EngineState {
  return { ...state, input: state.input + s, error: null };
}

export function backspace(state: EngineState): EngineState {
  return { ...state, input: state.input.slice(0, -1) };
}

export function pushInput(state: EngineState): EngineState {
  if (state.input.trim() === "") return state;

  const value = Number(state.input);
  if (!Number.isFinite(value)) {
    return { ...state, error: "Invalid number", input: "" };
  }

  return {
    stack: [value, ...state.stack],
    input: "",
    error: null,
  };
}

export function applyOp(state: EngineState, op: Op): EngineState {
  if (state.stack.length < 2) {
    return { ...state, error: "Need at least two values" };
  }

  const [b, a, ...rest] = state.stack;

  let result: number;
  switch (op) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) return { ...state, error: "Division by zero" };
      result = a / b;
      break;
  }

  return { stack: [result, ...rest], input: "", error: null };
}

export function clearAll(): EngineState {
  return { ...initialState };
}

export function drop(state: EngineState): EngineState {
  return { ...state, stack: state.stack.slice(1) };
}

export function dup(state: EngineState): EngineState {
  if (state.stack.length === 0) return state;
  return { ...state, stack: [state.stack[0], ...state.stack] };
}

export function swap(state: EngineState): EngineState {
  if (state.stack.length < 2) return state;
  const [a, b, ...rest] = state.stack;
  return { ...state, stack: [b, a, ...rest] };
}
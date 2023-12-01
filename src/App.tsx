import { assign, createMachine, interpret } from "xstate";
import { produce } from "immer";

const initMachine = createMachine(
  {
    id: "init",
    initial: "idle",
    states: {
      idle: { on: { SET_CONTEXT: "selected" } },
      selected: { on: { RESET: "idle" } },
    },
    context: { value: undefined },
    on: {
      SET_CONTEXT: { actions: "setContext" },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      setContext: assign((context, { value }) => {
        console.log("value", value);
        return produce(context, (draft) => {
          draft.value = value;
        });
      }),
    },
  }
);

function App() {
  const initActor = interpret(initMachine);
  initActor.start();

  initActor.subscribe((state) => {
    console.log("state.value", state.value);
    console.log("state.context", state.context);
  });

  function handleChange(e) {
    const value = e.currentTarget.value;
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(value), 1000);
    });
    promise.then((value) => {
      initActor.send({ type: "SET_CONTEXT", value });
    });
  }
  return (
    <>
      <select onChange={handleChange}>
        <option value="one">One</option>
        <option value="two">Two</option>
      </select>
    </>
  );
}

export default App;

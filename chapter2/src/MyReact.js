import { createHooks } from "./hooks.js";
import { render as updateElement, jsx } from "./render.js";

function MyReact() {
  const _render = () => {};

  function render($root, rootComponent) {
    updateElement($root, rootComponent());
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();

let fn = null;
const App = () => {
  const [size, setSize] = MyReact().useState(1);

  fn = setSize;
  return jsx(
    "div",
    null,
    ...Array.from({ length: size }).map((_, key) =>
      jsx("p", null, `${key + 1}번째 자식`)
    )
  );
};

const $root = document.createElement("div");
MyReact().render($root, App);
fn(1);

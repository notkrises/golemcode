import { useState } from "react";
import { StatusBar } from "./status-bar";

export function InputBar() {
  // React "state": a value + a function to change it. Calling setValue
  // re-renders this component with the new value on screen.
  const [value, setValue] = useState("");

  return (
    <box flexDirection="column">
      <box border borderStyle="rounded" borderColor="#A855F7" paddingX={1}>
        <input
          focused
          value={value}
          onInput={setValue}
          onSubmit={() => setValue("")}
          placeholder="Ask GolemCode anything…"
          placeholderColor="#6E6A7A"
          textColor="#F4F4F5"
          cursorColor="#A855F7"
        />
      </box>
      <box paddingX={1}>
        <StatusBar />
      </box>
    </box>
  );
}

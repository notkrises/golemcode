import { useState } from "react";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { ACCENTS } from "./components/command-menu/commands";

function App() {
  // The accent lives here — the closest shared parent — so both the
  // Header and the InputBar (and everything inside it) can read it.
  const [accent, setAccent] = useState(ACCENTS[0]!.color);

  return (
    <box
      flexDirection="column"
      backgroundColor="#0D0D12"
      width="100%"
      height="100%">
      <box flexGrow={1} alignItems="center" justifyContent="center" gap={2}>
        <Header accent={accent} />
      </box>
      <box paddingX={1} paddingBottom={0}>
        <InputBar accent={accent} onAccentChange={setAccent} onSubmit={() => {}} />
      </box>
    </box>
  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false,
});
createRoot(renderer).render(<App />);

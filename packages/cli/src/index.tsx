import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";

function App() {
  return (
    <box
      flexDirection="column"
      backgroundColor="#0D0D12"
      width="100%"
      height="100%">
      <box flexGrow={1} alignItems="center" justifyContent="center" gap={2}>
        <Header />
      </box>
      <box paddingX={1} paddingBottom={0}>
        <InputBar onSubmit={() => {}} />
      </box>
    </box>
  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false,
});
createRoot(renderer).render(<App />);

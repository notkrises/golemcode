import { TextAttributes } from "@opentui/core";

export function StatusBar() {
  // Hardcoded for now — later in the course these come from providers
  // (prompt-config for mode/model, theme for colors), like in nightcode.
  const mode = "Build";
  const model = "claude-sonnet-5";

  return (
    <box flexDirection="row" gap={1}>
      <text fg="#A855F7">{mode}</text>
      <text attributes={TextAttributes.DIM} fg="#71717A">
        ›
      </text>
      <text fg="#F4F4F5">{model}</text>
    </box>
  );
}

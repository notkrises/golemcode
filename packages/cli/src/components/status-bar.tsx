import { TextAttributes } from "@opentui/core";

type Props = {
  mode: "Build" | "Plan";
};

export function StatusBar({ mode }: Props) {
  // Model is still hardcoded — later it comes from a prompt-config provider.
  const model = "claude-sonnet-5";

  return (
    <box flexDirection="row" gap={1}>
      <text fg={mode === "Build" ? "#A855F7" : "#EF4444"}>{mode}</text>
      <text attributes={TextAttributes.DIM} fg="#71717A">
        ›
      </text>
      <text fg="#F4F4F5">{model}</text>
    </box>
  );
}

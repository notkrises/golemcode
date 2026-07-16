import { TextAttributes } from "@opentui/core";
import type { ModeType, SupportedChatModelId } from "./command-menu/types";

// Exported so the input bar's rail uses the exact same red — one source
// of truth prevents the two from drifting apart.
export const PLAN_COLOR = "#EF4444";

type Props = {
  mode: ModeType;
  model: SupportedChatModelId;
  accent: string;
  toast: string | null;
};

export function StatusBar({ mode, model, accent, toast }: Props) {
  return (
    <box flexDirection="row" gap={1} width="100%">
      <text fg={mode === "Build" ? accent : PLAN_COLOR}>{mode}</text>
      <text attributes={TextAttributes.DIM} fg="#71717A">
        ›
      </text>
      <text fg="#F4F4F5">{model}</text>
      {/* Spacer: eats the leftover width so the toast sits at the right edge */}
      <box flexGrow={1} />
      {toast && (
        <box flexShrink={1} overflow="hidden">
          <text attributes={TextAttributes.DIM} fg="#B4B0C2">
            {toast}
          </text>
        </box>
      )}
    </box>
  );
}

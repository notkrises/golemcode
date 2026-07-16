import { useRef, useState } from "react";
import type { KeyBinding, TextareaRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { EmptyBorder } from "./border";
import { StatusBar } from "./status-bar";

// A textarea inserts a newline on Enter by default. These bindings flip that:
// plain Enter submits, Shift+Enter makes a newline.
export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

export function InputBar() {
  // Ref = a direct handle to the textarea, for reading/clearing its text.
  const textareaRef = useRef<TextareaRenderable>(null);
  const [mode, setMode] = useState<"Build" | "Plan">("Build");

  // Global key listener: Tab toggles the mode (preventDefault stops the
  // tab character from also being typed into the textarea).
  useKeyboard((key) => {
    if (key.name === "tab") {
      key.preventDefault();
      setMode((current) => (current === "Build" ? "Plan" : "Build"));
    }
  });

  const handleSubmit = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const prompt = textarea.plainText.trim();
    if (prompt.length === 0) return;

    // Later: send the prompt to the AI. For now, just clear the field.
    textarea.setText("");
  };

  return (
    <box flexDirection="column">
      <box
        border={["left"]}
        borderColor={mode === "Build" ? "#A855F7" : "#EF4444"}
        customBorderChars={{ ...EmptyBorder, vertical: "┃", bottomLeft: "╹" }}
        width="100%"
      >
        <box
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor="#16151D"
          width="100%"
        >
          <textarea
            ref={textareaRef}
            focused
            keyBindings={TEXTAREA_KEY_BINDINGS}
            onSubmit={handleSubmit}
            placeholder="Ask GolemCode anything…"
            placeholderColor="#6E6A7A"
            textColor="#F4F4F5"
            backgroundColor="#16151D"
            cursorColor="#A855F7"
            maxHeight={6}
          />
        </box>
      </box>
      <box paddingX={1}>
        <StatusBar mode={mode} />
      </box>
    </box>
  );
}

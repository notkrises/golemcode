import { useEffect, useRef, useState } from "react";
import type { KeyBinding, TextareaRenderable } from "@opentui/core";
import { useKeyboard, useRenderer } from "@opentui/react";
import { EmptyBorder } from "./border";
import { StatusBar, PLAN_COLOR } from "./status-bar";
import { CommandMenu } from "./command-menu";
import { MODELS } from "./command-menu/commands";
import type { Command, ModeType } from "./command-menu/types";
import { useCommandMenu } from "./command-menu/use-command-menu";

// A textarea inserts a newline on Enter by default. These bindings flip that:
// plain Enter submits, Shift+Enter makes a newline.
export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

const TOAST_MIN_DURATION_MS = 2500;
const TOAST_MS_PER_CHAR = 60;

type Props = {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  accent: string;
  onAccentChange: (color: string) => void;
};

export function InputBar({ onSubmit, disabled = false, accent, onAccentChange }: Props) {
  // Ref = a direct handle to the textarea, for reading/clearing its text.
  const textareaRef = useRef<TextareaRenderable>(null);
  const [mode, setMode] = useState<ModeType>("Build");
  const [model, setModel] = useState(MODELS[0]!);
  const renderer = useRenderer();

  // Toast: a short-lived message in the status row. The ref remembers the
  // pending timer so a new toast cancels the old one's cleanup.
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    // Longer messages stay up longer — scaled to reading time.
    const duration = Math.max(
      TOAST_MIN_DURATION_MS,
      message.length * TOAST_MS_PER_CHAR,
    );
    toastTimer.current = setTimeout(() => setToast(null), duration);
  };
  // Clean the timer up if the component ever unmounts mid-toast.
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu();

  // Global key listener. Tab toggles the mode (preventDefault stops the
  // tab character from also being typed into the textarea). Ctrl+C clears
  // a non-empty input; on an empty input it quits — needed because the
  // renderer is created with exitOnCtrlC: false.
  useKeyboard((key) => {
    if (disabled) return;

    if (key.name === "tab") {
      key.preventDefault();
      setMode((current) => (current === "Build" ? "Plan" : "Build"));
    }

    if (key.ctrl && key.name === "c") {
      key.preventDefault();
      const textarea = textareaRef.current;
      if (textarea && textarea.plainText.length > 0) {
        textarea.setText("");
      } else {
        renderer.destroy();
      }
    }
  });

  // The textarea's onContentChange event carries no text — read it from the ref.
  const handleTextareaContentChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    handleContentChange(textarea.plainText);
  };

  const handleCommand = (command: Command | undefined) => {
    const textarea = textareaRef.current;
    if (!textarea || !command) return;

    textarea.setText("");

    if (command.action) {
      command.action({
        exit: () => renderer.destroy(),
        // No router yet — /new will navigate to a fresh session later.
        navigate: () => {},
        mode,
        setMode,
        model,
        setModel,
        accent,
        setAccent: onAccentChange,
        toast: showToast,
      });
    } else {
      textarea.insertText(command.value + " ");
    }
  };

  const handleCommandExecute = (index: number) => {
    handleCommand(resolveCommand(index));
  };

  const handleSubmit = () => {
    if (disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const prompt = textarea.plainText.trim();
    if (prompt.length === 0) return;

    // Hand the prompt up to App — in a later chapter this reaches the AI.
    onSubmit(prompt);
    textarea.setText("");
  };

  // Enter means "run the highlighted command" while the menu is open,
  // and "submit the prompt" otherwise.
  const handleTextareaSubmit = () => {
    if (showCommandMenu) {
      handleCommand(resolveCommand(selectedIndex));
      return;
    }
    handleSubmit();
  };

  return (
    <box flexDirection="column">
      <box
        border={["left"]}
        borderColor={mode === "Build" ? accent : PLAN_COLOR}
        customBorderChars={{ ...EmptyBorder, vertical: "┃", bottomLeft: "╹" }}
        width="100%"
      >
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor="#16151D"
          width="100%"
        >
          {showCommandMenu && (
            <box
              position="absolute"
              bottom="100%"
              left={0}
              width="100%"
              backgroundColor="#16151D"
              zIndex={10}
            >
              <CommandMenu
                query={commandQuery}
                selectedIndex={selectedIndex}
                scrollRef={scrollRef}
                accent={accent}
                onSelect={setSelectedIndex}
                onExecute={handleCommandExecute}
              />
            </box>
          )}
          <textarea
            ref={textareaRef}
            focused
            keyBindings={TEXTAREA_KEY_BINDINGS}
            onSubmit={handleTextareaSubmit}
            onContentChange={handleTextareaContentChange}
            placeholder="Ask GolemCode anything…"
            placeholderColor="#6E6A7A"
            textColor="#F4F4F5"
            backgroundColor="#16151D"
            cursorColor={accent}
            maxHeight={6}
          />
        </box>
      </box>
      <box paddingX={1}>
        <StatusBar mode={mode} model={model} accent={accent} toast={toast} />
      </box>
    </box>
  );
}

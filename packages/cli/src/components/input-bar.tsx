import { useRef, useState } from "react";
import type { KeyBinding, TextareaRenderable } from "@opentui/core";
import { useKeyboard, useRenderer } from "@opentui/react";
import { EmptyBorder } from "./border";
import { StatusBar } from "./status-bar";
import { CommandMenu } from "./command-menu";
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

export function InputBar() {
  // Ref = a direct handle to the textarea, for reading/clearing its text.
  const textareaRef = useRef<TextareaRenderable>(null);
  const [mode, setMode] = useState<ModeType>("Build");
  const renderer = useRenderer();

  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu();

  // Global key listener: Tab toggles the mode (preventDefault stops the
  // tab character from also being typed into the textarea).
  useKeyboard((key) => {
    if (key.name === "tab") {
      key.preventDefault();
      setMode((current) => (current === "Build" ? "Plan" : "Build"));
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
        // No model registry yet — /models will use this later.
        setModel: () => {},
      });
    } else {
      textarea.insertText(command.value + " ");
    }
  };

  const handleCommandExecute = (index: number) => {
    handleCommand(resolveCommand(index));
  };

  const handleSubmit = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const prompt = textarea.plainText.trim();
    if (prompt.length === 0) return;

    // Later: send the prompt to the AI. For now, just clear the field.
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
        borderColor={mode === "Build" ? "#A855F7" : "#EF4444"}
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

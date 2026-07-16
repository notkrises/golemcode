import { useRef, useState, useMemo, type RefObject } from "react";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { getFilteredCommands } from "./filter-commands";
import type { Command } from "./types";

type UseCommandMenuReturn = {
  showCommandMenu: boolean;
  commandQuery: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  handleContentChange: (text: string) => void;
  resolveCommand: (index: number) => Command | undefined;
  setSelectedIndex: (index: number) => void;
};

export function useCommandMenu(): UseCommandMenuReturn {
  const [textValue, setTextValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  const commandQuery =
    showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

  const filteredCommands = useMemo(
    () => getFilteredCommands(commandQuery),
    [commandQuery],
  );

  const close = () => {
    setShowCommandMenu(false);
  };

  const handleContentChange = (text: string) => {
    setTextValue(text);
    setSelectedIndex(0);

    // Jump back to the top of the list when the user types a new character
    const scrollbox = scrollRef.current;
    if (scrollbox) {
      scrollbox.scrollTo(0);
    }

    // The menu is open while the text is "/something" with no space yet
    const prefix = text.startsWith("/") ? text.slice(1) : null;
    if (prefix !== null && !prefix.includes(" ")) {
      setShowCommandMenu(true);
    } else {
      close();
    }
  };

  // Resolve a command at an index (returns it; the caller executes)
  const resolveCommand = (index: number): Command | undefined => {
    const command = filteredCommands[index];
    if (command) {
      close();
    }
    return command;
  };

  // Scroll the list so a given row is on screen, whichever direction it
  // drifted off — the user may have wheel-scrolled between keypresses.
  const ensureVisible = (index: number) => {
    const sb = scrollRef.current;
    if (!sb) return;
    const viewportHeight = sb.viewport.height;
    if (index < sb.scrollTop) {
      sb.scrollTo(index);
    } else if (index > sb.scrollTop + viewportHeight - 1) {
      sb.scrollTo(index - viewportHeight + 1);
    }
  };

  // Arrow keys move the selection; the list scrolls along when the
  // highlight goes off-screen. Escape closes the menu.
  useKeyboard((key) => {
    if (!showCommandMenu) return;

    if (key.name === "escape") {
      key.preventDefault();
      close();
    } else if (key.name === "up") {
      key.preventDefault();
      setSelectedIndex((i) => {
        const newIndex = Math.max(0, i - 1);
        ensureVisible(newIndex);
        return newIndex;
      });
    } else if (key.name === "down") {
      key.preventDefault();
      setSelectedIndex((i) => {
        if (filteredCommands.length === 0) {
          return 0;
        }

        const newIndex = Math.min(filteredCommands.length - 1, i + 1);
        ensureVisible(newIndex);
        return newIndex;
      });
    }
  });

  return {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  };
}

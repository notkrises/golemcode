// In nightcode these come from providers and @nightcode/shared:
//   toast: ToastContextValue, dialog: DialogContextValue,
//   ModeType / SupportedChatModelId from the shared package.
// We define local stand-ins until those exist.
export type ModeType = "Build" | "Plan";
export type SupportedChatModelId = string;

export type CommandContext = {
  exit: () => void;
  navigate: (path: string) => void;
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  setModel: (model: SupportedChatModelId) => void;
};

export type Command = {
  name: string;
  description: string;
  value: string;
  action?: (ctx: CommandContext) => void | Promise<void>;
};

import type { Command } from "./types";

export const MODELS = ["claude-sonnet-5", "claude-opus-4-8", "gpt-5.4"];

// shade = the darker companion color used for the header's ascii-art shadow.
export const ACCENTS = [
  { name: "Violet", color: "#A855F7", shade: "#6B21A8" },
  { name: "Cyan", color: "#22D3EE", shade: "#0E7490" },
  { name: "Mono", color: "#F4F4F5", shade: "#71717A" },
];

export const COMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a new conversation",
    value: "/new",
    action: (ctx) => {
      ctx.navigate("/");
      ctx.toast("Conversations arrive in a later chapter");
    },
  },
  {
    name: "models",
    description: "Select AI model for generation",
    value: "/models",
    action: (ctx) => {
      const index = MODELS.indexOf(ctx.model);
      const next = MODELS[(index + 1) % MODELS.length]!;
      ctx.setModel(next);
      ctx.toast(`Model → ${next}`);
    },
  },
  {
    name: "theme",
    description: "Change color theme",
    value: "/theme",
    action: (ctx) => {
      const index = ACCENTS.findIndex((a) => a.color === ctx.accent);
      const next = ACCENTS[(index + 1) % ACCENTS.length]!;
      ctx.setAccent(next.color);
      ctx.toast(`Theme → ${next.name}`);
    },
  },
  {
    name: "agents",
    description: "Switch agents",
    value: "/agents",
    action: (ctx) => {
      ctx.toast("Agents arrive in a later chapter");
    },
  },
  {
    name: "sessions",
    description: "Browse past sessions",
    value: "/sessions",
    action: (ctx) => {
      ctx.toast("Sessions arrive in a later chapter");
    },
  },
  {
    name: "login",
    description: "Sign in with your browser",
    value: "/login",
    action: (ctx) => {
      ctx.toast("Auth arrives in a later chapter");
    },
  },
  {
    name: "logout",
    description: "Sign out",
    value: "/logout",
    action: (ctx) => {
      ctx.toast("Auth arrives in a later chapter");
    },
  },
  {
    name: "upgrade",
    description: "Buy more credits",
    value: "/upgrade",
    action: (ctx) => {
      ctx.toast("Billing arrives in a later chapter");
    },
  },
  {
    name: "usage",
    description: "Open billing portal in your browser",
    value: "/usage",
    action: (ctx) => {
      ctx.toast("Usage tracking arrives in a later chapter");
    },
  },
  {
    name: "help",
    description: "Show keyboard shortcuts",
    value: "/help",
    action: (ctx) => {
      ctx.toast("Tab: mode · /: commands · Shift+Enter: newline");
    },
  },
  {
    name: "golem",
    description: "???",
    value: "/golem",
    action: (ctx) => {
      ctx.toast("The golem stirs… ready to build.");
    },
  },
  {
    name: "exit",
    description: "Quit the application",
    value: "/exit",
    action: (ctx) => {
      ctx.exit();
    },
  },
];

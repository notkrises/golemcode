import { ACCENTS } from "./command-menu/commands";

type Props = {
  accent: string;
};

export function Header({ accent }: Props) {
  // Each accent has a matching darker "shade" for the ascii-art shadow layer.
  const shade = ACCENTS.find((a) => a.color === accent)?.shade ?? "#6B21A8";

  return (
    <box justifyContent="center" alignItems="center">
      <box flexDirection="row" justifyContent="center" gap={0.5} alignItems="center">
        <ascii-font font="block" text="Golem" color={[accent, shade]} />
        <ascii-font font="block" text="Code" color={["#F4F4F5", "#71717A"]} />
      </box>
    </box>
  );
}

export function Header() {
  return (
    <box justifyContent="center" alignItems="center">
      <box flexDirection="row" justifyContent="center" gap={0.5} alignItems="center">
        <ascii-font font="block" text="Golem" color={["#A855F7", "#6B21A8"]} />
        <ascii-font font="block" text="Code" color={["#F4F4F5", "#71717A"]} />
      </box>
    </box>
  );
}
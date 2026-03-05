export default function DashboardGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(1200px 520px at 20% -10%, rgba(80,192,240,0.22), transparent 62%), radial-gradient(900px 420px at 80% 0%, rgba(80,192,240,0.12), transparent 68%), radial-gradient(900px 600px at 50% 120%, rgba(255,255,255,0.07), transparent 60%)",
      }}
    />
  );
}

interface Props {
  children: React.ReactNode;
  variant?: "accent" | "gray" | "green" | "red";
}

export default function Badge({ children, variant = "gray" }: Props) {
  const styles = {
    accent: { background: "var(--accent-light)", color: "var(--accent-text)" },
    gray: { background: "var(--bg-hover)", color: "var(--text-secondary)" },
    green: { background: "#dcfce7", color: "#15803d" },
    red: { background: "var(--danger-light)", color: "var(--danger)" },
  };
  return (
    <span
      style={{ ...styles[variant], fontSize: "0.7rem", fontWeight: 500 }}
      className="px-2 py-0.5 rounded-full whitespace-nowrap"
    >
      {children}
    </span>
  );
}

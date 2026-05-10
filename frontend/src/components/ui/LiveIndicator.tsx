export default function LiveIndicator({ count }: { count: number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 20,
        background: "var(--accent-bg)",
        border: "1px solid var(--accent-bg)",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--accent-text)",
      }}
    >
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          width: 8,
          height: 8,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "var(--accent)",
            opacity: 0.6,
            animation: "ping 1.2s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "block",
          }}
        />
      </span>
      {count} {count === 1 ? "reader" : "readers"}
      <style>{`@keyframes ping { 75%,100%{transform:scale(2);opacity:0} }`}</style>
    </div>
  );
}

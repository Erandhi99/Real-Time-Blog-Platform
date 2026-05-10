interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | string)[]>((acc, p, i, arr) => {
      if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  const btn = (active: boolean, disabled = false) => ({
    minWidth: 32,
    height: 32,
    padding: "0 10px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: disabled ? "not-allowed" : "pointer",
    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    background: active ? "var(--accent)" : "var(--surface)",
    color: active ? "#fff" : disabled ? "var(--text3)" : "var(--text2)",
    opacity: disabled ? 0.45 : 1,
    transition: "all 0.12s",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        marginTop: 28,
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={btn(false, page === 1)}
      >
        ← Prev
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`e${i}`}
            style={{
              lineHeight: "32px",
              color: "var(--text3)",
              padding: "0 4px",
            }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            style={btn(p === page)}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={btn(false, page === totalPages)}
      >
        Next →
      </button>
    </div>
  );
}

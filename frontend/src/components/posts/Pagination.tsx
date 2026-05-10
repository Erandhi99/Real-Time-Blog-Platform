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
      if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  const btnBase =
    "px-3 py-1.5 text-sm rounded-lg border transition font-medium";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={btnBase}
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
          color: page === 1 ? "var(--text-muted)" : "var(--text-primary)",
          opacity: page === 1 ? 0.4 : 1,
        }}
      >
        ← Prev
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e-${i}`}
            style={{ color: "var(--text-muted)" }}
            className="px-1"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={btnBase}
            style={{
              borderColor: p === page ? "var(--accent)" : "var(--border)",
              background: p === page ? "var(--accent)" : "var(--bg-card)",
              color: p === page ? "white" : "var(--text-primary)",
            }}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={btnBase}
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
          color:
            page === totalPages ? "var(--text-muted)" : "var(--text-primary)",
          opacity: page === totalPages ? 0.4 : 1,
        }}
      >
        Next →
      </button>
    </div>
  );
}

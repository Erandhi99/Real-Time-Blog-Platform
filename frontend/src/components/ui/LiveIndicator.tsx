interface Props {
  count: number;
}

export default function LiveIndicator({ count }: Props) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
      style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ background: "var(--accent)" }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: "var(--accent)" }}
        />
      </span>
      {count} {count === 1 ? "reader" : "readers"} live
    </div>
  );
}

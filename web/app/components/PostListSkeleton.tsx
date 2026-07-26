const PLACEHOLDER_CARDS = Array.from({ length: 6 });

export default function PostListSkeleton() {
  return (
    <div role="status" aria-label="Cargando entradas">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_CARDS.map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="tile-2 flex animate-pulse flex-col gap-3 p-6"
          >
            <div className="h-5 w-5 rounded-full bg-ink-35" />
            <div className="h-5 w-4/5 rounded bg-ink-35" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full rounded bg-ink-35" />
              <div className="h-3 w-2/3 rounded bg-ink-35" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

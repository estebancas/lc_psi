const PLACEHOLDER_CARDS = Array.from({ length: 6 });

export default function PostListSkeleton() {
  return (
    <div role="status" aria-label="Cargando entradas">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_CARDS.map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="animate-pulse rounded-xl border border-black/10 p-6 dark:border-white/10"
          >
            <div className="h-3 w-24 rounded bg-black/10 dark:bg-white/10" />
            <div className="mt-3 h-5 w-4/5 rounded bg-black/10 dark:bg-white/10" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-black/10 dark:bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-black/10 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

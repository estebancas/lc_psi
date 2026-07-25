export default function PostSkeleton() {
  return (
    <div role="status" aria-label="Cargando artículo">
      <div aria-hidden="true" className="animate-pulse">
        <div className="h-3 w-40 rounded bg-black/10 dark:bg-white/10" />
        <div className="mt-4 h-8 w-3/4 rounded bg-black/10 dark:bg-white/10" />
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-full rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-5/6 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-full rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-4/5 rounded bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

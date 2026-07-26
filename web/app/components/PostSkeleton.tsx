export default function PostSkeleton() {
  return (
    <div role="status" aria-label="Cargando artículo">
      <div aria-hidden="true" className="animate-pulse">
        <div className="h-3 w-40 rounded bg-ink-35" />
        <div className="mt-4 h-9 w-3/4 rounded bg-ink-35" />
        <div className="mt-9 flex flex-col gap-3">
          <div className="h-4 w-full rounded bg-ink-35" />
          <div className="h-4 w-full rounded bg-ink-35" />
          <div className="h-4 w-5/6 rounded bg-ink-35" />
          <div className="h-4 w-full rounded bg-ink-35" />
          <div className="h-4 w-2/3 rounded bg-ink-35" />
          <div className="h-4 w-4/5 rounded bg-ink-35" />
        </div>
      </div>
    </div>
  );
}

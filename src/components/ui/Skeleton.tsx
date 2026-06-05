import { cn } from '../../utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-2xl bg-ink/5 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)]',
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="cosmic-card rounded-[1.5rem] p-3">
      <Skeleton className="aspect-[4/5] rounded-2xl bg-white/10" />
      <div className="p-2 pt-4">
        <Skeleton className="h-5 w-3/4 bg-white/10" />
        <Skeleton className="mt-3 h-4 w-1/2 bg-white/10" />
        <div className="mt-5 flex items-center justify-between">
          <Skeleton className="h-5 w-20 bg-white/10" />
          <Skeleton className="h-10 w-20 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 border-b border-ink/5 py-3 last:border-b-0">
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
        </div>
      ))}
    </div>
  );
}

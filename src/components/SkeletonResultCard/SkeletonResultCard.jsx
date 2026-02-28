export default function SkeletonResultCard({ rank = 1 }) {
  return (
    <article className="flex items-center gap-4 rounded-lg border border-slate-700/60 bg-slate-800/60 px-5 py-4">
      <span className="min-w-[2rem] text-lg font-bold text-slate-500">#{rank}</span>
      <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-slate-700 animate-pulse sm:h-24 sm:w-24" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded bg-slate-700 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-full rounded-full bg-slate-700 animate-pulse" />
          <div className="h-4 w-8 shrink-0 rounded bg-slate-700 animate-pulse" />
        </div>
      </div>
    </article>
  );
}

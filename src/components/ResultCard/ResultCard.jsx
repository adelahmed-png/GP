export default function ResultCard({ rank, image, score, onImageClick }) {
  const thumbSize = 'h-20 w-20 sm:h-24 sm:w-24';
  const isBestMatch = rank === 1;
  const percentage = typeof score === 'number' ? Math.round(score * 100) : 0;

  return (
    <article
      className={`flex items-center gap-4 rounded-lg border px-5 py-4 transition ${
        isBestMatch
          ? 'border-blue-500 bg-blue-500/10 hover:border-blue-400 hover:shadow-lg'
          : 'border-slate-700/60 bg-slate-800/60 hover:border-blue-500/40 hover:shadow-lg'
      }`}
    >
      <span className="min-w-[2rem] text-lg font-bold text-blue-400">#{rank}</span>
      <div
        className={`flex-shrink-0 overflow-hidden rounded-lg border border-slate-600 bg-slate-700/50 shadow-sm ${thumbSize} ${image && onImageClick ? 'cursor-pointer' : ''}`}
        onClick={image && onImageClick ? () => onImageClick(image) : undefined}
        role={image && onImageClick ? 'button' : undefined}
        tabIndex={image && onImageClick ? 0 : undefined}
        onKeyDown={
          image && onImageClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onImageClick(image);
                }
              }
            : undefined
        }
        aria-label={image && onImageClick ? `View suspect image rank ${rank}` : undefined}
      >
        {image ? (
          <img
            src={image}
            alt={`Suspect match ${rank}`}
            className="h-full w-full rounded-lg object-cover transition-transform duration-200 ease-out hover:scale-105 hover:shadow-lg"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg bg-slate-700/50 p-2 text-center">
            <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-slate-500">No image</span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-100">
            Score: {typeof score === 'number' ? score.toFixed(2) : score}
          </span>
          {isBestMatch && (
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
              Best Match ⭐
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isBestMatch ? 'bg-blue-400' : 'bg-blue-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-medium text-slate-400">{percentage}%</span>
        </div>
      </div>
    </article>
  );
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/100x100/1e293b/94a3b8?text=No+Image';

export default function ResultCard({ rank, image, score, onImageClick }) {
  const thumbSize = 'h-20 w-20 sm:h-24 sm:w-24';
  const isBestMatch = rank === 1;
  const percentage = typeof score === 'number' ? Math.round(score * 100) : 0;
  const imageSrc = image ?? PLACEHOLDER_IMAGE;

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
        <img
          src={imageSrc}
          alt={`Suspect match ${rank}`}
          className="h-full w-full rounded-lg object-cover shadow-sm transition-transform duration-200 ease-out hover:scale-105 hover:shadow-lg"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
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

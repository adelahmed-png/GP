import { useState } from 'react';
import ResultCard from '../ResultCard/ResultCard';
import SkeletonResultCard from '../SkeletonResultCard/SkeletonResultCard';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal';

function EmptyStateIcon() {
  return (
    <svg
      className="mx-auto mb-4 h-12 w-12 text-slate-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

export default function ResultsPanel({ results = [], isLoading }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="flex min-h-0 flex-1 flex-col p-6">
      <h2 className="mb-5 text-[1.35rem] font-semibold text-slate-100">Top Matches</h2>
      {isLoading ? (
        <div className="flex flex-col gap-3 overflow-y-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonResultCard key={index} rank={index + 1} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="mt-10 text-center">
          <EmptyStateIcon />
          <p className="text-slate-400">No matches yet.</p>
          <p className="mt-1 text-slate-400">Enter a suspect description to start searching.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto">
          {results.map((item, index) => (
            <div
              key={item.image + index}
              className="result-card-enter"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <ResultCard
                rank={index + 1}
                image={item.image}
                score={item.score}
                onImageClick={setSelectedImage}
              />
            </div>
          ))}
        </div>
      )}
      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
}

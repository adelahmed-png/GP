import { useState, useRef, useEffect } from 'react';

const MODEL_OPTIONS = ['CLIP', 'OpenCLIP', 'Custom Model'];
const METRIC_OPTIONS = ['Cosine', 'Dot Product', 'Euclidean'];

export default function SettingsDropdown({ modelVersion, similarityMetric, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setActiveDropdown(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleModelSelect = (value) => {
    onChange({ modelVersion: value, similarityMetric });
    setActiveDropdown(null);
  };

  const handleMetricSelect = (value) => {
    onChange({ modelVersion, similarityMetric: value });
    setActiveDropdown(null);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Settings
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[100] mt-2 min-w-[200px] rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-xl">
          <div className="mb-3 last:mb-0">
            <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-wider text-slate-500">
              Model Version
            </span>
            <div className="relative">
              <button
                type="button"
                className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-left text-sm text-slate-100 hover:border-blue-500"
                onClick={() => setActiveDropdown((a) => (a === 'model' ? null : 'model'))}
              >
                {modelVersion}
              </button>
              {activeDropdown === 'model' && (
                <ul className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-slate-600 bg-slate-800 p-1 shadow-lg">
                  {MODEL_OPTIONS.map((opt) => (
                    <li key={opt}>
                      <button
                        type="button"
                        className="w-full rounded px-3 py-2 text-left text-sm text-slate-100 hover:bg-slate-700/80"
                        onClick={() => handleModelSelect(opt)}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="mb-0">
            <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-wider text-slate-500">
              Similarity Metric
            </span>
            <div className="relative">
              <button
                type="button"
                className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-left text-sm text-slate-100 hover:border-blue-500"
                onClick={() => setActiveDropdown((a) => (a === 'metric' ? null : 'metric'))}
              >
                {similarityMetric}
              </button>
              {activeDropdown === 'metric' && (
                <ul className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-slate-600 bg-slate-800 p-1 shadow-lg">
                  {METRIC_OPTIONS.map((opt) => (
                    <li key={opt}>
                      <button
                        type="button"
                        className="w-full rounded px-3 py-2 text-left text-sm text-slate-100 hover:bg-slate-700/80"
                        onClick={() => handleMetricSelect(opt)}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

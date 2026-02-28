import { useState } from 'react';

export default function DescriptionInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  return (
    <form
      className="border-t border-slate-700/60 bg-slate-800/50 px-6 py-5"
      onSubmit={handleSubmit}
    >
      <label htmlFor="culprit-desc" className="mb-2 block text-sm font-medium text-slate-400">
        Culprit Description
      </label>
      <div className="flex gap-3 max-sm:flex-col">
        <input
          id="culprit-desc"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. bald man with beard"
          className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={disabled}
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || !value.trim()}
        >
          Search
        </button>
      </div>
    </form>
  );
}

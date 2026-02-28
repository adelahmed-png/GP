import InvestigationList from '../InvestigationList/InvestigationList';

export default function Sidebar({ onNewInvestigation }) {
  return (
    <aside className="fixed left-0 top-0 z-10 flex h-screen w-[260px] flex-col border-r border-slate-700/60 bg-slate-900/95 py-5">
      <h1 className="mb-5 px-5 text-[1.1rem] font-semibold leading-tight tracking-tight text-slate-100">
        Help Culprit Recognition
      </h1>
      <button
        type="button"
        className="mx-5 mb-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 active:scale-[0.98]"
        onClick={onNewInvestigation}
      >
        New Investigation +
      </button>
      <InvestigationList />
    </aside>
  );
}

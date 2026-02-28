import { Link, useParams } from 'react-router-dom';
import { useInvestigations } from '../../hooks/useInvestigations';

export default function InvestigationList() {
  const { investigations } = useInvestigations();
  const { id: currentId } = useParams();

  if (investigations.length === 0) {
    return (
      <p className="mt-4 px-5 text-sm leading-snug text-slate-500">
        No investigations yet. Create one to get started.
      </p>
    );
  }

  return (
    <ul className="list-none px-3">
      {investigations.map((inv, index) => (
        <li key={inv.id} className="mb-0.5">
          <Link
            to={`/investigation/${inv.id}`}
            className={`block rounded-md px-3 py-2.5 text-sm transition-colors ${
              currentId === inv.id
                ? 'bg-blue-500/20 font-medium text-blue-400'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            {inv.name || `Investigation ${index + 1}`}
          </Link>
        </li>
      ))}
    </ul>
  );
}

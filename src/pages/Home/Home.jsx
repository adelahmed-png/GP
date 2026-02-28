import { Link } from 'react-router-dom';
import { useInvestigations } from '../../hooks/useInvestigations';

export default function Home() {
  const { investigations } = useInvestigations();
  const firstId = investigations[0]?.id;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-3 text-2xl font-semibold text-slate-100">
        Help Culprit Recognition
      </h2>
      <p className="mb-6 max-w-md leading-relaxed text-slate-400">
        Create an investigation or select one from the sidebar to search for suspects by
        description.
      </p>
      {firstId && (
        <Link
          to={`/investigation/${firstId}`}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-500"
        >
          Open first investigation
        </Link>
      )}
    </div>
  );
}

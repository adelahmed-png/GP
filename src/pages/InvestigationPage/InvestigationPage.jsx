import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInvestigations } from '../../hooks/useInvestigations';
import { searchByDescription } from '../../services/api';
import ResultsPanel from '../../components/ResultsPanel/ResultsPanel';
import DescriptionInput from '../../components/DescriptionInput/DescriptionInput';
import SettingsDropdown from '../../components/SettingsDropdown/SettingsDropdown';

export default function InvestigationPage() {
  const { id } = useParams();
  const { getInvestigation } = useInvestigations();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelVersion, setModelVersion] = useState('CLIP');
  const [similarityMetric, setSimilarityMetric] = useState('Cosine');

  const investigation = id ? getInvestigation(id) : null;

  const handleSearch = async (description) => {
    if (!id) return;
    setError(null);
    setIsLoading(true);
    try {
      const data = await searchByDescription(id, description, {
        modelVersion,
        similarityMetric,
      });
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = ({ modelVersion: m, similarityMetric: s }) => {
    if (m !== undefined) setModelVersion(m);
    if (s !== undefined) setSimilarityMetric(s);
  };

  if (id && !investigation) {
    return (
      <div className="flex flex-1 flex-col">
        <p className="p-4 text-slate-500">Investigation not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-700/60 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-100">
          {investigation?.name || 'Investigation'}
        </h2>
        <SettingsDropdown
          modelVersion={modelVersion}
          similarityMetric={similarityMetric}
          onChange={handleSettingsChange}
        />
      </header>
      {error && (
        <p className="px-6 py-4 text-sm text-red-400">{error}</p>
      )}
      <ResultsPanel results={results} isLoading={isLoading} />
      <DescriptionInput onSubmit={handleSearch} disabled={isLoading} />
    </div>
  );
}

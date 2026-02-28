import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvestigationsProvider } from './hooks/useInvestigations';
import Sidebar from './components/Sidebar/Sidebar';
import InvestigationModal from './components/InvestigationModal/InvestigationModal';
import Home from './pages/Home/Home';
import InvestigationPage from './pages/InvestigationPage/InvestigationPage';

function AppLayout() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar onNewInvestigation={() => setModalOpen(true)} />
      <main className="ml-[260px] flex min-h-screen min-w-0 flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/investigation/:id" element={<InvestigationPage />} />
        </Routes>
      </main>
      <InvestigationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <InvestigationsProvider>
        <AppLayout />
      </InvestigationsProvider>
    </BrowserRouter>
  );
}

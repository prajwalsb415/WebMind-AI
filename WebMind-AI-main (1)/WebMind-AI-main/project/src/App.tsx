import { useState } from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AIPopup from './components/AIPopup';
import GenerationPage from './components/GenerationPage';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState<'initial' | 'generation'>('initial');
  const [generatedWebsite, setGeneratedWebsite] = useState<{ html: string; css: string; js: string } | null>(null);

  // This callback receives the generated website code from AIPopup
  // and switches the view to the GenerationPage.
  const handleGenerateWebpage = (websiteCode: { html: string; css: string; js: string }) => {
    setGeneratedWebsite(websiteCode);
    setShowPopup(false);
    setCurrentPage('generation');
  };

  // When in generation mode and website code exists, render the GenerationPage.
  if (currentPage === 'generation' && generatedWebsite) {
    return <GenerationPage generatedWebsite={generatedWebsite} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Websites</h1>
            <p className="text-gray-600">Configure and manage your websites</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowPopup(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Create Website
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">
          <div className="text-center text-gray-500 mt-20">
            <p>No websites created yet. Click "Create Website" to get started.</p>
          </div>
        </div>
      </main>

      {showPopup && (
        <AIPopup 
          onClose={() => setShowPopup(false)} 
          onGenerate={handleGenerateWebpage} 
        />
      )}
    </div>
  );
}

export default App;

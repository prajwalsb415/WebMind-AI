import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface AIPopupProps {
  onClose: () => void;
  onGenerate: (websiteCode: { html: string; css: string; js: string; generationInProgress?: boolean; themeColor?: string }) => void;
}

const categories = [
  'Health & Fitness',
  'Finance',
  'Meditation',
  'Course Selling',
  'Live Workshop Selling',
  'VSL Funnel',
  '1-on-1 Consultation',
];

const themeOptions = [
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Red', value: 'red' },
  { label: 'Purple', value: 'purple' },
];

function AIPopup({ onClose, onGenerate }: AIPopupProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [themeColor, setThemeColor] = useState('blue'); // default theme
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingWebsite, setIsGeneratingWebsite] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImprove = async () => {
    if (!description.trim()) return;

    setIsImproving(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://ai-website-builder-iyq0.onrender.com/api/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: description,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setDescription(data.improvedText);
    } catch (error) {
      console.error('Error improving text:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to improve text');
    } finally {
      setIsImproving(false);
    }
  };

  const handleGenerateWebsite = async () => {
    if (!description.trim()) return;

    setErrorMessage('');
    setIsGeneratingWebsite(true);

    try {
      const response = await fetch('https://ai-website-builder-iyq0.onrender.com/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: description,
          category: selectedCategory,
          themeColor, // Pass the selected theme color
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Pass the generated website code along with themeColor to the parent component
      onGenerate({
        html: data.html,
        css: data.css,
        js: data.js,
        generationInProgress: true,
        themeColor,
      });

      onClose();
    } catch (error) {
      console.error('Error generating website:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate website');
    } finally {
      setIsGeneratingWebsite(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Build your Website with AI</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-lg border text-sm transition ${
                  selectedCategory === category
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Textarea and Improve Button */}
          <div className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your webpage – its purpose, section layout, specific features you want to showcase..."
              className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              onClick={handleImprove}
              disabled={isImproving || !description.trim()}
              className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImproving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Improving...
                </>
              ) : (
                'Improve'
              )}
            </button>
          </div>

          {/* Additional Options: Webpage language and Theme Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webpage language</label>
              <select className="w-full p-2 border rounded-lg">
                <option>English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
              <select
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Website Button */}
          <button
            onClick={handleGenerateWebsite}
            disabled={!description.trim() || isGeneratingWebsite}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isGeneratingWebsite ? 'Generating Website...' : 'Generate Website'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIPopup;

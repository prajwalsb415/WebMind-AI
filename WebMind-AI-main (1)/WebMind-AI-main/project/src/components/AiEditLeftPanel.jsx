import React, { useState, useEffect } from 'react';
import { FaMagic, FaSyncAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function AiEditLeftPanel({ isOpen, onToggle, editor }) {
  const [aiChanges, setAiChanges] = useState('');
  const [applyAll, setApplyAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [improvedText, setImprovedText] = useState('');
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Add effect to track currently selected component
  useEffect(() => {
    if (!editor) return;
    
    const updateSelected = () => {
      const selected = editor.getSelected();
      setSelectedComponent(selected ? selected.getName() || 'Component' : null);
    };

    // Listen for selection changes
    editor.on('component:selected', updateSelected);
    editor.on('component:deselected', updateSelected);

    return () => {
      editor.off('component:selected', updateSelected);
      editor.off('component:deselected', updateSelected);
    };
  }, [editor]);

  const handleImprove = async () => {
    if (!aiChanges.trim()) {
      alert('Please enter some text to improve.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://ai-website-builder-iyq0.onrender.com/api/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiChanges, category: 'Health & Fitness' }),
      });
      const data = await response.json();
      if (data.improvedText) {
        setImprovedText(data.improvedText);
      } else {
        alert('Failed to improve text');
      }
    } catch (err) {
      console.error('Error in AI Improve:', err);
      alert('Error in improving text.');
    }
    setLoading(false);
  };

  const handleGenerate = () => {
    if (!editor) {
      alert('Editor not initialized');
      return;
    }
    
    // Run the AI generate section command
    editor.runCommand('ai-generate-section');
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed top-0 left-0 h-full w-80 bg-[#2b2b2b] p-4 flex flex-col shadow-xl z-50 border-r border-[#404040]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">AI Edit</h2>
            <button onClick={onToggle} className="text-white hover:text-gray-300">
              <FaChevronLeft size={24} />
            </button>
          </div>
          
          {selectedComponent ? (
            <div className="text-white text-sm mb-2 bg-blue-900 px-2 py-1 rounded">
              Selected: {selectedComponent}
            </div>
          ) : (
            <div className="text-yellow-300 text-sm mb-2 bg-yellow-900/40 px-2 py-1 rounded">
              No component selected
            </div>
          )}
          
          <textarea
            id="ai-edit-left-panel-textarea" // Add ID for easy selection
            className="flex-1 min-h-[120px] resize-none text-[11px] p-2 rounded bg-[#1e1e1e] text-white border-none outline-none mb-2"
            placeholder={selectedComponent 
              ? `Describe how to improve the selected ${selectedComponent}...` 
              : "Select a component first, then describe your changes..."}
            value={aiChanges}
            onChange={(e) => setAiChanges(e.target.value)}
          />
          <label className="flex items-center mb-2 text-[11px] text-[#cccccc] cursor-pointer">
            <input
              type="checkbox"
              checked={applyAll}
              onChange={(e) => setApplyAll(e.target.checked)}
              className="mr-1 cursor-pointer"
            />
            Apply to all sections
          </label>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleImprove}
              disabled={loading}
              className="flex-1 py-1 text-[11px] border border-[#404040] bg-[#1e1e1e] text-white rounded hover:bg-[#2d2d2d] transition disabled:opacity-50"
            >
              <FaMagic className="inline mr-1" /> {loading ? 'Improving...' : 'Improve'}
            </button>
            <button
              id="ai-edit-generate-btn" // Add ID for easy selection
              onClick={handleGenerate}
              disabled={!selectedComponent}
              className="flex-1 py-1 text-[11px] border border-[#404040] bg-[#1e1e1e] text-white rounded hover:bg-[#2d2d2d] transition disabled:opacity-50"
            >
              <FaSyncAlt className="inline mr-1" /> Generate
            </button>
          </div>
          {improvedText && (
            <div className="mt-4 p-2 bg-[#1e1e1e] rounded">
              <h3 className="font-bold text-[11px] text-white mb-1">Improved Text:</h3>
              <p className="text-[11px] text-white">{improvedText}</p>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={onToggle}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-[#2b2b2b] text-white p-2 rounded-r shadow-xl z-50 hover:bg-[#1e1e1e]"
        >
          <FaChevronRight size={24} />
        </button>
      )}
    </>
  );
}

export default AiEditLeftPanel;

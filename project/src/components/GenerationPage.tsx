// GenerationPage.jsx
import { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Check, X } from 'lucide-react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import AiEditLeftPanel from './AiEditLeftPanel'; // Ensure correct path

// Import React Icons for panel buttons
import { FaPaintBrush, FaLayerGroup, FaCog, FaFilm, FaRobot } from 'react-icons/fa';

// Convert React icons to HTML strings for panel buttons
const styleIcon = ReactDOMServer.renderToString(<FaPaintBrush />);
const layersIcon = ReactDOMServer.renderToString(<FaLayerGroup />);
const settingsIcon = ReactDOMServer.renderToString(<FaCog />);
const animationIcon = ReactDOMServer.renderToString(<FaFilm />);
const aiEditorIcon = ReactDOMServer.renderToString(<FaRobot />);

// Default sections for the progress popup
const defaultSections = [
  { id: 1, name: 'Header', completed: false },
  { id: 2, name: 'Hero', completed: false },
  { id: 3, name: 'Features', completed: false },
  { id: 4, name: 'Pricing', completed: false },
  { id: 5, name: 'Banner', completed: false },
  { id: 6, name: 'FAQ', completed: false },
  { id: 7, name: 'Footer', completed: false },
];

/**
 * Custom plugin for GrapesJS styling and commands.
 */
function myCustomAiEditLayoutPlugin(editor) {
  // Register the AI Improve command
  editor.Commands.add('ai-improve', {
    run() {
      const aiTextarea = document.querySelector(
        '.gjs-sm-sector[data-sector-name="Ai Edit"] .property[property="ai-changes"] textarea'
      );
      if (!aiTextarea) {
        alert("AI Edit field not found");
        return;
      }
      const currentText = aiTextarea.value;
      if (!currentText.trim()) {
        alert("Please enter some text to improve.");
        return;
      }
      aiTextarea.style.opacity = '0.5';
      fetch('https://ai-website-builder-iyq0.onrender.com/api/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText, category: 'Health & Fitness' }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.improvedText) {
            aiTextarea.value = data.improvedText;
          } else {
            alert("Failed to improve text");
          }
        })
        .catch((err) => {
          console.error("Error in AI Improve:", err);
          alert("Error in improving text.");
        })
        .finally(() => {
          aiTextarea.style.opacity = '1';
        });
    },
  });

  // ADD NEW COMMAND: AI Generate Section
  editor.Commands.add('ai-generate-section', {
    run: async () => {
      // 1) Get the currently selected component
      const selected = editor.getSelected();
      if (!selected) {
        alert('Please select a section or component first.');
        return;
      }

      // 2) Get instructions from the left sidebar AI editor
      const leftPanelTextarea = document.querySelector('#ai-edit-left-panel-textarea');
      if (!leftPanelTextarea) {
        alert('AI Editor panel not found');
        return;
      }

      const instructions = leftPanelTextarea.value;
      if (!instructions.trim()) {
        alert('Please enter instructions in AI Editor');
        return;
      }

      // 3) Get existing content from selected component
      const existingText = selected.toHTML ? selected.toHTML() : selected.get('content');

      // 4) Show loading state
      leftPanelTextarea.style.opacity = '0.5';
      const generateButton = document.querySelector('#ai-edit-generate-btn');
      if (generateButton) {
        generateButton.disabled = true;
        generateButton.innerHTML = '<span>Generating...</span>';
      }

      try {
        // 5) Call API to improve text
        const response = await fetch('https://ai-website-builder-iyq0.onrender.com/api/improve-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: instructions, 
            existingText: existingText,
            category: 'Health & Fitness',
          }),
        });

        const data = await response.json();
        if (data.improvedText) {
          // 6) Update the component content
          selected.components(data.improvedText);
          // If the above doesn't work well for all components, try:
          // selected.set('content', data.improvedText);
        } else {
          alert('Failed to generate content');
        }
      } catch (err) {
        console.error('Error in AI Generate Section:', err);
        alert('Error generating content.');
      } finally {
        // 7) Reset UI state
        leftPanelTextarea.style.opacity = '1';
        if (generateButton) {
          generateButton.disabled = false;
          generateButton.innerHTML = '<span>Generate</span>';
        }
      }
    },
  });

  editor.on('load', () => {
    const styleManager = editor.StyleManager;
    const aiEditSector = styleManager.getSector('Ai Edit');
    if (aiEditSector) {
      styleManager.removeSector('Ai Edit');
    }

    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      /* Hide "Ai Edit" sector entirely if it still appears */
      .gjs-sm-sector[data-sector-name="Ai Edit"] {
        display: none !important;
      }
      
      /* Highlight selected component with a blue border */
      .gjs-selected {
        outline: 2px solid #007bff !important;
      }
    `;
    document.head.appendChild(styleEl);
  });
}

/**
 * Custom Style Manager configuration.
 */
const customStyleManagerConfig = {
  sectors: [
    {
      name: 'Layout',
      open: false,
      buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'float', 'order'],
    },
    {
      name: 'Spacing',
      open: false,
      buildProps: ['margin', 'padding'],
    },
    {
      name: 'Position',
      open: false,
      buildProps: ['position', 'top', 'right', 'left', 'bottom'],
    },
    {
      name: 'Sizing',
      open: false,
      buildProps: ['width', 'height', 'max-width', 'min-height'],
    },
    {
      name: 'Typography',
      open: false,
      buildProps: [
        'font-family',
        'font-size',
        'font-weight',
        'letter-spacing',
        'color',
        'line-height',
        'text-align',
        'text-decoration',
        'text-shadow',
      ],
    },
    {
      name: 'Border',
      open: false,
      buildProps: ['border', 'border-radius'],
    },
    {
      name: 'Background',
      open: false,
      buildProps: ['background', 'background-color'],
    },
    {
      name: 'Effects',
      open: false,
      buildProps: ['opacity', 'box-shadow', 'transform'],
    },
  ],
};

function GenerationPage({ generatedWebsite }) {
  const [showProgress, setShowProgress] = useState(!!generatedWebsite?.generationInProgress);
  const [sections, setSections] = useState(defaultSections);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const allSectionsCompleteRef = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const updateSectionStatus = () => {
    if (!editorRef.current) return;
    const iframeDoc = editorRef.current.Canvas.getDocument();
    if (!iframeDoc || !iframeDoc.body) return;

    const updated = sections.map((section) => {
      const byId = iframeDoc.getElementById(section.name.toLowerCase());
      const byClass = iframeDoc.getElementsByClassName(section.name.toLowerCase())[0];
      const byDataSection = iframeDoc.querySelector(`[data-section="${section.name.toLowerCase()}"]`);
      const byTagWithClass = iframeDoc.querySelector(`.${section.name.toLowerCase()}-section`);
      const headings = Array.from(iframeDoc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const headingWithText = headings.find((h) =>
        h.textContent?.toLowerCase().includes(section.name.toLowerCase())
      );
      const sectionFound = byId || byClass || byDataSection || byTagWithClass || headingWithText;
      return { ...section, completed: Boolean(sectionFound) };
    });

    setSections(updated);
    const allComplete = updated.every((s) => s.completed);
    allSectionsCompleteRef.current = allComplete;
    if (allComplete && showProgress) {
      console.log("All sections complete, hiding progress popup");
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setTimeout(() => setShowProgress(false), 1000);
    }
  };

  useEffect(() => {
    if (!generatedWebsite || !generatedWebsite.html) return;

    let cleanHtml = generatedWebsite.html.replace(/<\s*think\s*>[\s\S]*?<\s*\/\s*think\s*>/gi, '').trim();
    const cleanCss = generatedWebsite.css.replace(/<\s*think\s*>[\s\S]*?<\s*\/\s*think\s*>/gi, '').trim();
    const cleanJs = generatedWebsite.js.replace(/<\s*think\s*>[\s\S]*?<\s*\/\s*think\s*>/gi, '').trim();

    if (!cleanHtml.includes('id="gjs"')) {
      cleanHtml = `<div id="gjs">${cleanHtml}</div>`;
    }

    if (containerRef.current && !editorRef.current) {
      editorRef.current = grapesjs.init({
        container: containerRef.current,
        height: '100vh',
        width: 'auto',
        storageManager: false,
        styleManager: customStyleManagerConfig,
        panels: {
          defaults: [
            {
              id: 'views',
              buttons: [
                { id: 'style', active: true, label: styleIcon, command: 'show-styles' },
                { id: 'layers', label: layersIcon, command: 'show-layers' },
                { id: 'settings', label: settingsIcon, command: 'show-settings' },
                { id: 'animation', label: animationIcon, command: 'show-animation' },
                { id: 'ai-editor', label: aiEditorIcon, command: 'show-ai-editor' },
              ],
            },
          ],
        },
        plugins: [gjsPresetWebpage, gjsBlocksBasic, myCustomAiEditLayoutPlugin],
        pluginsOpts: {
          gjsPresetWebpage: {},
          gjsBlocksBasic: {},
        },
        canvas: {
          styles: [
            'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
          ],
        },
        components: cleanHtml,
        style: cleanCss,
      });

      editorRef.current.on('load', () => {
        if (cleanJs) {
          try {
            const iframeDoc = editorRef.current.Canvas.getDocument();
            if (iframeDoc) {
              const blob = new Blob([cleanJs], { type: 'text/javascript' });
              const scriptUrl = URL.createObjectURL(blob);
              const scriptEl = iframeDoc.createElement('script');
              scriptEl.src = scriptUrl;
              iframeDoc.body.appendChild(scriptEl);
            }
          } catch (err) {
            console.error('Failed to inject generated JS:', err);
          }
        }

        const initialCheckInterval = setInterval(() => {
          updateSectionStatus();
        }, 500);

        setTimeout(() => {
          clearInterval(initialCheckInterval);
          progressIntervalRef.current = setInterval(updateSectionStatus, 1000);
        }, 3000);

        setTimeout(() => {
          if (showProgress) {
            console.log("Fallback: hiding progress popup after timeout");
            setShowProgress(false);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }
        }, 15000);
      });
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [generatedWebsite]);

  if (!generatedWebsite || !generatedWebsite.html) {
    return <div className="flex items-center justify-center min-h-screen">Loading website...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Pass editorRef.current to AiEditLeftPanel */}
      <AiEditLeftPanel 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
        editor={editorRef.current}
      />
      
      {/* GrapesJS Container: add left margin if sidebar is open */}
      <div className={`flex-1 relative ${sidebarOpen ? 'ml-80' : ''}`}>
        <div ref={containerRef} className="absolute inset-0" />
      </div>
      
      {showProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg w-[500px] relative">
            <button
              onClick={() => setShowProgress(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Generating Website Content...</h2>
                <p className="text-gray-400 mt-2">Please wait until all sections are completed.</p>
              </div>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${section.completed ? 'bg-green-500' : 'border-2 border-gray-600'}`}>
                      {section.completed && <Check size={16} />}
                    </div>
                    <span>{section.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerationPage;

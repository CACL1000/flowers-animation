import React, { useState } from 'react';
import { FlowerScene } from './components/FlowerScene';
import { Sparkles, Heart, RefreshCw, Radio, Zap } from 'lucide-react';
import { generateCompliment } from './services/gemini';

const App: React.FC = () => {
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flowerColor, setFlowerColor] = useState<string>('#ff4d6d');
  const [visualsActive, setVisualsActive] = useState(false);

  const handleGenerateMessage = async () => {
    setIsLoading(true);
    try {
      const message = await generateCompliment("Pame");
      setGeneratedMessage(message);
    } catch (error) {
      console.error("Error generating message:", error);
      setGeneratedMessage("Eres única y especial, como la flor más hermosa de este jardín.");
    } finally {
      setIsLoading(false);
    }
  };

  const cycleColor = () => {
    const colors = ['#ff4d6d', '#ff758f', '#c9184a', '#ffb3c1', '#ffffff', '#e0aaff', '#ffd700', '#ff6b6b'];
    const next = colors[(colors.indexOf(flowerColor) + 1) % colors.length];
    setFlowerColor(next);
  };

  const toggleVisuals = () => {
    setVisualsActive(!visualsActive);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-pink-50 to-pink-100">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <FlowerScene color={flowerColor} isPlaying={visualsActive} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        
        {/* Header */}
        <header className="text-center mt-8 pointer-events-auto animate-fade-in-down">
          <h1 className="text-5xl md:text-7xl font-serif text-rose-600 drop-shadow-sm italic">
            Para Pame
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-light text-rose-800 tracking-wider bg-white/30 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
            La niña más linda
          </p>
        </header>

        {/* Interaction Controls */}
        <div className="flex flex-col items-center gap-4 mb-24 md:mb-24 pointer-events-auto">
          
          {generatedMessage && (
            <div className="max-w-md bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-pink-200 mb-2 animate-slide-up transform hover:scale-105 transition-transform duration-300">
              <p className="text-xl text-rose-900 font-serif italic text-center leading-relaxed">
                "{generatedMessage}"
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 items-center">
            
            {/* Message Button */}
            <button
              onClick={handleGenerateMessage}
              disabled={isLoading}
              className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 animate-pulse" />
              )}
              <span className="font-semibold">{isLoading ? 'Escribiendo...' : 'Mensaje Especial'}</span>
            </button>

            {/* Color Button */}
            <button
              onClick={cycleColor}
              className="p-3 bg-white hover:bg-pink-50 text-rose-500 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 border border-rose-100 group"
              title="Cambiar color de flores"
            >
              <Heart className="w-5 h-5 fill-current group-hover:text-red-500 transition-colors" />
            </button>

            {/* Visuals Toggle (Since Spotify is external) */}
             <button
              onClick={toggleVisuals}
              className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 border ${
                visualsActive 
                  ? 'bg-rose-100 text-rose-600 border-rose-300 ring-2 ring-rose-200' 
                  : 'bg-white text-gray-500 border-gray-200 hover:text-rose-400'
              }`}
              title="Activar efectos visuales para la música"
            >
              {visualsActive ? <Zap className="w-5 h-5 fill-current" /> : <Radio className="w-5 h-5" />}
              <span className="hidden md:inline font-medium text-sm">
                {visualsActive ? 'Efectos Activos' : 'Activar Visuales'}
              </span>
            </button>
          </div>
          
          <p className="text-rose-800/60 text-xs mt-4 font-sans tracking-wide">
            Pon play en Spotify abajo y activa los visuales.
          </p>
        </div>
      </div>

      {/* Spotify Embed - Centered Bottom */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto w-[90%] max-w-[400px] shadow-2xl rounded-xl overflow-hidden animate-fade-in-up border border-pink-200 bg-white/20 backdrop-blur-sm">
        <iframe 
          style={{borderRadius: '12px'}} 
          src="https://open.spotify.com/embed/playlist/3BpOxQiMNez1ERmvs0ZHP7?utm_source=generator&theme=0" 
          width="100%" 
          height="80" 
          frameBorder="0" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          title="Spotify Player"
        ></iframe>
      </div>

    </main>
  );
};

export default App;
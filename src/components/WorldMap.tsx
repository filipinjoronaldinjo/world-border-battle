
import React, { useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import worldMapSvg from '@/assets/world-map.svg';

const WorldMap: React.FC = () => {
  const { gameState, setHighlightedCountry } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Učitaj SVG mapu
    fetch(worldMapSvg)
      .then(response => response.text())
      .then(svgContent => {
        mapContainerRef.current.innerHTML = svgContent;
        
        // Dodaj event listener-e na putanje država
        const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
        countryPaths.forEach(path => {
          const countryName = path.getAttribute('data-name');
          if (!countryName) return;
          
          path.addEventListener('mouseenter', () => {
            setHighlightedCountry(countryName);
          });
          
          path.addEventListener('mouseleave', () => {
            setHighlightedCountry(null);
          });
        });
      })
      .catch(error => console.error("Greška pri učitavanju mape:", error));
    
    return () => {
      // Očisti event listener-e
      const countryPaths = mapContainerRef.current?.querySelectorAll('path[data-name]');
      if (countryPaths) {
        countryPaths.forEach(path => {
          path.removeEventListener('mouseenter', () => {});
          path.removeEventListener('mouseleave', () => {});
        });
      }
    };
  }, [setHighlightedCountry]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Resetuj sve države na podrazumevano
    const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
    countryPaths.forEach(path => {
      path.classList.remove('player-country', 'computer-country', 'highlighted');
    });
    
    // Označi države igrača
    gameState.playerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) path.classList.add('player-country');
    });
    
    // Označi države računara
    gameState.computerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) path.classList.add('computer-country');
    });
    
    // Označi trenutno označenu državu
    if (gameState.highlightedCountry) {
      const path = mapContainerRef.current.querySelector(`path[data-name="${gameState.highlightedCountry}"]`);
      if (path) path.classList.add('highlighted');
    }
    
  }, [gameState.playerHistory, gameState.computerHistory, gameState.highlightedCountry]);

  return (
    <div className="map-container w-full h-[65vh] max-h-[800px] border rounded-lg shadow-lg overflow-hidden bg-white">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default WorldMap;

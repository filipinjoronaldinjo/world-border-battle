
import React, { useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';

const WorldMap: React.FC = () => {
  const { gameState, makePlayerMove, setHighlightedCountry } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Učitaj SVG mapu direktno iz assets foldera
    fetch('/src/assets/world-map.svg')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(svgContent => {
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = svgContent;
          
          // Dodaj event listenere na putanje država
          const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
          countryPaths.forEach(path => {
            const countryName = path.getAttribute('data-name');
            if (!countryName) return;
            
            path.addEventListener('mouseenter', () => {
              setHighlightedCountry(countryName);
              path.classList.add('hover');
            });
            
            path.addEventListener('mouseleave', () => {
              setHighlightedCountry(null);
              path.classList.remove('hover');
            });
            
            path.addEventListener('click', () => {
              makePlayerMove(countryName);
            });
          });
        }
      })
      .catch(error => {
        console.error("Error loading map:", error);
        
        // Ako ne uspe učitavanje, prikaži alternativnu mapu direktno iz SVG stringa
        if (mapContainerRef.current) {
          // Osnovna verzija mape kao backup
          const backupSvg = `
          <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
            <path data-name="Srbija" d="M525 235 L532 230 L538 232 L543 240 L535 243 L528 240 Z" />
            <path data-name="Hrvatska" d="M510 230 L525 235 L527 240 L515 245 L505 238 Z" />
            <path data-name="Bosna i Hercegovina" d="M515 245 L527 240 L535 243 L530 250 L522 252 Z" />
            <path data-name="Crna Gora" d="M530 250 L535 243 L543 240 L545 245 L538 250 Z" />
            <path data-name="Bugarska" d="M545 235 L550 233 L560 236 L560 248 L550 245 Z" />
            <path data-name="Severna Makedonija" d="M538 250 L545 245 L550 245 L550 253 L540 253 Z" />
            <!-- Još nekoliko osnovnih zemalja Evrope za backup mapu -->
            <path data-name="Grčka" d="M540 253 L550 253 L558 265 L540 270 L535 257 Z" />
            <path data-name="Francuska" d="M460 220 L475 205 L490 210 L492 215 L485 240 L450 225 Z" />
            <path data-name="Nemačka" d="M500 207 L505 215 L515 210 L525 220 L515 195 L505 190 Z" />
            <path data-name="Italija" d="M485 240 L505 238 L485 210 L475 205 L460 220 L465 235 Z" />
            <path data-name="Španija" d="M450 225 L465 235 L460 250 L425 245 L430 230 Z" />
          </svg>
          `;
          
          mapContainerRef.current.innerHTML = backupSvg;
          
          // Dodaj event listenere na putanje država
          const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
          countryPaths.forEach(path => {
            const countryName = path.getAttribute('data-name');
            if (!countryName) return;
            
            path.addEventListener('mouseenter', () => {
              setHighlightedCountry(countryName);
              path.classList.add('hover');
            });
            
            path.addEventListener('mouseleave', () => {
              setHighlightedCountry(null);
              path.classList.remove('hover');
            });
            
            path.addEventListener('click', () => {
              makePlayerMove(countryName);
            });
          });
        }
      });
    
    return () => {
      // Očisti event listenere
      const countryPaths = mapContainerRef.current?.querySelectorAll('path');
      if (countryPaths) {
        countryPaths.forEach(path => {
          path.removeEventListener('mouseenter', () => {});
          path.removeEventListener('mouseleave', () => {});
          path.removeEventListener('click', () => {});
        });
      }
    };
  }, [setHighlightedCountry, makePlayerMove]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Resetuj sve zemlje na podrazumevane vrednosti
    const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
    countryPaths.forEach(path => {
      path.classList.remove('player-country', 'computer-country', 'highlighted');
      path.setAttribute('fill', '#e0e0e0');
      path.setAttribute('stroke', '#ffffff');
    });
    
    // Označi zemlje igrača
    gameState.playerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('player-country');
        path.setAttribute('fill', '#3b82f6'); // plava
      }
    });
    
    // Označi zemlje računara
    gameState.computerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('computer-country');
        path.setAttribute('fill', '#ef4444'); // crvena
      }
    });
    
    // Označi trenutno istaknutu zemlju
    if (gameState.highlightedCountry) {
      const path = mapContainerRef.current.querySelector(`path[data-name="${gameState.highlightedCountry}"]`);
      if (path) {
        path.classList.add('highlighted');
        path.setAttribute('stroke', '#10b981'); // zelena
        path.setAttribute('stroke-width', '2');
      }
    }
    
  }, [gameState.playerHistory, gameState.computerHistory, gameState.highlightedCountry]);

  return (
    <div className="map-container w-full h-[65vh] max-h-[800px] border rounded-lg shadow-lg overflow-hidden bg-white">
      <div ref={mapContainerRef} className="w-full h-full relative">
        {/* SVG mapa će biti ubačena ovde */}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .map-container path {
          fill: #e0e0e0;
          stroke: #c0c0c0;
          stroke-width: 0.5px;
          transition: fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
        }
        
        .map-container path:hover {
          cursor: pointer;
          stroke: #10b981;
          stroke-width: 1.5px;
        }
        
        .player-country {
          fill: #3b82f6 !important;
          stroke-width: 0.5px;
          stroke: #ffffff;
        }
        
        .computer-country {
          fill: #ef4444 !important;
          stroke-width: 0.5px;
          stroke: #ffffff;
        }
        
        .highlighted {
          stroke: #10b981 !important;
          stroke-width: 2px !important;
        }
      `}} />
    </div>
  );
};

export default WorldMap;

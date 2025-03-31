
import React, { useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';

const WorldMap: React.FC = () => {
  const { gameState, makePlayerMove, setHighlightedCountry } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Učitaj SVG mapu bez teksta direktno u komponentu
    fetch('https://raw.githubusercontent.com/mledoze/countries/master/data/world.svg')
      .then(response => response.text())
      .then(svgContent => {
        // Ukloni eventualne tekstualne elemente iz SVG-a
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const textElements = svgDoc.querySelectorAll('text');
        textElements.forEach(text => text.remove());
        
        mapContainerRef.current.innerHTML = new XMLSerializer().serializeToString(svgDoc);
        
        // Dodaj event listener-e na putanje država
        const countryPaths = mapContainerRef.current.querySelectorAll('path');
        countryPaths.forEach(path => {
          const countryId = path.getAttribute('id');
          if (!countryId) return;
          
          // Pronađi odgovarajuće ime države iz data-name atributa ili drugog izvora
          const countryName = getCountryNameFromId(countryId);
          if (!countryName) return;
          
          // Postavi data-name atribut za later reference
          path.setAttribute('data-name', countryName);
          
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
      })
      .catch(error => {
        console.error("Greška pri učitavanju mape:", error);
        // Fallback na drugi izvor mape ako prvi ne uspe
        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
          .then(response => response.json())
          .then(worldData => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 960 500');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            
            // Kreiraj putanje za svaku državu
            worldData.features.forEach(feature => {
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', feature.geometry);
              path.setAttribute('data-name', feature.properties.name);
              path.setAttribute('fill', '#e0e0e0');
              path.setAttribute('stroke', '#ffffff');
              path.setAttribute('stroke-width', '0.5');
              
              svg.appendChild(path);
            });
            
            if (mapContainerRef.current) {
              mapContainerRef.current.innerHTML = '';
              mapContainerRef.current.appendChild(svg);
            }
          })
          .catch(secondError => console.error("Fallback mapa nije učitana:", secondError));
      });
    
    return () => {
      // Očisti event listener-e
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
    
    // Resetuj sve države na podrazumevano
    const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
    countryPaths.forEach(path => {
      path.classList.remove('player-country', 'computer-country', 'highlighted');
      path.setAttribute('fill', '#e0e0e0');
      path.setAttribute('stroke', '#ffffff');
    });
    
    // Označi države igrača
    gameState.playerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('player-country');
        path.setAttribute('fill', '#3b82f6'); // blue
      }
    });
    
    // Označi države računara
    gameState.computerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('computer-country');
        path.setAttribute('fill', '#ef4444'); // red
      }
    });
    
    // Označi trenutno označenu državu
    if (gameState.highlightedCountry) {
      const path = mapContainerRef.current.querySelector(`path[data-name="${gameState.highlightedCountry}"]`);
      if (path) {
        path.classList.add('highlighted');
        path.setAttribute('stroke', '#10b981'); // green
        path.setAttribute('stroke-width', '2');
      }
    }
    
  }, [gameState.playerHistory, gameState.computerHistory, gameState.highlightedCountry]);

  // Helper funkcija za konverziju id-a države u ime
  function getCountryNameFromId(id: string): string | null {
    const countryMappings: {[key: string]: string} = {
      // Osnovni set mapiranja ID-eva na imena država 
      // Ovde će biti manji set država za primer, biće dopunjen po potrebi
      "RUS": "Rusija",
      "USA": "Sjedinjene Američke Države",
      "CAN": "Kanada",
      "BRA": "Brazil",
      "CHN": "Kina",
      "IND": "Indija",
      "AUS": "Australija",
      "FRA": "Francuska",
      "DEU": "Nemačka",
      "GBR": "Ujedinjeno Kraljevstvo",
      "ITA": "Italija",
      "JPN": "Japan",
      "SRB": "Srbija",
      "HRV": "Hrvatska",
      "BIH": "Bosna i Hercegovina",
      "MNE": "Crna Gora",
      "MKD": "Severna Makedonija",
      "ALB": "Albanija"
      // Ostatak mapiranja će biti dopunjen po potrebi
    };
    
    return countryMappings[id] || null;
  }

  return (
    <div className="map-container w-full h-[65vh] max-h-[800px] border rounded-lg shadow-lg overflow-hidden bg-white">
      <div ref={mapContainerRef} className="w-full h-full relative">
        {/* Ovde će biti ubačena SVG mapa */}
        <style jsx>{`
          path {
            transition: fill 0.3s ease, stroke 0.3s ease;
          }
          .player-country {
            fill: #3b82f6;
          }
          .computer-country {
            fill: #ef4444;
          }
          .highlighted {
            stroke: #10b981 !important;
            stroke-width: 2px;
          }
          path.hover {
            stroke: #10b981;
            stroke-width: 1.5px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
};

export default WorldMap;

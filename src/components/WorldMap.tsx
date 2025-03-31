import React, { useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';

const WorldMap: React.FC = () => {
  const { gameState, makePlayerMove, setHighlightedCountry } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Load SVG map without text directly into the component
    fetch('https://raw.githubusercontent.com/mledoze/countries/master/data/world.svg')
      .then(response => response.text())
      .then(svgContent => {
        // Remove any text elements from the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const textElements = svgDoc.querySelectorAll('text');
        textElements.forEach(text => text.remove());
        
        mapContainerRef.current.innerHTML = new XMLSerializer().serializeToString(svgDoc);
        
        // Add event listeners to country paths
        const countryPaths = mapContainerRef.current.querySelectorAll('path');
        countryPaths.forEach(path => {
          const countryId = path.getAttribute('id');
          if (!countryId) return;
          
          // Find the corresponding country name from the data-name attribute or other source
          const countryName = getCountryNameFromId(countryId);
          if (!countryName) return;
          
          // Set data-name attribute for later reference
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
        console.error("Error loading map:", error);
        // Fallback to another map source if the first one fails
        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
          .then(response => response.json())
          .then(worldData => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 960 500');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            
            // Create paths for each country
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
          .catch(secondError => console.error("Fallback map failed to load:", secondError));
      });
    
    return () => {
      // Clean up event listeners
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
    
    // Reset all countries to default
    const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
    countryPaths.forEach(path => {
      path.classList.remove('player-country', 'computer-country', 'highlighted');
      path.setAttribute('fill', '#e0e0e0');
      path.setAttribute('stroke', '#ffffff');
    });
    
    // Mark player countries
    gameState.playerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('player-country');
        path.setAttribute('fill', '#3b82f6'); // blue
      }
    });
    
    // Mark computer countries
    gameState.computerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('computer-country');
        path.setAttribute('fill', '#ef4444'); // red
      }
    });
    
    // Mark the currently highlighted country
    if (gameState.highlightedCountry) {
      const path = mapContainerRef.current.querySelector(`path[data-name="${gameState.highlightedCountry}"]`);
      if (path) {
        path.classList.add('highlighted');
        path.setAttribute('stroke', '#10b981'); // green
        path.setAttribute('stroke-width', '2');
      }
    }
    
  }, [gameState.playerHistory, gameState.computerHistory, gameState.highlightedCountry]);

  // Helper function to convert country id to name
  function getCountryNameFromId(id: string): string | null {
    const countryMappings: {[key: string]: string} = {
      // Basic set of country ID to name mapping
      // This is a smaller set of countries for example, will be expanded as needed
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
      // Rest of the mapping will be added as needed
    };
    
    return countryMappings[id] || null;
  }

  return (
    <div className="map-container w-full h-[65vh] max-h-[800px] border rounded-lg shadow-lg overflow-hidden bg-white">
      <div ref={mapContainerRef} className="w-full h-full relative">
        {/* The SVG map will be inserted here */}
      </div>
    </div>
  );
};

export default WorldMap;

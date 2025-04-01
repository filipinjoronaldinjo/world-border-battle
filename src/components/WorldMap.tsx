
import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '@/context/GameContext';

const WorldMap: React.FC = () => {
  const { gameState, makePlayerMove, setHighlightedCountry } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Load SVG map from public assets folder
    fetch('/assets/world-map.svg')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(svgContent => {
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = svgContent;
          
          // Add event listeners to country paths
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
              zoomToCountry(path as SVGPathElement);
            });
          });
        }
      })
      .catch(error => {
        console.error("Error loading map:", error);
        
        // If loading fails, show alternative map
        if (mapContainerRef.current) {
          // Basic map as backup with minimal countries (not shown here for brevity)
          mapContainerRef.current.innerHTML = `<svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
            <text x="500" y="250" text-anchor="middle" font-size="20">Map loading failed</text>
          </svg>`;
        }
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
    
    // Reset all countries to default values
    const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
    countryPaths.forEach(path => {
      path.classList.remove('player-country', 'computer-country', 'highlighted');
      path.setAttribute('fill', '#e0e0e0');
      path.setAttribute('stroke', '#c0c0c0');
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
    
    // Mark highlighted country
    if (gameState.highlightedCountry) {
      const path = mapContainerRef.current.querySelector(`path[data-name="${gameState.highlightedCountry}"]`);
      if (path) {
        path.classList.add('highlighted');
        path.setAttribute('stroke', '#10b981'); // green
        path.setAttribute('stroke-width', '2');
      }
    }
    
    // Zoom to the most recently selected country
    const lastCountry = gameState.currentCountry;
    if (lastCountry && lastCountry !== activeCountry) {
      const countryPath = mapContainerRef.current.querySelector(`path[data-name="${lastCountry}"]`) as SVGPathElement;
      if (countryPath) {
        zoomToCountry(countryPath);
        setActiveCountry(lastCountry);
      }
    }
    
  }, [gameState.playerHistory, gameState.computerHistory, gameState.highlightedCountry, gameState.currentCountry, activeCountry]);

  const zoomToCountry = (countryPath: SVGPathElement) => {
    if (!countryPath || !mapContainerRef.current) return;
    
    try {
      // Get the bounding box of the country path
      const bbox = countryPath.getBBox();
      
      // Calculate center of the bounding box
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;
      
      // Calculate appropriate zoom level based on country size
      // Smaller countries get higher zoom
      const svgElement = mapContainerRef.current.querySelector('svg');
      if (!svgElement) return;
      
      const svgWidth = svgElement.viewBox.baseVal.width;
      const svgHeight = svgElement.viewBox.baseVal.height;
      
      const containerWidth = mapContainerRef.current.clientWidth;
      const containerHeight = mapContainerRef.current.clientHeight;
      
      // Determine zoom factor based on country size
      // Ensure country takes up at least 20% of the view
      const minDimension = Math.min(containerWidth, containerHeight);
      const maxCountryDimension = Math.max(bbox.width, bbox.height);
      const targetSize = minDimension * 0.3; // Target 30% of viewport
      
      let newZoom = targetSize / (maxCountryDimension / (svgWidth / 1000));
      newZoom = Math.min(Math.max(newZoom, 1), 4); // Limit zoom between 1x and 4x
      
      // Calculate pan position to center the country
      const newX = -(centerX * newZoom - containerWidth / 2);
      const newY = -(centerY * newZoom - containerHeight / 2);
      
      // Apply zoom and pan with animation
      setZoom(newZoom);
      setPanPosition({ x: newX, y: newY });
      
    } catch (error) {
      console.error("Error zooming to country:", error);
    }
  };

  const resetZoom = () => {
    setZoom(1);
    setPanPosition({ x: 0, y: 0 });
    setActiveCountry(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="map-container w-full h-[65vh] max-h-[800px] border rounded-lg shadow-lg overflow-hidden bg-white relative">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
            transformOrigin: '0 0',
            transition: 'transform 0.5s ease-out'
          }}
        >
          {/* SVG map will be inserted here */}
        </div>
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white"
            onClick={resetZoom}
            title="Reset zoom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 3 18 18"/>
              <path d="M10.5 10.5 3 18"/>
              <path d="M21 21v-6"/>
              <path d="M21 21H15"/>
              <path d="M18 18 9 9"/>
            </svg>
          </button>
        </div>
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

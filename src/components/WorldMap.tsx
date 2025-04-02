
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const WorldMap: React.FC = () => {
  const { gameState } = useGame();
  const [loading, setLoading] = useState(true);
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load the SVG map when component mounts
  useEffect(() => {
    const loadMap = async () => {
      try {
        const response = await fetch('/assets/world-map.svg');
        if (!response.ok) {
          throw new Error(`Failed to load map: ${response.status}`);
        }
        const svgText = await response.text();
        
        if (svgRef.current) {
          svgRef.current.innerHTML = svgText;
          initializeCountryPaths();
          setMapLoaded(true);
          setLoading(false);
          console.log("Map loaded successfully");
        }
      } catch (error) {
        console.error("Error loading map:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load the map. Please refresh the page.",
          variant: "destructive"
        });
      }
    };

    loadMap();
  }, []);

  // Initialize click handlers and styling for country paths
  const initializeCountryPaths = () => {
    if (!svgRef.current) return;
    
    const paths = svgRef.current.querySelectorAll('path');
    
    paths.forEach(path => {
      // Get country name from data-name attribute
      const countryName = path.getAttribute('data-name');
      if (!countryName) return;
      
      // Set default styling
      path.style.fill = '#e2e8f0'; // Default color
      path.style.stroke = '#94a3b8';
      path.style.strokeWidth = '0.5';
      path.style.cursor = gameState.isPlayerTurn ? 'pointer' : 'default';
      
      // Add event listeners
      path.addEventListener('mouseenter', () => {
        if (countryName) setHighlightedCountry(countryName);
        if (!isUsedCountry(countryName)) {
          path.style.fill = '#cbd5e1';
        }
      });
      
      path.addEventListener('mouseleave', () => {
        setHighlightedCountry(null);
        updateCountryColor(path, countryName);
      });
      
      path.addEventListener('click', () => {
        if (countryName) console.log(`Clicked on ${countryName}`);
      });
      
      // Set initial color based on game state
      updateCountryColor(path, countryName);
    });
  };

  // Update the map colors based on the latest game state
  useEffect(() => {
    if (!mapLoaded || !svgRef.current) return;
    
    const paths = svgRef.current.querySelectorAll('path');
    
    paths.forEach(path => {
      const countryName = path.getAttribute('data-name');
      if (countryName) {
        updateCountryColor(path, countryName);
      }
    });
  }, [gameState.playerHistory, gameState.computerHistory, gameState.currentCountry, mapLoaded]);

  // Check if a country is used in the game
  const isUsedCountry = (countryName: string | null): boolean => {
    if (!countryName) return false;
    return gameState.usedCountries.includes(countryName);
  };

  // Determine if a country belongs to the player
  const isPlayerCountry = (countryName: string | null): boolean => {
    if (!countryName) return false;
    return gameState.playerHistory.includes(countryName);
  };

  // Determine if a country belongs to the computer
  const isComputerCountry = (countryName: string | null): boolean => {
    if (!countryName) return false;
    return gameState.computerHistory.includes(countryName);
  };

  // Update country's fill color based on game state
  const updateCountryColor = (path: SVGPathElement, countryName: string | null) => {
    if (!countryName) return;
    
    if (countryName === gameState.currentCountry) {
      path.style.fill = '#10b981'; // Current country (emerald-500)
      path.style.stroke = '#047857';
      path.style.strokeWidth = '1';
    } else if (isPlayerCountry(countryName)) {
      path.style.fill = '#3b82f6'; // Player's countries (blue-500)
      path.style.stroke = '#2563eb';
      path.style.strokeWidth = '0.7';
    } else if (isComputerCountry(countryName)) {
      path.style.fill = '#ef4444'; // Computer's countries (red-500)
      path.style.stroke = '#dc2626';
      path.style.strokeWidth = '0.7';
    } else {
      path.style.fill = '#e2e8f0'; // Default color (slate-200)
      path.style.stroke = '#94a3b8';
      path.style.strokeWidth = '0.5';
    }
  };

  // Zoom functionality
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 8);
    setScale(newScale);
  };

  // Pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    
    setPosition({ 
      x: position.x + dx, 
      y: position.y + dy 
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Reset view
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Card className="p-2 overflow-hidden relative bg-white">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading map...</span>
        </div>
      ) : (
        <div 
          ref={containerRef}
          className="relative h-[70vh] w-full overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        >
          <svg 
            ref={svgRef}
            className="absolute"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center',
              width: '100%',
              height: '100%'
            }}
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMidYMid meet"
          />
          
          {highlightedCountry && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {highlightedCountry}
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <button 
              onClick={() => setScale(prev => Math.min(prev + 0.2, 8))}
              className="bg-white p-2 rounded shadow hover:bg-gray-100"
            >
              +
            </button>
            <button 
              onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
              className="bg-white p-2 rounded shadow hover:bg-gray-100"
            >
              -
            </button>
            <button 
              onClick={resetView}
              className="bg-white px-2 py-1 rounded shadow hover:bg-gray-100 text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WorldMap;

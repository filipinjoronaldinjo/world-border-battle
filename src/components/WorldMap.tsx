
import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { toast } from '@/components/ui/use-toast';

const WorldMap: React.FC = () => {
  const { gameState, makePlayerMove, setHighlightedCountry } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Use a reliable map source - Natural Earth Data styled SVG
    const mapUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
    
    // Use D3.js to render the map (this is just for fetching)
    fetch(mapUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(topojsonData => {
        // Since we can't directly use topojson in this context, let's use our uploaded SVG
        if (mapContainerRef.current) {
          // Use the uploaded map image instead
          mapContainerRef.current.innerHTML = `<svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
            <image href="/lovable-uploads/7376856b-6660-45bd-abd0-5a2cddaf5f14.png" width="1000" height="500" preserveAspectRatio="xMidYMid meet"/>
            
            <!-- Overlay clickable country regions -->
            <g id="countries">
              <!-- North America -->
              <path data-name="United States" d="M180 130 L210 150 L240 170 L250 190 L230 210 L210 215 L180 210 L150 200 L140 180 L150 160 L180 130" fill="transparent" />
              <path data-name="Canada" d="M200 100 L250 100 L300 120 L320 110 L340 120 L280 140 L270 160 L240 170 L210 150 L180 130 L200 100" fill="transparent" />
              <path data-name="Mexico" d="M150 200 L180 210 L210 215 L200 240 L180 250 L160 240 L140 220 L150 200" fill="transparent" />
              
              <!-- South America -->
              <path data-name="Brazil" d="M225 280 L250 275 L270 280 L290 290 L295 310 L280 330 L265 335 L250 330 L240 310 L225 300" fill="transparent" />
              <path data-name="Argentina" d="M240 340 L245 340 L260 345 L265 350 L260 370 L250 380 L240 370 L235 350" fill="transparent" />
              <path data-name="Peru" d="M210 300 L220 295 L240 310 L230 320 L215 315" fill="transparent" />
              <path data-name="Colombia" d="M205 263 L210 260 L220 270 L215 290 L205 295 L200 285 L203 275" fill="transparent" />
              
              <!-- Europe -->
              <path data-name="United Kingdom" d="M470 180 L480 165 L490 170 L485 185 L475 190" fill="transparent" />
              <path data-name="France" d="M460 220 L475 205 L490 210 L492 215 L485 240 L450 225" fill="transparent" />
              <path data-name="Germany" d="M500 207 L505 215 L515 210 L525 220 L515 195 L505 190" fill="transparent" />
              <path data-name="Italy" d="M485 240 L505 238 L485 210 L475 205 L460 220 L465 235" fill="transparent" />
              <path data-name="Spain" d="M450 225 L465 235 L460 250 L425 245 L430 230" fill="transparent" />
              <path data-name="Russia" d="M540 145 L570 115 L690 115 L715 160 L715 210 L650 225 L600 210 L580 215 L560 228 L555 223 L545 227 L538 232 L535 200 L530 185 L520 150" fill="transparent" />
              
              <!-- Africa -->
              <path data-name="Egypt" d="M558 265 L575 240 L590 245 L589 270 L565 280" fill="transparent" />
              <path data-name="Nigeria" d="M485 325 L495 330 L500 345 L490 340" fill="transparent" />
              <path data-name="South Africa" d="M560 410 L585 405 L595 415 L570 420" fill="transparent" />
              <path data-name="Algeria" d="M470 285 L495 270 L525 280 L530 305 L480 315" fill="transparent" />
              
              <!-- Asia -->
              <path data-name="China" d="M715 210 L715 160 L750 150 L790 170 L795 220 L780 235 L765 235 L755 240 L745 248 L740 241 L735 238 L725 238 L715 243 L710 240 L710 225 L695 215 L690 195 L670 190" fill="transparent" />
              <path data-name="India" d="M710 255 L740 230 L745 260 L730 280 L685 270 L685 260" fill="transparent" />
              <path data-name="Japan" d="M815 210 L825 200 L830 205 L820 215" fill="transparent" />
              <path data-name="Saudi Arabia" d="M600 260 L625 250 L640 270 L615 290 L590 270" fill="transparent" />
              
              <!-- Australia -->
              <path data-name="Australia" d="M775 355 L810 340 L830 365 L810 390 L775 380" fill="transparent" />
            </g>
          </svg>`;
          
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
              if (gameState.isPlayerTurn) {
                makePlayerMove(countryName);
                zoomToCountry(path as SVGPathElement);
              } else {
                toast({
                  title: "Not your turn",
                  description: "Please wait for computer to make a move",
                  variant: "destructive"
                });
              }
            });
          });
          
          setMapLoaded(true);
          updateCountryColors();
        }
      })
      .catch(error => {
        console.error("Error loading map:", error);
        
        // Fallback to a simple map using the uploaded image
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = `<svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
            <image href="/lovable-uploads/7376856b-6660-45bd-abd0-5a2cddaf5f14.png" width="1000" height="500" preserveAspectRatio="xMidYMid meet"/>
            
            <!-- Overlay clickable country regions -->
            <g id="countries">
              <!-- North America -->
              <path data-name="United States" d="M180 130 L210 150 L240 170 L250 190 L230 210 L210 215 L180 210 L150 200 L140 180 L150 160 L180 130" fill="transparent" />
              <path data-name="Canada" d="M200 100 L250 100 L300 120 L320 110 L340 120 L280 140 L270 160 L240 170 L210 150 L180 130 L200 100" fill="transparent" />
              <path data-name="Mexico" d="M150 200 L180 210 L210 215 L200 240 L180 250 L160 240 L140 220 L150 200" fill="transparent" />
              
              <!-- South America -->
              <path data-name="Brazil" d="M225 280 L250 275 L270 280 L290 290 L295 310 L280 330 L265 335 L250 330 L240 310 L225 300" fill="transparent" />
              <path data-name="Argentina" d="M240 340 L245 340 L260 345 L265 350 L260 370 L250 380 L240 370 L235 350" fill="transparent" />
              <path data-name="Peru" d="M210 300 L220 295 L240 310 L230 320 L215 315" fill="transparent" />
              <path data-name="Colombia" d="M205 263 L210 260 L220 270 L215 290 L205 295 L200 285 L203 275" fill="transparent" />
              
              <!-- Europe -->
              <path data-name="United Kingdom" d="M470 180 L480 165 L490 170 L485 185 L475 190" fill="transparent" />
              <path data-name="France" d="M460 220 L475 205 L490 210 L492 215 L485 240 L450 225" fill="transparent" />
              <path data-name="Germany" d="M500 207 L505 215 L515 210 L525 220 L515 195 L505 190" fill="transparent" />
              <path data-name="Italy" d="M485 240 L505 238 L485 210 L475 205 L460 220 L465 235" fill="transparent" />
              <path data-name="Spain" d="M450 225 L465 235 L460 250 L425 245 L430 230" fill="transparent" />
              <path data-name="Russia" d="M540 145 L570 115 L690 115 L715 160 L715 210 L650 225 L600 210 L580 215 L560 228 L555 223 L545 227 L538 232 L535 200 L530 185 L520 150" fill="transparent" />
              
              <!-- Africa -->
              <path data-name="Egypt" d="M558 265 L575 240 L590 245 L589 270 L565 280" fill="transparent" />
              <path data-name="Nigeria" d="M485 325 L495 330 L500 345 L490 340" fill="transparent" />
              <path data-name="South Africa" d="M560 410 L585 405 L595 415 L570 420" fill="transparent" />
              <path data-name="Algeria" d="M470 285 L495 270 L525 280 L530 305 L480 315" fill="transparent" />
              
              <!-- Asia -->
              <path data-name="China" d="M715 210 L715 160 L750 150 L790 170 L795 220 L780 235 L765 235 L755 240 L745 248 L740 241 L735 238 L725 238 L715 243 L710 240 L710 225 L695 215 L690 195 L670 190" fill="transparent" />
              <path data-name="India" d="M710 255 L740 230 L745 260 L730 280 L685 270 L685 260" fill="transparent" />
              <path data-name="Japan" d="M815 210 L825 200 L830 205 L820 215" fill="transparent" />
              <path data-name="Saudi Arabia" d="M600 260 L625 250 L640 270 L615 290 L590 270" fill="transparent" />
              
              <!-- Australia -->
              <path data-name="Australia" d="M775 355 L810 340 L830 365 L810 390 L775 380" fill="transparent" />
            </g>
          </svg>`;
          
          // Add event listeners to country paths for the fallback map too
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
              if (gameState.isPlayerTurn) {
                makePlayerMove(countryName);
                zoomToCountry(path as SVGPathElement);
              } else {
                toast({
                  title: "Not your turn",
                  description: "Please wait for computer to make a move",
                  variant: "destructive"
                });
              }
            });
          });
          
          setMapLoaded(true);
          updateCountryColors();
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
  }, [setHighlightedCountry, makePlayerMove, gameState.isPlayerTurn]);

  // Function to update country colors based on game state
  const updateCountryColors = () => {
    if (!mapContainerRef.current || !mapLoaded) return;
    
    // Reset all countries to default values
    const countryPaths = mapContainerRef.current.querySelectorAll('path[data-name]');
    countryPaths.forEach(path => {
      path.classList.remove('player-country', 'computer-country', 'highlighted');
      path.setAttribute('fill', 'transparent');
      path.setAttribute('stroke', 'rgba(255,255,255,0.5)');
      path.setAttribute('stroke-width', '0.5');
    });
    
    // Mark player countries
    gameState.playerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('player-country');
        path.setAttribute('fill', 'rgba(59, 130, 246, 0.7)'); // blue with opacity
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '0.5');
      }
    });
    
    // Mark computer countries
    gameState.computerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`path[data-name="${country}"]`);
      if (path) {
        path.classList.add('computer-country');
        path.setAttribute('fill', 'rgba(239, 68, 68, 0.7)'); // red with opacity
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '0.5');
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
  };

  // Add an explicit effect for updating country colors whenever game state changes
  useEffect(() => {
    updateCountryColors();
  }, [gameState.playerHistory, gameState.computerHistory, gameState.highlightedCountry, gameState.currentCountry, activeCountry, mapLoaded]);

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
      
      const svgWidth = svgElement.viewBox.baseVal.width || 1000;
      const svgHeight = svgElement.viewBox.baseVal.height || 500;
      
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
      <div className="map-container w-full h-[65vh] max-h-[800px] border rounded-lg shadow-lg overflow-hidden bg-black relative">
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
          cursor: pointer;
          transition: fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
        }
        
        .map-container path:hover {
          stroke: #10b981 !important;
          stroke-width: 1.5px !important;
        }
        
        .player-country {
          fill: rgba(59, 130, 246, 0.7) !important; /* blue with opacity */
          stroke-width: 0.5px;
          stroke: #ffffff;
        }
        
        .computer-country {
          fill: rgba(239, 68, 68, 0.7) !important; /* red with opacity */
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

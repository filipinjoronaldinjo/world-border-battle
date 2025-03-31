
import React, { useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';

const WorldMap: React.FC = () => {
  const { gameState, setHighlightedCountry } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const svgContent = `
    <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Example countries (simplified) -->
      <path id="Srbija" d="M520 235 L530 225 L540 230 L545 240 L535 245 L525 240 Z" />
      <path id="Hrvatska" d="M505 230 L520 235 L525 240 L515 245 L500 240 Z" />
      <path id="Bosna i Hercegovina" d="M515 245 L525 240 L535 245 L530 255 L520 255 Z" />
      <path id="Crna Gora" d="M530 255 L535 245 L545 240 L550 250 L540 260 Z" />
      <path id="Bugarska" d="M545 240 L555 235 L565 245 L560 255 L550 250 Z" />
      <path id="Severna Makedonija" d="M540 260 L550 250 L560 255 L555 265 L545 265 Z" />
      <path id="Albanija" d="M530 265 L540 260 L545 265 L540 275 L530 270 Z" />
      <path id="Grčka" d="M545 265 L555 265 L565 280 L540 290 L540 275 Z" />
      <path id="Rumunija" d="M540 230 L555 235 L565 225 L555 220 L545 225 Z" />
      <path id="Mađarska" d="M520 220 L530 225 L540 230 L535 215 L525 215 Z" />
      <path id="Austrija" d="M505 215 L520 220 L525 215 L515 205 L500 210 Z" />
      <path id="Slovenija" d="M500 220 L505 215 L500 210 L490 215 L495 225 Z" />
      <path id="Italija" d="M480 240 L490 215 L470 180 L450 210 L465 235 Z" />
      <path id="Švajcarska" d="M485 205 L490 215 L480 215 L475 205 L480 200 Z" />
      <path id="Francuska" d="M455 205 L475 205 L480 215 L465 235 L435 225 Z" />
      <path id="Nemačka" d="M485 190 L485 205 L475 205 L455 205 L465 185 Z" />
      <path id="Poljska" d="M515 185 L515 205 L495 190 L485 190 L495 180 Z" />
      <path id="Češka" d="M500 195 L515 205 L505 215 L485 205 L490 195 Z" />
      <path id="Slovačka" d="M525 200 L525 215 L515 205 L515 195 L520 195 Z" />
      <path id="Ukrajina" d="M555 205 L565 195 L575 215 L555 220 L535 215 L545 200 Z" />
      <path id="Belorusija" d="M545 180 L565 195 L545 200 L520 195 L530 180 Z" />
      <path id="Litvanija" d="M530 170 L545 180 L530 180 L525 175 Z" />
      <path id="Letonija" d="M535 160 L545 165 L545 175 L530 170 L530 165 Z" />
      <path id="Estonija" d="M535 150 L545 155 L545 165 L535 160 L530 155 Z" />
      <path id="Finska" d="M530 115 L545 145 L535 150 L515 130 L520 115 Z" />
      <path id="Švedska" d="M505 125 L515 130 L505 155 L495 145 L500 130 Z" />
      <path id="Norveška" d="M485 115 L505 125 L500 130 L485 135 L475 125 Z" />
      <path id="Danska" d="M485 175 L495 180 L495 185 L485 190 L480 180 Z" />
      <path id="Velika Britanija" d="M445 175 L460 165 L465 185 L445 195 L440 185 Z" />
      <path id="Irska" d="M430 175 L445 175 L440 185 L425 185 Z" />
      <path id="Španija" d="M435 225 L450 240 L440 255 L415 245 L425 230 Z" />
      <path id="Portugal" d="M415 245 L425 230 L415 220 L405 235 Z" />
      <path id="Rusija" d="M545 115 L755 115 L755 235 L575 215 L565 195 L545 175 L545 155 L535 150 L515 130 L520 115 Z" />
      <path id="Turska" d="M565 245 L575 215 L605 235 L585 255 L570 255 Z" />
      <path id="Gruzija" d="M605 235 L615 230 L620 235 L610 240 L605 240 Z" />
      <path id="Jermenija" d="M610 240 L620 235 L625 240 L620 245 L610 245 Z" />
      <path id="Azerbejdžan" d="M620 235 L630 235 L635 245 L625 240 Z" />
      <path id="Iran" d="M620 245 L635 245 L655 275 L630 275 L615 265 Z" />
      <path id="Irak" d="M605 240 L615 265 L600 265 L595 250 Z" />
      <path id="Sirija" d="M595 250 L605 240 L605 235 L585 255 Z" />
      <path id="Liban" d="M585 255 L590 245 L595 250 Z" />
      <path id="Izrael" d="M585 255 L590 260 L585 265 L580 260 Z" />
      <path id="Jordan" d="M590 260 L600 265 L595 270 L585 265 Z" />
      <path id="Saudijska Arabija" d="M600 265 L615 265 L630 275 L610 305 L585 295 L595 270 Z" />
      <path id="Egipat" d="M570 265 L585 265 L585 295 L565 295 Z" />
      <path id="Libija" d="M540 290 L565 295 L555 315 L525 315 Z" />
      <path id="Tunis" d="M500 265 L515 275 L505 285 L495 275 Z" />
      <path id="Alžir" d="M450 285 L495 275 L505 285 L525 315 L485 325 Z" />
      <path id="Maroko" d="M430 275 L450 285 L440 295 L420 290 Z" />
      <path id="Mauritanija" d="M430 305 L440 295 L485 325 L465 335 Z" />
      <path id="Mali" d="M465 335 L485 325 L525 345 L495 355 Z" />
      <path id="Niger" d="M525 315 L555 315 L555 345 L525 345 Z" />
      <path id="Čad" d="M555 315 L575 315 L575 345 L555 345 Z" />
      <path id="Sudan" d="M575 295 L585 295 L600 335 L575 345 L575 315 Z" />
      <path id="Etiopija" d="M600 335 L625 325 L615 345 L600 345 Z" />
      <path id="Somalija" d="M625 325 L635 335 L625 355 L615 345 Z" />
      <path id="Kenija" d="M600 345 L615 345 L620 365 L600 365 Z" />
      <path id="Tanzanija" d="M600 365 L620 365 L620 385 L600 385 Z" />
      <path id="Mozambik" d="M600 385 L620 385 L625 405 L605 405 Z" />
      <path id="Južnoafrička Republika" d="M575 405 L605 405 L605 425 L575 425 Z" />
      <path id="Angola" d="M555 375 L585 375 L585 395 L555 395 Z" />
      <path id="Demokratska Republika Kongo" d="M575 355 L595 355 L595 375 L555 375 Z" />
      <path id="Srednjoafrička Republika" d="M575 345 L595 345 L595 355 L575 355 Z" />
      <path id="Nigerija" d="M525 345 L555 345 L555 365 L525 365 Z" />
      <path id="Gana" d="M505 355 L525 355 L525 365 L505 365 Z" />
      <path id="Kazahstan" d="M605 175 L635 175 L635 215 L605 215 Z" />
      <path id="Uzbekistan" d="M635 195 L655 195 L655 215 L635 215 Z" />
      <path id="Turkmenistan" d="M635 215 L655 215 L655 235 L635 235 Z" />
      <path id="Avganistan" d="M655 235 L675 235 L675 255 L655 255 Z" />
      <path id="Pakistan" d="M655 255 L675 255 L675 275 L655 275 Z" />
      <path id="Indija" d="M675 255 L695 265 L695 295 L655 285 Z" />
      <path id="Kina" d="M675 195 L755 195 L755 265 L695 265 L675 255 L675 235 L655 215 L655 195 Z" />
      <path id="Mongolija" d="M675 175 L735 175 L735 195 L675 195 Z" />
      <path id="Severna Koreja" d="M755 195 L765 195 L765 210 L755 210 Z" />
      <path id="Južna Koreja" d="M765 210 L772 210 L772 220 L765 220 Z" />
      <path id="Japan" d="M780 195 L790 185 L790 205 L780 215 Z" />
      <path id="Tajland" d="M715 285 L725 285 L725 305 L715 305 Z" />
      <path id="Vijetnam" d="M725 285 L735 285 L735 305 L725 305 Z" />
      <path id="Malezija" d="M725 315 L735 315 L735 325 L725 325 Z" />
      <path id="Indonezija" d="M735 325 L765 325 L765 335 L735 335 Z" />
      <path id="Australija" d="M775 355 L805 355 L805 385 L775 385 Z" />
      <path id="Novi Zeland" d="M825 395 L835 395 L835 405 L825 405 Z" />
      <!-- Add more country paths as needed -->
    </svg>
  `;

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Insert the SVG into the DOM
    mapContainerRef.current.innerHTML = svgContent;
    
    // Add event listeners to country paths
    const countryPaths = mapContainerRef.current.querySelectorAll('path');
    countryPaths.forEach(path => {
      const countryId = path.getAttribute('id');
      if (!countryId) return;
      
      path.addEventListener('mouseenter', () => {
        setHighlightedCountry(countryId);
      });
      
      path.addEventListener('mouseleave', () => {
        setHighlightedCountry(null);
      });
    });
    
    return () => {
      // Clean up event listeners
      const countryPaths = mapContainerRef.current?.querySelectorAll('path');
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
    
    // Reset all countries to default
    const countryPaths = mapContainerRef.current.querySelectorAll('path');
    countryPaths.forEach(path => {
      path.classList.remove('player-country', 'computer-country', 'highlighted');
    });
    
    // Highlight player's countries
    gameState.playerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`#${CSS.escape(country)}`);
      if (path) path.classList.add('player-country');
    });
    
    // Highlight computer's countries
    gameState.computerHistory.forEach(country => {
      const path = mapContainerRef.current?.querySelector(`#${CSS.escape(country)}`);
      if (path) path.classList.add('computer-country');
    });
    
    // Highlight the currently hovered country
    if (gameState.highlightedCountry) {
      const path = mapContainerRef.current.querySelector(`#${CSS.escape(gameState.highlightedCountry)}`);
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


import React, { useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import MainMenu from '@/components/MainMenu';
import GameScreen from '@/components/GameScreen';
import EndScreen from '@/components/EndScreen';

const GameContainer: React.FC = () => {
  const { gameState } = useGame();

  // Preload SVG map
  useEffect(() => {
    const preloadMap = async () => {
      try {
        const response = await fetch('/assets/world-map.svg');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // We don't need to do anything with the response, just preload it
        await response.text();
        console.log("Map preloaded successfully");
      } catch (error) {
        console.error("Failed to preload map:", error);
      }
    };
    
    preloadMap();
  }, []);

  if (gameState.isGameOver) {
    return <EndScreen />;
  }

  if (gameState.isGameStarted) {
    return <GameScreen />;
  }

  return <MainMenu />;
};

const Index: React.FC = () => {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
};

export default Index;

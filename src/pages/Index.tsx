
import React, { useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import MainMenu from '@/components/MainMenu';
import GameScreen from '@/components/GameScreen';
import EndScreen from '@/components/EndScreen';

const GameContainer: React.FC = () => {
  const { gameState } = useGame();

  // Preload SVG mapa
  useEffect(() => {
    fetch('/src/assets/world-map.svg')
      .catch(error => {
        console.error("Failed to preload map:", error);
      });
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


import React, { useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import MainMenu from '@/components/MainMenu';
import GameScreen from '@/components/GameScreen';
import EndScreen from '@/components/EndScreen';
import { toast } from '@/components/ui/use-toast';

const GameContainer: React.FC = () => {
  const { gameState } = useGame();

  // Preload map assets
  useEffect(() => {
    const preloadMapAssets = async () => {
      try {
        // Preload the SVG map file
        const response = await fetch('/assets/world-map.svg');
        if (!response.ok) {
          throw new Error(`Failed to preload map: ${response.status}`);
        }
        await response.text();
        console.log("Map image preloaded successfully");
      } catch (error) {
        console.error("Error in preloading assets:", error);
        toast({
          title: "Warning",
          description: "Map assets failed to preload. There might be display issues.",
          variant: "destructive"
        });
      }
    };
    
    preloadMapAssets();
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

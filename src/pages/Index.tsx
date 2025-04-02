
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
        // Preload the uploaded map image
        const imgPreloader = new Image();
        imgPreloader.src = '/lovable-uploads/7376856b-6660-45bd-abd0-5a2cddaf5f14.png';
        imgPreloader.onload = () => {
          console.log("Map image preloaded successfully");
        };
        imgPreloader.onerror = (error) => {
          console.error("Failed to preload map image:", error);
          toast({
            title: "Warning",
            description: "Map assets failed to preload. There might be display issues.",
            variant: "destructive"
          });
        };
      } catch (error) {
        console.error("Error in preloading assets:", error);
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

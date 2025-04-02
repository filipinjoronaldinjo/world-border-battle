
import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import MainMenu from '@/components/MainMenu';
import GameScreen from '@/components/GameScreen';
import EndScreen from '@/components/EndScreen';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const GameContainer: React.FC = () => {
  const { gameState } = useGame();
  const [mapPreloading, setMapPreloading] = useState(true);

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
        setMapPreloading(false);
      } catch (error) {
        console.error("Error in preloading assets:", error);
        toast({
          title: "Warning",
          description: "Map assets failed to preload. There might be display issues.",
          variant: "destructive"
        });
        setMapPreloading(false);
      }
    };
    
    preloadMapAssets();

    // Set a timeout to handle cases where preloading takes too long
    const timeout = setTimeout(() => {
      if (mapPreloading) {
        setMapPreloading(false);
        toast({
          title: "Warning",
          description: "Map preloading took too long. There might be display issues.",
          variant: "destructive"
        });
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (mapPreloading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-bold">Loading map assets...</h2>
        <p className="text-gray-500 mt-2">Please wait while we prepare the game</p>
      </div>
    );
  }

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

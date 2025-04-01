
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import WorldMap from './WorldMap';
import CountryInput from './CountryInput';
import MoveHistory from './MoveHistory';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Flag, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { countryData } from '@/data/countryData';

const GameScreen: React.FC = () => {
  const { gameState, makePlayerMove, makeComputerMove, resetGame } = useGame();
  const [playerTurn, setPlayerTurn] = useState(true);
  const [computerThinking, setComputerThinking] = useState(false);

  // Computer logic based on difficulty
  const calculateComputerMove = () => {
    if (!gameState.currentCountry || !countryData[gameState.currentCountry]) {
      return null;
    }
    
    const neighbors = countryData[gameState.currentCountry].borders;
    const availableNeighbors = neighbors.filter(
      neighbor => !gameState.usedCountries.includes(neighbor) && countryData[neighbor]
    );
    
    if (availableNeighbors.length === 0) {
      return null;
    }
    
    // Easy level - random choice
    if (gameState.difficulty === 'lako') {
      const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
      return availableNeighbors[randomIndex];
    }
    
    // Medium level - prefers moves that lead player to dead end
    if (gameState.difficulty === 'srednje') {
      for (const neighbor of availableNeighbors) {
        const neighborBorders = countryData[neighbor].borders;
        const availableBorders = neighborBorders.filter(
          border => !gameState.usedCountries.includes(border) && border !== neighbor
        );
        
        if (availableBorders.length === 0) {
          return neighbor; // Found dead end for player
        }
      }
      
      const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
      return availableNeighbors[randomIndex];
    }
    
    // Hard level - uses advanced strategy
    if (gameState.difficulty === 'teško') {
      // Look for moves that lead directly to victory
      for (const neighbor of availableNeighbors) {
        const neighborBorders = countryData[neighbor].borders;
        const availableBorders = neighborBorders.filter(
          border => !gameState.usedCountries.includes(border) && border !== neighbor
        );
        
        if (availableBorders.length === 0) {
          return neighbor; // Direct win
        }
      }
      
      // Look for moves that give player fewest options
      let bestMove = null;
      let minOptions = Infinity;
      
      for (const neighbor of availableNeighbors) {
        const neighborBorders = countryData[neighbor].borders;
        const availableBorders = neighborBorders.filter(
          border => !gameState.usedCountries.includes(border) && border !== neighbor
        );
        
        // Check if player can win with any move
        const playerCanWin = availableBorders.some(border => {
          const borderBorders = countryData[border]?.borders || [];
          return borderBorders.every(b => 
            gameState.usedCountries.includes(b) || b === neighbor || !countryData[b]
          );
        });
        
        // If player cannot win and we have fewer options than before
        if (!playerCanWin && availableBorders.length < minOptions) {
          minOptions = availableBorders.length;
          bestMove = neighbor;
        }
      }
      
      // If no good move found, choose option with fewest possibilities
      if (!bestMove) {
        bestMove = availableNeighbors.reduce((best, current) => {
          const currentOptions = countryData[current].borders.filter(
            b => !gameState.usedCountries.includes(b) && b !== current
          ).length;
          
          const bestOptions = best ? countryData[best].borders.filter(
            b => !gameState.usedCountries.includes(b) && b !== best
          ).length : Infinity;
          
          return currentOptions < bestOptions ? current : best;
        }, null as string | null);
      }
      
      // If still no move, choose random
      if (!bestMove && availableNeighbors.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
        bestMove = availableNeighbors[randomIndex];
      }
      
      return bestMove;
    }
    
    // Default move if nothing else passes
    const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
    return availableNeighbors[randomIndex];
  };

  // Handle player move
  const handlePlayerMove = (country: string) => {
    if (!playerTurn) return; // Ignore move if not player's turn
    
    const moveSuccess = makePlayerMove(country);
    
    if (moveSuccess) {
      setPlayerTurn(false);
      
      if (!gameState.isGameOver) {
        // Add delay for computer move to feel more natural
        setComputerThinking(true);
        setTimeout(() => {
          const computerCountry = calculateComputerMove();
          makeComputerMove(computerCountry);
          setPlayerTurn(true);
          setComputerThinking(false);
          
          // Show toast notification for computer's move
          if (computerCountry) {
            toast({
              title: "Računar je odigrao",
              description: `Računar je izabrao državu: ${computerCountry}`,
              duration: 3000
            });
          }
        }, 1000); // 1 second delay for computer move
      }
    }
  };

  // Ensure the computer always makes a move after the first player move
  useEffect(() => {
    // Check if it's the first move (player has made a move but computer hasn't)
    if (gameState.playerHistory.length === 1 && gameState.computerHistory.length === 0 && !computerThinking && !gameState.isGameOver) {
      // Make computer's first move
      setPlayerTurn(false);
      setComputerThinking(true);
      
      setTimeout(() => {
        const computerCountry = calculateComputerMove();
        makeComputerMove(computerCountry);
        setPlayerTurn(true);
        setComputerThinking(false);
        
        // Show toast notification for computer's move
        if (computerCountry) {
          toast({
            title: "Računar je odigrao",
            description: `Računar je izabrao državu: ${computerCountry}`,
            duration: 3000
          });
        }
      }, 1000);
    }
  }, [gameState.playerHistory, gameState.computerHistory, computerThinking]);

  // Show notification for first move
  useEffect(() => {
    if (gameState.isGameStarted && gameState.playerHistory.length === 0) {
      toast({
        title: "Vaš potez",
        description: "Izaberite bilo koju državu za početak",
      });
    }
  }, [gameState.isGameStarted, gameState.playerHistory.length]);

  return (
    <div className="p-4 md:p-8 min-h-screen flex flex-col bg-gradient-to-b from-primary/10 to-background animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={resetGame}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Nazad
        </Button>
        
        <div className="flex items-center space-x-2">
          <Flag className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">
            Težina: {gameState.difficulty === 'lako' ? 'Lako' : 
              gameState.difficulty === 'srednje' ? 'Srednje' : 'Teško'}
          </h2>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 flex flex-col gap-6">
          {/* Mapa */}
          <WorldMap />
          
          {/* Unos i Status */}
          <div className="bg-card rounded-lg shadow-md p-6">
            {gameState.isGameOver ? (
              <div className="text-center py-4">
                <h3 className="text-xl font-semibold mb-2">
                  {gameState.playerWon ? 'Pobedili ste!' : 'Izgubili ste!'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {gameState.playerWon 
                    ? `Ne postoji država koja se graniči sa ${gameState.currentCountry}, a da već nije iskorišćena.` 
                    : `Ne postoji država koja se graniči sa ${gameState.currentCountry}, a da već nije iskorišćena.`}
                </p>
                <Button onClick={resetGame}>Nova igra</Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex items-center px-4 py-2 rounded-full bg-secondary text-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    {computerThinking ? (
                      <span className="text-muted-foreground animate-pulse">Računar razmišlja...</span>
                    ) : gameState.currentCountry ? (
                      <span>Trenutna država: <strong>{gameState.currentCountry}</strong></span>
                    ) : (
                      <span>Vaš prvi potez</span>
                    )}
                  </div>
                </div>
                
                <CountryInput onSubmit={handlePlayerMove} />
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Koristite strelice za navigaciju kroz predloge i Enter za potvrdu</p>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Bočna traka sa istorijom poteza */}
        <div className="lg:w-1/4">
          <MoveHistory />
          
          <div className="mt-6 bg-card rounded-lg shadow p-4">
            <h3 className="font-medium mb-2">Legenda:</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>Vaše države</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span>Države računara</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div>
                <span>Označena država</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-card rounded-lg shadow p-4">
            <h3 className="font-medium mb-2">Statistika:</h3>
            <div className="space-y-1">
              <p>Broj poteza: {gameState.playerHistory.length + gameState.computerHistory.length}</p>
              <p>Vaši potezi: {gameState.playerHistory.length}</p>
              <p>Potezi računara: {gameState.computerHistory.length}</p>
              <p>Preostale države: {Object.keys(countryData).length - gameState.usedCountries.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;

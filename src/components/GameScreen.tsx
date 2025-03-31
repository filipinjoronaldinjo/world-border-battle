
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

  // Računarska logika zasnovana na težini igre
  const calculateComputerMove = () => {
    // Ako nema trenutne države, ne možemo da napravimo potez
    if (!gameState.currentCountry || !countryData[gameState.currentCountry]) {
      return null;
    }
    
    const neighbors = countryData[gameState.currentCountry].borders;
    const availableNeighbors = neighbors.filter(
      neighbor => !gameState.usedCountries.includes(neighbor) && countryData[neighbor]
    );
    
    // Ako nema dostupnih suseda, računar je izgubio
    if (availableNeighbors.length === 0) {
      return null;
    }
    
    // Za lak nivo - nasumično bira
    if (gameState.difficulty === 'lako') {
      const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
      return availableNeighbors[randomIndex];
    }
    
    // Za srednji nivo - preferira države koje će dovesti igrača u ćorsokak
    if (gameState.difficulty === 'srednje') {
      // Prvo traži potez koji će dovesti igrača u ćorsokak
      for (const neighbor of availableNeighbors) {
        const neighborBorders = countryData[neighbor].borders;
        const availableBorders = neighborBorders.filter(
          border => !gameState.usedCountries.includes(border) && border !== neighbor
        );
        
        if (availableBorders.length === 0) {
          return neighbor; // Našli smo ćorsokak za igrača
        }
      }
      
      // Ako nema ćorsokaka, biramo nasumično
      const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
      return availableNeighbors[randomIndex];
    }
    
    // Za težak nivo - koristi naprednu strategiju
    if (gameState.difficulty === 'teško') {
      // Prvo traži potez koji vodi direktno do pobede
      for (const neighbor of availableNeighbors) {
        const neighborBorders = countryData[neighbor].borders;
        const availableBorders = neighborBorders.filter(
          border => !gameState.usedCountries.includes(border) && border !== neighbor
        );
        
        if (availableBorders.length === 0) {
          return neighbor; // Direktna pobeda
        }
      }
      
      // Zatim traži potez koji nudi najmanje opcija igraču
      let bestMove = null;
      let minOptions = Infinity;
      
      for (const neighbor of availableNeighbors) {
        const neighborBorders = countryData[neighbor].borders;
        const availableBorders = neighborBorders.filter(
          border => !gameState.usedCountries.includes(border) && border !== neighbor
        );
        
        // Proveravamo da li igrač može da pobedi sa bilo kojim potezom
        const playerCanWin = availableBorders.some(border => {
          const borderBorders = countryData[border]?.borders || [];
          return borderBorders.every(b => 
            gameState.usedCountries.includes(b) || b === neighbor || !countryData[b]
          );
        });
        
        // Ako igrač ne može da pobedi i imamo manje opcija nego pre
        if (!playerCanWin && availableBorders.length < minOptions) {
          minOptions = availableBorders.length;
          bestMove = neighbor;
        }
      }
      
      // Ako nismo našli dobar potez, biramo opciju sa najmanje mogućnosti
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
      
      // Ako i dalje nemamo potez, biramo nasumično
      if (!bestMove && availableNeighbors.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
        bestMove = availableNeighbors[randomIndex];
      }
      
      return bestMove;
    }
    
    // Podrazumevani potez ako ništa drugo ne prođe
    const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
    return availableNeighbors[randomIndex];
  };

  // Obrada poteza igrača
  const handlePlayerMove = (country: string) => {
    if (!playerTurn) return; // Ignoriši potez ako nije igrač na potezu
    
    const moveSuccess = makePlayerMove(country);
    
    if (moveSuccess) {
      setPlayerTurn(false);
      
      if (!gameState.isGameOver) {
        // Dodaj kašnjenje za potez računara da bi izgledalo prirodnije
        setComputerThinking(true);
        setTimeout(() => {
          const computerCountry = calculateComputerMove();
          makeComputerMove(computerCountry);
          setPlayerTurn(true);
          setComputerThinking(false);
        }, 1500);
      }
    }
  };

  // Prikaži obaveštenje za prvi potez
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

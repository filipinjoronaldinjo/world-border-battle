
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft, Flag, MapPin } from 'lucide-react';

const EndScreen: React.FC = () => {
  const { gameState, resetGame } = useGame();

  if (!gameState.isGameOver) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary/5 to-background animate-scale-in">
      <div className="w-full max-w-xl bg-card rounded-xl shadow-lg overflow-hidden">
        <div className={`p-6 ${gameState.playerWon ? 'bg-game-blue/10' : 'bg-game-red/10'}`}>
          <div className="flex justify-center mb-4">
            <div className={`rounded-full p-4 ${gameState.playerWon ? 'bg-game-blue/20' : 'bg-game-red/20'}`}>
              <Trophy size={60} className={gameState.playerWon ? 'text-game-blue' : 'text-game-red'} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2">
            {gameState.playerWon ? 'Čestitamo! Pobedili ste!' : 'Kraj igre! Izgubili ste!'}
          </h1>
          
          <p className="text-center text-muted-foreground mb-6">
            {gameState.playerWon 
              ? 'Uspešno ste nadmudrili računar u znanju geografije!' 
              : 'Računar je pokazao bolje znanje geografije ovog puta.'}
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="flex items-center">
                <Flag className="mr-2 h-5 w-5 text-primary" />
                Težina
              </span>
              <span className="font-medium">
                {gameState.difficulty === 'lako' ? 'Laka' : 
                  gameState.difficulty === 'srednje' ? 'Srednja' : 'Teška'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Poslednja država
              </span>
              <span className="font-medium">{gameState.currentCountry}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span>Ukupan broj poteza</span>
              <span className="font-medium">{gameState.playerHistory.length + gameState.computerHistory.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span>Iskorišćene države</span>
              <span className="font-medium">{gameState.usedCountries.length}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => resetGame()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Povratak na meni
            </Button>
            
            <Button 
              className="flex-1"
              onClick={() => {
                const difficulty = gameState.difficulty;
                resetGame();
                // Start a new game with the same difficulty
                setTimeout(() => {
                  const { startGame } = useGame();
                  startGame(difficulty);
                }, 0);
              }}
            >
              Igraj ponovo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;

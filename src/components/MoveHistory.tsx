
import React from 'react';
import { useGame } from '@/context/GameContext';
import { ArrowRight } from 'lucide-react';

const MoveHistory: React.FC = () => {
  const { gameState } = useGame();

  // Combine player and computer moves to show the sequence
  const combinedMoves: Array<{ country: string; isPlayer: boolean }> = [];
  
  // Alternate player and computer moves
  const maxMoves = Math.max(
    gameState.playerHistory.length,
    gameState.computerHistory.length
  );
  
  for (let i = 0; i < maxMoves; i++) {
    if (i < gameState.playerHistory.length) {
      combinedMoves.push({ 
        country: gameState.playerHistory[i], 
        isPlayer: true 
      });
    }
    
    if (i < gameState.computerHistory.length) {
      combinedMoves.push({ 
        country: gameState.computerHistory[i], 
        isPlayer: false 
      });
    }
  }

  if (combinedMoves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg shadow">
        <p className="text-muted-foreground">Nema odigranih poteza</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow p-4 overflow-auto max-h-[300px]">
      <h3 className="font-medium mb-2">Odigrani potezi:</h3>
      
      <div className="flex flex-wrap items-center gap-2">
        {combinedMoves.map((move, index) => (
          <React.Fragment key={index}>
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                move.isPlayer 
                  ? 'bg-game-blue text-white' 
                  : 'bg-game-red text-white'
              }`}
            >
              {move.country}
            </span>
            
            {index < combinedMoves.length - 1 && (
              <ArrowRight size={16} className="text-muted-foreground" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MoveHistory;

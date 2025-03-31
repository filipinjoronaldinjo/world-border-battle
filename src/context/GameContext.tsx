
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { countryData } from '@/data/countryData';

export type DifficultyLevel = 'lako' | 'srednje' | 'teško';

interface GameState {
  isGameStarted: boolean;
  isGameOver: boolean;
  difficulty: DifficultyLevel;
  usedCountries: string[];
  playerWon: boolean | null;
  currentCountry: string | null;
  highlightedCountry: string | null;
  playerHistory: string[];
  computerHistory: string[];
}

interface GameContextType {
  gameState: GameState;
  startGame: (difficulty: DifficultyLevel) => void;
  resetGame: () => void;
  makePlayerMove: (country: string) => boolean;
  makeComputerMove: () => void;
  setHighlightedCountry: (country: string | null) => void;
  getAvailableCountries: (forCountry?: string) => string[];
}

const initialGameState: GameState = {
  isGameStarted: false,
  isGameOver: false,
  difficulty: 'lako',
  usedCountries: [],
  playerWon: null,
  currentCountry: null,
  highlightedCountry: null,
  playerHistory: [],
  computerHistory: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const startGame = (difficulty: DifficultyLevel) => {
    setGameState({
      ...initialGameState,
      isGameStarted: true,
      difficulty,
    });
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const getAvailableCountries = (forCountry?: string): string[] => {
    if (!forCountry) {
      return Object.keys(countryData);
    }

    if (!countryData[forCountry]) {
      return [];
    }

    return countryData[forCountry].borders.filter(
      (country) => !gameState.usedCountries.includes(country)
    );
  };

  const makePlayerMove = (country: string): boolean => {
    // Check if this is a valid move
    if (gameState.currentCountry && 
        !countryData[gameState.currentCountry].borders.includes(country)) {
      console.log(`Invalid move: ${country} does not border ${gameState.currentCountry}`);
      return false;
    }

    // Check if country has already been used
    if (gameState.usedCountries.includes(country)) {
      console.log(`Country ${country} has already been used`);
      return false;
    }

    // Make the move
    const newUsedCountries = [...gameState.usedCountries, country];
    const newPlayerHistory = [...gameState.playerHistory, country];

    // Check if player has won
    const availableForComputer = countryData[country].borders.filter(
      (c) => !newUsedCountries.includes(c)
    );

    if (availableForComputer.length === 0) {
      setGameState({
        ...gameState,
        isGameOver: true,
        playerWon: true,
        usedCountries: newUsedCountries,
        currentCountry: country,
        playerHistory: newPlayerHistory,
      });
      return true;
    }

    setGameState({
      ...gameState,
      usedCountries: newUsedCountries,
      currentCountry: country,
      playerHistory: newPlayerHistory,
    });
    return true;
  };

  const makeComputerMove = () => {
    if (!gameState.currentCountry || gameState.isGameOver) return;

    const currentCountry = gameState.currentCountry;
    const availableCountries = countryData[currentCountry].borders.filter(
      (country) => !gameState.usedCountries.includes(country)
    );

    if (availableCountries.length === 0) {
      // Computer lost
      setGameState({
        ...gameState,
        isGameOver: true,
        playerWon: true,
      });
      return;
    }

    let computerChoice: string;

    if (gameState.difficulty === 'lako') {
      // Easy: Random choice
      const randomIndex = Math.floor(Math.random() * availableCountries.length);
      computerChoice = availableCountries[randomIndex];
    } 
    else if (gameState.difficulty === 'srednje') {
      // Medium: Try to find a country that has no more available borders
      computerChoice = availableCountries.find(country => {
        const nextAvailable = countryData[country].borders.filter(
          c => !gameState.usedCountries.includes(c) && c !== country
        );
        return nextAvailable.length === 0;
      }) || availableCountries[Math.floor(Math.random() * availableCountries.length)];
    } 
    else {
      // Hard: Find country with minimum options for player
      let minOptions = Number.MAX_SAFE_INTEGER;
      let bestCountry = availableCountries[0];

      for (const country of availableCountries) {
        const nextOptions = countryData[country].borders.filter(
          c => !gameState.usedCountries.includes(c) && c !== country
        ).length;

        if (nextOptions < minOptions) {
          minOptions = nextOptions;
          bestCountry = country;
        }
      }
      computerChoice = bestCountry;
    }

    const newUsedCountries = [...gameState.usedCountries, computerChoice];
    const newComputerHistory = [...gameState.computerHistory, computerChoice];

    // Check if computer has won
    const availableForPlayer = countryData[computerChoice].borders.filter(
      (c) => !newUsedCountries.includes(c)
    );

    if (availableForPlayer.length === 0) {
      setGameState({
        ...gameState,
        isGameOver: true,
        playerWon: false,
        usedCountries: newUsedCountries,
        currentCountry: computerChoice,
        computerHistory: newComputerHistory,
      });
      return;
    }

    setGameState({
      ...gameState,
      usedCountries: newUsedCountries,
      currentCountry: computerChoice,
      computerHistory: newComputerHistory,
    });
  };

  const setHighlightedCountry = (country: string | null) => {
    setGameState({
      ...gameState,
      highlightedCountry: country,
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        resetGame,
        makePlayerMove,
        makeComputerMove,
        setHighlightedCountry,
        getAvailableCountries,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Globe, Info, Gamepad } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { DifficultyLevel } from '@/context/GameContext';

const MainMenu: React.FC = () => {
  const { startGame } = useGame();

  const handleStartGame = (difficulty: DifficultyLevel) => {
    startGame(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-3xl w-full flex flex-col items-center text-center animate-fade-in">
        <div className="mb-8">
          <Globe size={80} className="text-primary mb-4" />
          <h1 className="text-5xl font-bold mb-2">Igra Državnih Granica</h1>
          <p className="text-xl text-muted-foreground">
            Testirajte svoje znanje geografije u igri protiv kompjutera
          </p>
        </div>

        <div className="grid gap-6 w-full max-w-md mb-8">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <Gamepad className="mr-2" /> Izaberite težinu
            </h2>
            <div className="space-y-4">
              <Button 
                className="w-full py-6 text-lg hover:scale-105 transition-transform" 
                variant="outline"
                onClick={() => handleStartGame('lako')}
              >
                Lako
              </Button>
              <Button 
                className="w-full py-6 text-lg hover:scale-105 transition-transform" 
                onClick={() => handleStartGame('srednje')}
              >
                Srednje
              </Button>
              <Button 
                className="w-full py-6 text-lg hover:scale-105 transition-transform bg-primary/90 hover:bg-primary"
                onClick={() => handleStartGame('teško')}
              >
                Teško
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 p-6 rounded-lg max-w-lg">
          <h3 className="flex items-center justify-center text-xl font-semibold mb-2">
            <Info className="mr-2 h-5 w-5" /> Kako igrati
          </h3>
          <p className="text-muted-foreground text-left">
            Igra počinje kada vi odaberete državu. Kompjuter odgovara državom koja se graniči sa vašom. 
            Vi zatim birate državu koja se graniči sa državom koju je izabrao kompjuter. 
            Igra se nastavlja dok neko ne može da pronađe državu koja se graniči sa poslednjom odabranom, 
            a da ta država već nije iskorišćena.
          </p>
        </div>

        <div className="mt-8 flex items-center">
          <Shield className="text-primary mr-2" />
          <p className="text-sm text-muted-foreground">Kreirano sa ❤️</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

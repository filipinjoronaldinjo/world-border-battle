
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/context/GameContext';
import { countryData } from '@/data/countryData';
import { toast } from '@/components/ui/use-toast';

interface CountryInputProps {
  onSubmit: (country: string) => void;
}

const CountryInput: React.FC<CountryInputProps> = ({ onSubmit }) => {
  const { gameState, getAvailableCountries } = useGame();
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const availableCountries = gameState.currentCountry 
    ? getAvailableCountries(gameState.currentCountry) 
    : Object.keys(countryData);

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      const match = findSuggestion(value);
      setSuggestion(match);
    } else {
      setSuggestion(null);
    }
  };

  const findSuggestion = (text: string): string | null => {
    const normalizedText = text.toLocaleLowerCase('sr-Latn');
    
    // First try exact available countries that start with the input
    for (const country of availableCountries) {
      if (country.toLocaleLowerCase('sr-Latn').startsWith(normalizedText)) {
        return country;
      }
    }
    
    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestion) {
      submitCountry(suggestion);
    } else if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setInput(suggestion);
      setSuggestion(null);
    }
  };

  const submitCountry = (country: string) => {
    if (!availableCountries.includes(country)) {
      toast({
        title: "Neispravan izbor",
        description: gameState.currentCountry 
          ? `${country} se ne graniči sa ${gameState.currentCountry}`
          : `${country} nije važeća država`,
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(country);
    setInput('');
    setSuggestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestion) {
      submitCountry(suggestion);
    } else if (input && availableCountries.includes(input)) {
      submitCountry(input);
    }
  };

  const displayValue = input || '';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={gameState.currentCountry 
            ? `Nađi državu koja se graniči sa ${gameState.currentCountry}...` 
            : "Unesite ime države..."}
          className="pr-24 py-6 text-lg"
          disabled={gameState.isGameOver}
        />
        
        {suggestion && (
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div className="pl-4 text-lg text-muted-foreground">
              <span className="invisible">{input}</span>
              <span>{suggestion.slice(input.length)}</span>
            </div>
          </div>
        )}
        
        <Button 
          type="submit"
          className="absolute right-1 top-1 bottom-1"
          disabled={!suggestion && !availableCountries.includes(input)}
        >
          Igraj
        </Button>
      </div>
    </form>
  );
};

export default CountryInput;

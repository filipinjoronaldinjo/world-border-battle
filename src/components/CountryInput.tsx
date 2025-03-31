
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const availableCountries = gameState.currentCountry 
    ? getAvailableCountries(gameState.currentCountry) 
    : Object.keys(countryData);

  useEffect(() => {
    // Fokusiranje na input polje kada se komponenta montira
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Handler za klik van dropdown-a
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      const matches = findSuggestions(value);
      setSuggestions(matches);
      setSelectedIndex(0);
      setShowDropdown(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const findSuggestions = (text: string): string[] => {
    const normalizedText = text.toLocaleLowerCase('sr-Latn');
    
    return availableCountries.filter(country => 
      country.toLocaleLowerCase('sr-Latn').includes(normalizedText)
    ).sort((a, b) => {
      // Prvo prikazujemo one koje počinju sa unetim tekstom
      const aStartsWith = a.toLocaleLowerCase('sr-Latn').startsWith(normalizedText);
      const bStartsWith = b.toLocaleLowerCase('sr-Latn').startsWith(normalizedText);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.localeCompare(b, 'sr-Latn');
    }).slice(0, 8); // Ograničimo na 8 predloga
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && showDropdown) {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp' && showDropdown) {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && showDropdown && suggestions.length > 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape' && showDropdown) {
      e.preventDefault();
      setShowDropdown(false);
    }
  };

  const selectSuggestion = (country: string) => {
    setInput(country);
    setShowDropdown(false);
    submitCountry(country);
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
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input && availableCountries.includes(input)) {
      submitCountry(input);
    } else if (suggestions.length > 0) {
      submitCountry(suggestions[selectedIndex]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (input.length > 0) {
              const matchedSuggestions = findSuggestions(input);
              setSuggestions(matchedSuggestions);
              setShowDropdown(matchedSuggestions.length > 0);
            }
          }}
          placeholder={gameState.currentCountry 
            ? `Nađi državu koja se graniči sa ${gameState.currentCountry}...` 
            : "Unesite ime države..."}
          className="py-6 text-lg"
          disabled={gameState.isGameOver}
        />
        
        <Button 
          type="submit"
          className="absolute right-1 top-1 bottom-1"
          disabled={!input || (!availableCountries.includes(input) && suggestions.length === 0)}
        >
          Igraj
        </Button>
      </div>
      
      {showDropdown && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li 
                key={suggestion}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${index === selectedIndex ? 'bg-blue-50 text-primary-foreground' : ''}`}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default CountryInput;

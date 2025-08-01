
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Pokemon } from "@/lib/types";
import { memo } from "react";
import './pokemon-card.css';
import { Skeleton } from "./ui/skeleton";

interface PokemonCardProps {
  pokemon: Pokemon;
  rating: number | undefined;
  onRatingChange: (pokemonId: string, rating: number) => void;
}

const RATING_VALUES = [0, 1, 2, 3, 4, 5, 6];

const getRatingColor = (rating: number | undefined) => {
  if (rating === undefined) return 'transparent';
  if (rating < 2) return 'rgb(255,104,102)'; // Red
  if (rating < 4) return 'rgb(221,186,92)'; // Amber
  return 'rgb(61,196,209)'; // Turquoise
};

const PokemonCardComponent = ({ pokemon, rating, onRatingChange }: PokemonCardProps) => {
  const handleRatingClick = (value: number) => {
    onRatingChange(pokemon.id, value);
  };

  const selectedColor = getRatingColor(rating);

  return (
    <Card className="flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-primary">
      <CardHeader className="p-4">
        <div className="relative w-24 h-24 mx-auto">
          {pokemon.sprite ? (
            <Image
                src={pokemon.sprite}
                alt={pokemon.name}
                width={96}
                height={96}
                className="object-contain"
                unoptimized
                data-ai-hint="pokemon sprite"
                loading="lazy"
            />
          ) : (
             <Skeleton className="w-24 h-24 rounded-full" />
          )}
        </div>
        <CardTitle className="text-sm md:text-base font-medium capitalize mt-2 tracking-tight">
          {pokemon.name.replace(/-/g, " ")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 w-full flex justify-center">
        <div className="rating-bar" role="radiogroup" aria-label={`Rating for ${pokemon.name}`}>
          {RATING_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              onClick={() => handleRatingClick(value)}
              className="rating-button"
              data-rating-value={value}
              style={rating === value ? { backgroundColor: selectedColor, color: '#fff' } : {}}
            >
              {value}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const PokemonCard = memo(PokemonCardComponent);

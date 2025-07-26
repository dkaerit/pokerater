"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Pokemon } from "@/lib/types";

interface PokemonCardProps {
  pokemon: Pokemon;
  rating: number | undefined;
  onRatingChange: (pokemonId: string, rating: number) => void;
}

const RATING_VALUES = [0, 1, 2, 3, 4, 5, 6];

export function PokemonCard({ pokemon, rating, onRatingChange }: PokemonCardProps) {
  const handleValueChange = (value: string) => {
    onRatingChange(pokemon.id, parseInt(value, 10));
  };

  return (
    <Card className="flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-primary">
      <CardHeader className="p-4">
        <div className="relative w-24 h-24 mx-auto">
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
        </div>
        <CardTitle className="text-sm md:text-base font-medium capitalize mt-2 tracking-tight">
          {pokemon.name.replace(/-/g, " ")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 w-full">
        <RadioGroup
          value={rating?.toString()}
          onValueChange={handleValueChange}
          className="flex justify-center items-center space-x-1"
          aria-label={`Rating for ${pokemon.name}`}
        >
          {RATING_VALUES.map((value) => (
            <div key={value} className="flex flex-col items-center space-y-1">
              <Label htmlFor={`${pokemon.id}-${value}`} className="text-xs">{value}</Label>
              <RadioGroupItem value={value.toString()} id={`${pokemon.id}-${value}`} />
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PokemonCard } from "@/components/pokemon-card";
import type { Generation, Ratings } from "@/lib/types";
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

interface GenerationAccordionProps {
  generation: Generation;
  ratings: Ratings;
  onRatingChange: (pokemonId: string, rating: number) => void;
  defaultOpen?: boolean;
}

export function GenerationAccordion({
  generation,
  ratings,
  onRatingChange,
  defaultOpen = false,
}: GenerationAccordionProps) {
  const averageScore = useMemo(() => {
    const ratedPokemon = generation.pokemon.filter((p) => ratings[p.id] !== undefined);
    if (ratedPokemon.length === 0) return 0;
    const totalScore = ratedPokemon.reduce((acc, p) => acc + (ratings[p.id] ?? 0), 0);
    return totalScore / ratedPokemon.length;
  }, [generation.pokemon, ratings]);

  const ratedCount = useMemo(() => {
     return generation.pokemon.filter((p) => ratings[p.id] !== undefined).length;
  }, [generation.pokemon, ratings]);
  
  const completionPercentage = (ratedCount / generation.pokemon.length) * 100;

  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? `item-${generation.id}` : undefined} className="w-full">
      <AccordionItem value={`item-${generation.id}`} className="border-b-0">
        <AccordionTrigger className="text-lg font-headline font-semibold capitalize hover:no-underline rounded-lg bg-card p-4">
          <div className="flex justify-between w-full items-center pr-4">
            <span>{generation.name.replace('generation-', 'Generation ')}</span>
            <div className="flex items-center gap-4">
               <div className="text-sm font-body font-normal text-muted-foreground hidden md:block">{ratedCount} / {generation.pokemon.length}</div>
               <span className="text-base font-body font-bold text-primary">Avg: {averageScore.toFixed(2)}</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4">
            <Progress value={completionPercentage} className="mb-4 h-2" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {generation.pokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                rating={ratings[pokemon.id]}
                onRatingChange={onRatingChange}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

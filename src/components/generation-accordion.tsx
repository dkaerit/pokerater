"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PokemonCard } from "@/components/pokemon-card";
import type { Generation, Ratings } from "@/lib/types";
import { useMemo, memo } from "react";
import { Progress } from "@/components/ui/progress";

interface GenerationAccordionProps {
  generation: Generation;
  ratings: Ratings;
  onRatingChange: (pokemonId: string, rating: number) => void;
  defaultOpen?: boolean;
  dictionary: any;
}

const getScoreColorClass = (score: number) => {
  if (score < 2) return "text-[rgb(255,104,102)]"; // Red
  if (score < 4) return "text-[rgb(221,186,92)]"; // Amber
  return "text-[rgb(61,196,209)]"; // Turquoise
};


const GenerationAccordionComponent = ({
  generation,
  ratings,
  onRatingChange,
  defaultOpen = false,
  dictionary,
}: GenerationAccordionProps) => {
  const generationRatings = useMemo(() => {
    const relevantRatings: Ratings = {};
    for (const pokemon of generation.pokemon) {
      if (ratings[pokemon.id] !== undefined) {
        relevantRatings[pokemon.id] = ratings[pokemon.id];
      }
    }
    return relevantRatings;
  }, [generation.pokemon, ratings]);

  const averageScore = useMemo(() => {
    const ratedIds = Object.keys(generationRatings);
    if (ratedIds.length === 0) return 0;
    const totalScore = ratedIds.reduce((acc, id) => acc + (generationRatings[id] ?? 0), 0);
    return totalScore / ratedIds.length;
  }, [generationRatings]);

  const ratedCount = useMemo(() => {
     return Object.keys(generationRatings).length;
  }, [generationRatings]);
  
  const completionPercentage = (ratedCount / generation.pokemon.length) * 100;
  
  const scoreColorClass = getScoreColorClass(averageScore);

  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? `item-${generation.id}` : undefined} className="w-full">
      <AccordionItem value={`item-${generation.id}`} className="border-b-0">
        <AccordionTrigger className="text-lg font-headline font-semibold hover:no-underline rounded-lg bg-card p-4">
          <div className="flex justify-between w-full items-center pr-4">
            <span>{generation.name}</span>
            <div className="flex items-center gap-4">
               <div className="text-sm font-body font-normal text-muted-foreground hidden md:block">{ratedCount} / {generation.pokemon.length}</div>
               <span className={`text-base font-body font-bold ${scoreColorClass}`}>{dictionary.scoreboard.avg}: {averageScore.toFixed(2)}</span>
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
};

export const GenerationAccordion = memo(GenerationAccordionComponent);

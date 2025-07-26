"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PokemonCard } from "@/components/pokemon-card";
import type { Generation, Ratings } from "@/lib/types";
import { useMemo, memo, useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "./ui/button";

interface GenerationAccordionProps {
  generation: Generation;
  ratings: Ratings;
  onRatingChange: (pokemonId: string, rating: number) => void;
  onFetchGeneration: (generationId: number) => Promise<void>;
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
  onFetchGeneration,
  dictionary,
}: GenerationAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const isDataLoaded = useMemo(() => generation.pokemon.every(p => p.sprite !== undefined), [generation.pokemon]);
  
  const handleTriggerClick = async () => {
    const currentlyOpen = !isOpen;
    setIsOpen(currentlyOpen);

    if (currentlyOpen && !isDataLoaded && !isLoading) {
      fetchData();
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(false);
    try {
      await onFetchGeneration(generation.id);
    } catch (e) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };


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
    <Accordion type="single" collapsible onValueChange={(value) => handleTriggerClick()} value={isOpen ? `item-${generation.id}` : ''}>
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
          {isLoading && (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
             </div>
          )}
          {error && (
            <div className="text-center py-6 bg-muted rounded-lg">
               <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
               <p className="mt-2 text-sm text-muted-foreground">{dictionary.errors?.generationLoad || 'Failed to load Pokémon.'}</p>
               <Button onClick={fetchData} variant="ghost" size="sm" className="mt-2">
                 <RotateCw className="mr-2 h-4 w-4" />
                 {dictionary.errors?.retry || 'Retry'}
               </Button>
            </div>
          )}
          {!isLoading && !error && isDataLoaded && (
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
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const GenerationAccordion = memo(GenerationAccordionComponent);

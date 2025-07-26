"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Scoreboard } from "@/components/scoreboard";
import { GenerationAccordion } from "@/components/generation-accordion";
import { usePokemonRatings } from "@/hooks/use-pokemon-ratings";
import type { Generation } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import { FavoritePokemonSelector } from "./favorite-pokemon-selector";

const MAX_GENERATIONS = 9;

async function fetchGenerations(): Promise<Generation[]> {
  const generationPromises = Array.from({ length: MAX_GENERATIONS }, (_, i) =>
    fetch(`https://pokeapi.co/api/v2/generation/${i + 1}`).then((res) =>
      res.json()
    )
  );

  const generationResults = await Promise.all(generationPromises);

  return generationResults.map((gen) => ({
    id: gen.id,
    name: gen.name.replace('generation-','Generation '),
    pokemon: gen.pokemon_species
      .map((p: { name: string; url: string }) => {
        const urlParts = p.url.split("/");
        const id = urlParts[urlParts.length - 2];
        if (parseInt(id) > 1025) return null; // Filter out pokemon beyond Paldea region
        return {
          id,
          name: p.name,
          sprite: `https://raw.githubusercontent.com/master-boilerplate/master-boilerplate/main/src/assets/pokemons/${id}.gif`,
        };
      })
      .filter(Boolean)
      .sort((a: {id: string}, b: {id: string}) => parseInt(a.id) - parseInt(b.id)),
  }));
}

function PokeRaterComponent() {
  const searchParams = useSearchParams();
  const ratingsParam = searchParams.get("ratings");
  const favoritesParam = searchParams.get("favorites");
  const { toast } = useToast();

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    ratings,
    favorites,
    handleRatingChange,
    handleFavoritesChange,
    generationScores,
    generateShareableLink,
    allPokemon,
  } = usePokemonRatings(generations, ratingsParam, favoritesParam);
  
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchGenerations();
        setGenerations(data);
      } catch (error) {
        console.error("Failed to fetch Pokemon data", error);
        toast({
          title: "Error",
          description: "Could not fetch Pokémon data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleShare = () => {
    const link = generateShareableLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Your ratings have been copied to the clipboard.",
    });
  };

  if (isLoading) {
    return (
       <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </div>
        <Skeleton className="h-72 w-full" />
        <div className="flex justify-end">
            <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tighter">
          PokeRater
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Rate your favorite Pokémon from each generation and see how they stack
          up. Share your definitive ranking with your friends!
        </p>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Scoreboard scores={generationScores} />
          </div>
          <FavoritePokemonSelector 
            allPokemon={allPokemon}
            ratings={ratings}
            favorites={favorites}
            onFavoritesChange={handleFavoritesChange}
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Your Ratings
          </Button>
        </div>

        <div className="space-y-4">
          {generations.map((gen, index) => (
            <GenerationAccordion
              key={gen.id}
              generation={gen}
              ratings={ratings}
              onRatingChange={handleRatingChange}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PokeRater() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PokeRaterComponent />
        </Suspense>
    )
}

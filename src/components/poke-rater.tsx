
"use client";

import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Scoreboard } from "@/components/scoreboard";
import { GenerationAccordion } from "@/components/generation-accordion";
import { usePokemonRatings } from "@/hooks/use-pokemon-ratings";
import type { Generation, Pokemon } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Share2, Link as LinkIcon, ImageDown, AlertCircle } from "lucide-react";
import { FavoritePokemonSelector } from "./favorite-pokemon-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as htmlToImage from 'html-to-image';


const MAX_GENERATIONS = 9;

async function fetchInitialGenerationList(dictionary: any): Promise<Generation[]> {
  const generationPromises = Array.from({ length: MAX_GENERATIONS }, (_, i) =>
    fetch(`https://pokeapi.co/api/v2/generation/${i + 1}`).then((res) =>
      res.json()
    )
  );
  const generationResults = await Promise.all(generationPromises);

  return generationResults.map((gen) => ({
    id: gen.id,
    name: `${dictionary.generation} ${gen.id}`,
    pokemon: gen.pokemon_species.map((p: { name: string, url: string }) => {
        const urlParts = p.url.split("/");
        const id = urlParts[urlParts.length - 2];
        return { id, name: p.name };
    }).filter((p: Pokemon) => parseInt(p.id) <= 1025)
     .sort((a: Pokemon, b: Pokemon) => parseInt(a.id) - parseInt(b.id)),
  }));
}

async function fetchPokemonDetailsForGeneration(pokemonList: Pokemon[]): Promise<Pokemon[]> {
    const pokemonPromises = pokemonList.map(p => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`)
        .then(res => {
            if (!res.ok) return null;
            return res.json();
        })
        .then(pokemonData => {
            if (!pokemonData) return { ...p, sprite: undefined };
            return {
                ...p,
                sprite: pokemonData.sprites.front_default,
            };
        })
        .catch(error => {
            console.warn(`Could not fetch data for pokemon id ${p.id}`, error);
            return { ...p, sprite: undefined };
        })
    );
    return Promise.all(pokemonPromises);
}


function PokeRaterComponent({ dictionary }: { dictionary: any }) {
  const searchParams = useSearchParams();
  const ratingsParam = searchParams.get("ratings");
  const favoritesParam = searchParams.get("favorites");
  const { toast } = useToast();

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shareableAreaRef = useRef<HTMLDivElement>(null);


  const {
    ratings,
    favorites,
    handleRatingChange,
    handleFavoritesChange,
    generationScores,
    generateShareableLink,
    allPokemon,
  } = usePokemonRatings(generations, ratingsParam, favoritesParam);
  
  const loadInitialData = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchInitialGenerationList(dictionary);
        setGenerations(data);
      } catch (e) {
        console.error("Failed to fetch initial Pokemon data", e);
        setError(dictionary.errors?.initialLoad || "Could not load generation data. Please refresh.");
        toast({
          title: "Error",
          description: dictionary.errors?.initialLoadToast || "Could not fetch generation data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
  }, [toast, dictionary]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Fetch favorite pokemon details on initial load
  useEffect(() => {
    if (favorites.length > 0 && allPokemon.length > 0) {
      const favoritePokemon = allPokemon.filter(p => favorites.includes(p.id));
      const unfetchedFavorites = favoritePokemon.filter(p => !p.sprite);

      if (unfetchedFavorites.length > 0) {
        fetchPokemonDetailsForGeneration(unfetchedFavorites).then(detailedFavorites => {
          const detailedMap = new Map(detailedFavorites.map(p => [p.id, p]));
          
          setGenerations(prevGens => {
            return prevGens.map(gen => ({
              ...gen,
              pokemon: gen.pokemon.map(p => detailedMap.get(p.id) || p)
            }))
          })
        });
      }
    }
  }, [favorites, allPokemon]);


  const handleFetchGeneration = useCallback(async (generationId: number) => {
      const generationIndex = generations.findIndex(g => g.id === generationId);
      if (generationIndex === -1) return;

      const generationToFetch = generations[generationIndex];
      // Avoid refetching if data is already present
      if (generationToFetch.pokemon.every(p => p.sprite !== undefined)) {
          return;
      }
      
      const detailedPokemon = await fetchPokemonDetailsForGeneration(generationToFetch.pokemon);

      setGenerations(prev => {
          const newGenerations = [...prev];
          newGenerations[generationIndex] = {
              ...newGenerations[generationIndex],
              pokemon: detailedPokemon,
          };
          return newGenerations;
      });
  }, [generations]);


  const handleShareLink = () => {
    const link = generateShareableLink();
    navigator.clipboard.writeText(link);
    toast({
      title: dictionary.share.toastTitle,
      description: dictionary.share.toastDescription,
    });
  };

  const handleShareImage = useCallback(() => {
    if (shareableAreaRef.current === null) {
      return
    }
    
    const filter = (node: HTMLElement) => {
      // we need to filter out the google fonts stylesheet
      if (node.tagName === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet' && (node as HTMLLinkElement).href.includes('fonts.googleapis.com')) {
          return false;
      }
      return true;
    }

    htmlToImage.toPng(shareableAreaRef.current, { cacheBust: true, backgroundColor: 'hsl(var(--background))', filter })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'pokerater-summary.png'
        link.href = dataUrl
        link.click()
         toast({
          title: dictionary.share.imageToastTitle,
          description: dictionary.share.imageToastDescription,
        });
      })
      .catch((err) => {
        console.log(err)
         toast({
          title: "Error",
          description: "Could not generate image. Please try again.",
          variant: "destructive",
        });
      })
  }, [shareableAreaRef, toast, dictionary])


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

  if (error) {
    return (
        <div className="text-center py-10">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-lg font-semibold">{dictionary.errors?.ohNo || 'Oh no!'}</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button onClick={loadInitialData} className="mt-6">
                {dictionary.errors?.retry || 'Retry'}
            </Button>
        </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tighter">
          {dictionary.title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {dictionary.description}
        </p>
      </header>

      <div className="space-y-6">
        <div ref={shareableAreaRef} className="bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Scoreboard scores={generationScores} dictionary={dictionary} />
            </div>
            <FavoritePokemonSelector 
              allPokemon={allPokemon}
              ratings={ratings}
              favorites={favorites}
              onFavoritesChange={handleFavoritesChange}
              dictionary={dictionary}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Share2 className="mr-2 h-4 w-4" />
                {dictionary.share.button}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleShareLink}>
                 <LinkIcon className="mr-2 h-4 w-4" />
                <span>{dictionary.share.copyLink}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareImage}>
                <ImageDown className="mr-2 h-4 w-4" />
                <span>{dictionary.share.downloadImage}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {generations.map((gen) => (
            <GenerationAccordion
              key={gen.id}
              generation={gen}
              ratings={ratings}
              onRatingChange={handleRatingChange}
              onFetchGeneration={handleFetchGeneration}
              dictionary={dictionary}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PokeRater({ dictionary }: { dictionary: any }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PokeRaterComponent dictionary={dictionary} />
        </Suspense>
    )
}

    
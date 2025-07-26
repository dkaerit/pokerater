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
import { Share2, Link as LinkIcon, ImageDown } from "lucide-react";
import { FavoritePokemonSelector } from "./favorite-pokemon-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as htmlToImage from 'html-to-image';


const MAX_GENERATIONS = 9;

async function fetchGenerations(dictionary: any): Promise<Generation[]> {
  const generationPromises = Array.from({ length: MAX_GENERATIONS }, (_, i) =>
    fetch(`https://pokeapi.co/api/v2/generation/${i + 1}`).then((res) =>
      res.json()
    )
  );

  const generationResults = await Promise.all(generationPromises);

  const generationsWithPokemon = await Promise.all(
    generationResults.map(async (gen) => {
      const pokemonPromises = gen.pokemon_species
        .map((p: { name: string; url: string }) => {
          const urlParts = p.url.split("/");
          const id = urlParts[urlParts.length - 2];
          if (parseInt(id) > 1025) return null; // Filter out pokemon beyond Paldea region
          
          return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            })
            .then(pokemonData => {
                if (!pokemonData) return null;
                return {
                  id,
                  name: p.name,
                  sprite: pokemonData.sprites.front_default,
                };
            })
            .catch(error => {
                console.warn(`Could not fetch data for pokemon id ${id}`, error);
                return null; // Return null if fetch fails for any reason
            });
        })
        .filter(Boolean);

      const pokemon = (await Promise.all(pokemonPromises)).filter((p): p is Pokemon => p !== null);

      return {
        id: gen.id,
        name: `${dictionary.generation} ${gen.id}`,
        pokemon: pokemon.sort((a: {id: string}, b: {id:string}) => parseInt(a.id) - parseInt(b.id)),
      };
    })
  );

  return generationsWithPokemon;
}


function PokeRaterComponent({ dictionary }: { dictionary: any }) {
  const searchParams = useSearchParams();
  const ratingsParam = searchParams.get("ratings");
  const favoritesParam = searchParams.get("favorites");
  const { toast } = useToast();

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchGenerations(dictionary);
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
  }, [toast, dictionary]);

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

    htmlToImage.toPng(shareableAreaRef.current, { cacheBust: true, backgroundColor: '#111827', filter })
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

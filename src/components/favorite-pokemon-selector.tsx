
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Pokemon, Ratings } from "@/lib/types";
import "./favorite-pokemon-selector.css";

interface FavoritePokemonSelectorProps {
  allPokemon: Pokemon[];
  ratings: Ratings;
  favorites: string[];
  onFavoritesChange: (favorites: string[]) => void;
  dictionary: any;
}

export function FavoritePokemonSelector({
  allPokemon,
  ratings,
  favorites,
  onFavoritesChange,
  dictionary
}: FavoritePokemonSelectorProps) {
  const [isListVisible, setIsListVisible] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const sixStarPokemon = useMemo(() => {
    return allPokemon.filter((p) => ratings[p.id] === 6);
  }, [allPokemon, ratings]);

  const favoritePokemonDetails = useMemo(() => {
    return favorites
      .map((id) => allPokemon.find((p) => p.id === id))
      .filter((p): p is Pokemon => p !== undefined);
  }, [favorites, allPokemon]);

  const availableToSelect = useMemo(() => {
    const favoriteIds = new Set(favorites);
    return sixStarPokemon.filter((p) => !favoriteIds.has(p.id));
  }, [sixStarPokemon, favorites]);

  const handleSelectPokemon = (pokemonId: string) => {
    if (favorites.length < 6) {
      onFavoritesChange([...favorites, pokemonId]);
    }
  };

  const handleRemovePokemon = (pokemonId: string) => {
    onFavoritesChange(favorites.filter((id) => id !== pokemonId));
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData("draggedIndex", index.toString());
    setDraggedIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropIndex(null);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDropIndex(index);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault();
      setDropIndex(null);
  }

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    const draggedItemIndex = parseInt(e.dataTransfer.getData("draggedIndex"), 10);
    const newFavorites = [...favorites];
    const [draggedItem] = newFavorites.splice(draggedItemIndex, 1);
    newFavorites.splice(dropIndex, 0, draggedItem);
    onFavoritesChange(newFavorites);
    handleDragEnd();
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault();
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">{dictionary.top6.title}</CardTitle>
        <CardDescription>
          {dictionary.top6.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {isListVisible ? (
          <div className="flex-grow flex flex-col">
            <h4 className="font-semibold mb-2 text-sm">{dictionary.top6.addTitle} ({favorites.length}/6)</h4>
            <ScrollArea className="h-48 border rounded-md">
              <div className="p-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableToSelect.map((pokemon) => (
                  <button
                    key={pokemon.id}
                    onClick={() => handleSelectPokemon(pokemon.id)}
                    className="flex flex-col items-center p-1 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={favorites.length >= 6}
                    title={pokemon.name}
                  >
                    {pokemon.sprite ? (
                        <Image
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          width={64}
                          height={64}
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                  </button>
                ))}
              </div>
            </ScrollArea>
            <Button onClick={() => setIsListVisible(false)} variant="secondary" className="mt-4">
              {dictionary.top6.backButton}
            </Button>
          </div>
        ) : (
          <div className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow">
               <ol className="space-y-2">
                {favoritePokemonDetails.map((pokemon, index) => {
                  const isBeingDragged = draggedIndex === index;
                  const isDropTarget = dropIndex === index;
                  
                  return (
                  <li
                    key={pokemon.id}
                    className={`favorite-item ${isBeingDragged ? 'dragging' : ''} ${isDropTarget ? 'drop-target' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                  >
                    <span className="text-lg font-bold text-primary w-8">{index + 1}.</span>
                     {pokemon.sprite ? (
                        <Image
                            src={pokemon.sprite}
                            alt={pokemon.name}
                            width={40}
                            height={40}
                            className="object-contain mx-2"
                            unoptimized
                        />
                     ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md mx-2">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                     )}
                    <span className="flex-grow capitalize text-sm">{pokemon.name}</span>
                    <button onClick={() => handleRemovePokemon(pokemon.id)} className="p-1 text-muted-foreground hover:text-destructive">
                       <Trash2 className="w-4 h-4" />
                    </button>
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab ml-1" />
                  </li>
                  )
                })}
                {Array.from({ length: 6 - favorites.length }).map((_, index) => (
                    <li key={`placeholder-${index}`} className="flex items-center bg-muted/50 p-2 rounded-md border-dashed border-2 h-[58px]">
                       <span className="text-lg font-bold text-muted-foreground w-8">{favorites.length + index + 1}.</span>
                       <Button 
                        variant="ghost" 
                        className="ml-auto" 
                        onClick={() => setIsListVisible(true)} 
                        disabled={sixStarPokemon.length === 0}
                        aria-label="Add Pokémon"
                       >
                         <Plus className="w-5 h-5" />
                       </Button>
                    </li>
                ))}
              </ol>
            </ScrollArea>
             {favorites.length === 0 && sixStarPokemon.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-4 p-4 bg-muted/50 rounded-md">
                {dictionary.top6.emptyState}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Ratings, Generation, Score, Pokemon } from "@/lib/types";

const POKERATER_STORAGE_KEY = "pokeRaterRatings";
const FAVORITES_STORAGE_KEY = "pokeRaterFavorites";

export function usePokemonRatings(
  generations: Generation[],
  ratingsParam: string | null,
  favoritesParam: string | null
) {
  const [ratings, setRatings] = useState<Ratings>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    let initialRatings: Ratings = {};
    if (ratingsParam) {
      try {
        initialRatings = JSON.parse(atob(ratingsParam));
      } catch (error) {
        console.error("Failed to parse ratings from URL", error);
        const savedRatings = localStorage.getItem(POKERATER_STORAGE_KEY);
        if (savedRatings) {
          initialRatings = JSON.parse(savedRatings);
        }
      }
    } else {
      const savedRatings = localStorage.getItem(POKERATER_STORAGE_KEY);
      if (savedRatings) {
        initialRatings = JSON.parse(savedRatings);
      }
    }
    setRatings(initialRatings);

    let initialFavorites: string[] = [];
     if (favoritesParam) {
      try {
        initialFavorites = JSON.parse(atob(favoritesParam));
      } catch (error) {
        console.error("Failed to parse favorites from URL", error);
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (savedFavorites) {
          initialFavorites = JSON.parse(savedFavorites);
        }
      }
    } else {
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (savedFavorites) {
          initialFavorites = JSON.parse(savedFavorites);
        }
    }
    setFavorites(initialFavorites);

  }, [ratingsParam, favoritesParam]);

  useEffect(() => {
    if (Object.keys(ratings).length > 0) {
      localStorage.setItem(POKERATER_STORAGE_KEY, JSON.stringify(ratings));
    }
  }, [ratings]);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  const handleRatingChange = useCallback((pokemonId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [pokemonId]: rating }));
  }, []);

  const handleFavoritesChange = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
  }, []);

  const generateShareableLink = useCallback(() => {
    const jsonRatings = JSON.stringify(ratings);
    const base64Ratings = btoa(jsonRatings);
    const jsonFavorites = JSON.stringify(favorites);
    const base64Favorites = btoa(jsonFavorites);

    const url = new URL(window.location.href);
    url.searchParams.set("ratings", base64Ratings);
    url.searchParams.set("favorites", base64Favorites);
    return url.toString();
  }, [ratings, favorites]);

  const generationScores = useMemo<Score[]>(() => {
    if (!generations.length) return [];

    return generations.map((gen) => {
      const ratedPokemon = gen.pokemon.filter((p) => ratings[p.id] !== undefined);
      if (ratedPokemon.length === 0) {
        return { name: gen.name, score: 0, generation: `Gen ${gen.id}` };
      }
      const totalScore = ratedPokemon.reduce(
        (acc, p) => acc + (ratings[p.id] ?? 0),
        0
      );
      const averageScore = totalScore / ratedPokemon.length;
      return {
        name: gen.name,
        score: parseFloat(averageScore.toFixed(2)),
        generation: `Gen ${gen.id}`,
      };
    });
  }, [generations, ratings]);
  
  const allPokemon = useMemo<Pokemon[]>(() => {
    return generations.flatMap(gen => gen.pokemon);
  }, [generations]);


  return {
    ratings,
    favorites,
    handleRatingChange,
    handleFavoritesChange,
    generationScores,
    generateShareableLink,
    allPokemon,
  };
}
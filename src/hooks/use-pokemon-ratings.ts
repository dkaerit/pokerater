"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Ratings, Generation, Score } from "@/lib/types";

const POKERATER_STORAGE_KEY = "pokeRaterRatings";

export function usePokemonRatings(
  generations: Generation[],
  ratingsParam: string | null
) {
  const [ratings, setRatings] = useState<Ratings>({});

  useEffect(() => {
    let initialRatings: Ratings = {};
    if (ratingsParam) {
      try {
        initialRatings = JSON.parse(atob(ratingsParam));
      } catch (error) {
        console.error("Failed to parse ratings from URL", error);
        // Fallback to localStorage if URL param is invalid
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
  }, [ratingsParam]);

  useEffect(() => {
    // Only save to localStorage if there are ratings to save
    if (Object.keys(ratings).length > 0) {
      localStorage.setItem(POKERATER_STORAGE_KEY, JSON.stringify(ratings));
    }
  }, [ratings]);

  const handleRatingChange = useCallback((pokemonId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [pokemonId]: rating }));
  }, []);

  const generateShareableLink = useCallback(() => {
    const jsonRatings = JSON.stringify(ratings);
    const base64Ratings = btoa(jsonRatings);
    const url = new URL(window.location.href);
    url.searchParams.set("ratings", base64Ratings);
    return url.toString();
  }, [ratings]);

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

  return {
    ratings,
    handleRatingChange,
    generationScores,
    generateShareableLink,
  };
}


"use client";

import { useSearchParams } from "next/navigation";
import { PokeRaterComponent } from "./poke-rater-component";

export function PokeRater({ dictionary }: { dictionary: any }) {
    const searchParams = useSearchParams();
    const ratingsParam = searchParams.get("ratings");
    const favoritesParam = searchParams.get("favorites");

    return (
        <PokeRaterComponent 
            dictionary={dictionary} 
            ratingsParam={ratingsParam}
            favoritesParam={favoritesParam}
        />
    )
}


"use client";

import { Suspense } from "react";
import { PokeRaterComponent } from "./poke-rater-component";


export function PokeRater({ dictionary }: { dictionary: any }) {
    return (
        <Suspense>
            <PokeRaterComponent dictionary={dictionary} />
        </Suspense>
    )
}

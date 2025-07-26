import { getDictionary } from "@/lib/get-dictionary";
import { GlobalStats } from "@/components/global-stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default async function StatsPage() {
  const dictionary = await getDictionary('es');

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="absolute top-4 right-4">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            {dictionary.globalStats.backButton}
          </Link>
        </Button>
      </div>

      <GlobalStats 
        dictionary={dictionary}
        topPokemon={[]}
        topGenerations={[]}
      />

    </main>
  );
}

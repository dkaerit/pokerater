import { getDictionary } from "@/lib/get-dictionary";
import { GlobalStats } from "@/components/global-stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function StatsPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);

  // Mock data - in a real app, this would come from a database
  const mockGlobalPokemonData = [
    { id: '25', name: 'Pikachu', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', votes: 125034 },
    { id: '149', name: 'Dragonite', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', votes: 119876 },
    { id: '132', name: 'Ditto', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png', votes: 115678 },
    { id: '6', name: 'Charizard', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', votes: 112456 },
    { id: '94', name: 'Gengar', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png', votes: 109873 },
    { id: '143', name: 'Snorlax', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png', votes: 105678 },
    { id: '1', name: 'Bulbasaur', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', votes: 102345 },
    { id: '7', name: 'Squirtle', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', votes: 99876 },
    { id: '39', name: 'Jigglypuff', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png', votes: 98765 },
    { id: '151', name: 'Mew', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', votes: 95432 },
  ];

  const mockGlobalGenerationData = [
    { id: 1, name: 'Gen 1', avg_score: 4.89, votes: 1590345 },
    { id: 3, name: 'Gen 3', avg_score: 4.75, votes: 1450234 },
    { id: 2, name: 'Gen 2', avg_score: 4.68, votes: 1480123 },
    { id: 4, name: 'Gen 4', avg_score: 4.55, votes: 1390876 },
    { id: 5, name: 'Gen 5', avg_score: 4.32, votes: 1280567 },
    { id: 6, name: 'Gen 6', avg_score: 4.15, votes: 1150456 },
    { id: 7, name: 'Gen 7', avg_score: 4.01, votes: 1090345 },
    { id: 8, name: 'Gen 8', avg_score: 3.89, votes: 1050234 },
    { id: 9, name: 'Gen 9', avg_score: 3.75, votes: 980123 },
  ];


  return (
    <main className="container mx-auto py-8 px-4">
      <div className="absolute top-4 left-4">
        <LanguageSwitcher lang={lang} />
      </div>
      <div className="absolute top-4 right-4">
        <Button asChild variant="outline">
          <Link href={`/${lang}`}>
            <Home className="mr-2 h-4 w-4" />
            {dictionary.globalStats.backButton}
          </Link>
        </Button>
      </div>

      <GlobalStats 
        dictionary={dictionary}
        topPokemon={mockGlobalPokemonData}
        topGenerations={mockGlobalGenerationData}
      />

    </main>
  );
}

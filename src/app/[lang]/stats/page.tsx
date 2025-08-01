import { getDictionary } from "@/lib/get-dictionary";
import { GlobalStats } from "@/components/global-stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }]
}

export default async function StatsPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);

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
        topPokemon={[]}
        topGenerations={[]}
      />

    </main>
  );
}

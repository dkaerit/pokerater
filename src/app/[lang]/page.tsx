import { PokeRater } from "@/components/poke-rater";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { getDictionary } from "@/lib/get-dictionary";
import { LanguageSwitcher } from "@/components/language-switcher";

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto" />
      </div>
      <Skeleton className="h-72 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

export default async function Home({ params: { lang } }: { params: { lang: string }}) {
  const dictionary = await getDictionary(lang);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="absolute top-4 left-4">
        <LanguageSwitcher lang={lang} />
      </div>
       <Suspense fallback={<LoadingSkeleton />}>
        <PokeRater dictionary={dictionary} />
      </Suspense>
    </main>
  );
}

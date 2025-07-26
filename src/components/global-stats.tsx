import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Trophy, Crown, Medal } from "lucide-react";

interface GlobalStatsProps {
  dictionary: any;
  topPokemon: { id: string; name: string; sprite: string; votes: number }[];
  topGenerations: { id: number; name: string; avg_score: number, votes: number }[];
}

const getRankIcon = (rank: number) => {
    switch(rank) {
        case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
        case 1: return <Crown className="w-5 h-5 text-gray-400" />;
        case 2: return <Medal className="w-5 h-5 text-yellow-700" />;
        default: return <span className="font-bold text-lg w-5 text-center">{rank + 1}</span>
    }
}

export function GlobalStats({ dictionary, topPokemon, topGenerations }: GlobalStatsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tighter">
          {dictionary.globalStats.title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {dictionary.globalStats.description}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.globalStats.top10Title}</CardTitle>
            <CardDescription>{dictionary.globalStats.top10Description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{dictionary.globalStats.pokemon}</TableHead>
                  <TableHead className="text-right">{dictionary.globalStats.votes}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPokemon.map((pokemon, index) => (
                  <TableRow key={pokemon.id}>
                    <TableCell className="font-medium">{getRankIcon(index)}</TableCell>
                    <TableCell className="flex items-center gap-2">
                        <Image src={pokemon.sprite} alt={pokemon.name} width={40} height={40} unoptimized />
                        <span className="capitalize">{pokemon.name}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono">{pokemon.votes.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.globalStats.topGenerationsTitle}</CardTitle>
            <CardDescription>{dictionary.globalStats.topGenerationsDescription}</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{dictionary.generation}</TableHead>
                  <TableHead className="text-right">{dictionary.scoreboard.avg}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topGenerations.map((gen, index) => (
                  <TableRow key={gen.id}>
                    <TableCell className="font-medium">{getRankIcon(index)}</TableCell>
                    <TableCell>{gen.name}</TableCell>
                    <TableCell className="text-right font-mono">{gen.avg_score.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

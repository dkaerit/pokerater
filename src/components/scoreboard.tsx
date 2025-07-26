"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Score } from "@/lib/types";

interface ScoreboardProps {
  scores: Score[];
}

const chartConfig = {
  score: {
    label: "Avg. Score",
    color: "hsl(var(--primary))",
  },
};

export function Scoreboard({ scores }: ScoreboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Generation Scoreboard</CardTitle>
        <CardDescription>Average rating for each generation (out of 6)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={scores} accessibilityLayer margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="generation"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis domain={[0, 6]} tickLine={false} axisLine={false} tickMargin={10} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="score" fill="var(--color-score)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

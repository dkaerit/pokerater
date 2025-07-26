"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
  },
};

export function Scoreboard({ scores }: ScoreboardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Generation Scoreboard</CardTitle>
        <CardDescription>Average rating for each generation (out of 6)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
           <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={scores} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={0.5 / 6} stopColor="#033136" />
                  <stop offset={2.5 / 6} stopColor="#033136" />
                  <stop offset={2.5 / 6} stopColor="#3a2f0f" />
                  <stop offset={4.5 / 6} stopColor="#3a2f0f" />
                  <stop offset={4.5 / 6} stopColor="#380815" />
                  <stop offset={1} stopColor="#380815" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="generation"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis domain={[0, 6]} tickLine={false} axisLine={false} tickMargin={10} ticks={[0,2,4,6]} />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#380815" 
                fill="url(#splitColor)" 
                fillOpacity={0.8}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

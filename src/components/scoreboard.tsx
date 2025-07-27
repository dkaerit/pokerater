
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Score } from "@/lib/types";
import { useMemo } from "react";


const chartConfig = {
  score: {
    label: "Avg. Score",
  },
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  let fillColor = "rgb(255,104,102)"; // Red for score < 2
  if (payload.score >= 4) {
    fillColor = "rgb(61,196,209)"; // Turquoise for score >= 4
  } else if (payload.score >= 2) {
    fillColor = "rgb(221,186,92)"; // Amber for score >= 2
  }

  return <circle cx={cx} cy={cy} r={6} stroke="#fff" strokeWidth={2} fill={fillColor} />;
};


export function Scoreboard({ scores, dictionary }: { scores: Score[], dictionary: any }) {
    const activeDot = useMemo(() => <CustomDot />, []);
    const chartLabel = useMemo(() => {
        const config = { ...chartConfig };
        config.score.label = dictionary.scoreboard.avg;
        return config;
    }, [dictionary]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">{dictionary.scoreboard.title}</CardTitle>
        <CardDescription>{dictionary.scoreboard.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
          <ChartContainer config={chartLabel} className="min-h-[250px] w-full flex-grow">
            <ResponsiveContainer>
                <AreaChart
                accessibilityLayer
                data={scores}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <defs>
                    <linearGradient id="splitColorStroke" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0.33" stopColor="rgb(61,196,209)" /> 
                    <stop offset="0.33" stopColor="rgb(221,186,92)" />
                    <stop offset="0.66" stopColor="rgb(221,186,92)" />
                    <stop offset="0.66" stopColor="rgb(255,104,102)" />
                    <stop offset="1" stopColor="rgb(255,104,102)" />
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
                <ChartTooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#splitColorStroke)"
                    fill="transparent"
                    strokeWidth={3}
                    activeDot={activeDot}
                />
                </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
      </CardContent>
    </Card>
  );
}


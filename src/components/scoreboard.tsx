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
import { useMemo } from "react";


const chartConfig = {
  score: {
    label: "Avg. Score",
  },
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  let fillColor = "#e5475c";
  if (payload.score >= 4) {
    fillColor = "#1495a2";
  } else if (payload.score >= 2) {
    fillColor = "#c4920e";
  }

  return <circle cx={cx} cy={cy} r={6} stroke="#fff" strokeWidth={2} fill={fillColor} />;
};


export function Scoreboard({ scores }: ScoreboardProps) {
    const activeDot = useMemo(() => <CustomDot />, []);

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
                  <stop offset={(6 - 4) / 6} stopColor="#1495a2" stopOpacity={0.4}/>
                  <stop offset={(6 - 4) / 6} stopColor="#c4920e" stopOpacity={0.4}/>
                  <stop offset={(6 - 2) / 6} stopColor="#c4920e" stopOpacity={0.4}/>
                  <stop offset={(6 - 2) / 6} stopColor="#e5475c" stopOpacity={0.4}/>
                  <stop offset={1} stopColor="#e5475c" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="splitColorStroke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={(6 - 4) / 6} stopColor="#1495a2" />
                  <stop offset={(6 - 4) / 6} stopColor="#c4920e" />
                  <stop offset={(6 - 2) / 6} stopColor="#c4920e" />
                  <stop offset={(6 - 2) / 6} stopColor="#e5475c" />
                  <stop offset={1} stopColor="#e5475c" />
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
                stroke="url(#splitColorStroke)"
                fill="url(#splitColor)" 
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

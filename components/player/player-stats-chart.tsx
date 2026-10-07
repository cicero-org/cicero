'use client';

import { TrendingUp, XCircleIcon, CircleCheck } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
  ChartConfig,
} from '@/components/ui/chart';
import PlayerTicker from '@/components/player/player-ticker';
import type { PrPricePoint } from '@/lib/definitions';
import { getCurrentPrPrice } from '@/lib/pr-price';

const chartConfig = {
  score: {
    label: 'PR',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function PlayerStatsChart({
  priceSeries,
}: {
  priceSeries: PrPricePoint[];
}) {
  if (priceSeries.length === 0) {
    return (
      <Card className="col-span-1 flex h-full grow flex-col items-center justify-center md:col-span-5 lg:col-span-6">
        <CardHeader>
          <CardTitle>No PR price yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This player doesn&apos;t have a PR score history yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const current = getCurrentPrPrice(priceSeries)!;
  const source = current.source;
  const averageScore =
    priceSeries.reduce((sum, point) => sum + point.score, 0) /
    priceSeries.length;
  const scoreDifference = current.score - averageScore;
  const percentageDifference =
    averageScore === 0 ? 0 : (scoreDifference / averageScore) * 100;

  const chartData = priceSeries.map((point) => {
    const isDNP = Boolean(
      point.comment?.includes('DNP') || point.comment?.includes('DND'),
    );
    return {
      label: point.label,
      score: point.score,
      source: point.source,
      isMock: point.isMock,
      isDNP,
      points: point.points,
      assists: point.assists,
      rebounds: point.rebounds,
      opp: point.opp,
      game_result: point.gameResult,
      min: point.min,
      pointKey: point.statsId ?? `${point.at.toISOString()}-${point.score}`,
    };
  });

  const description =
    source === 'cicero_scores'
      ? `Last ${priceSeries.length} PR quotes`
      : `Last ${priceSeries.length} games (stats fallback — cicero_scores empty)`;

  return (
    <Card className="flex grow flex-col gap-0 md:col-span-5 md:flex-row lg:col-span-6">
      <div className="box-border flex h-full grow flex-col justify-start gap-3 md:w-3/4">
        <CardHeader className="flex w-full pb-0">
          <CardTitle className="w-full text-2xl">Pulse Rating (PR)</CardTitle>
          <CardDescription className="w-full">{description}</CardDescription>
        </CardHeader>

        <CardContent className="flex w-full flex-col items-center justify-center px-4 py-0 md:flex-row">
          <ResponsiveContainer width="100%">
            <ChartContainer
              config={chartConfig}
              className="flex h-[160px] w-full items-center justify-center"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  left: 8,
                  right: 12,
                }}
                accessibilityLayer
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  syncWithTicks
                />
                <XAxis
                  dataKey="label"
                  tickMargin={8}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  width={28}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={1}
                  tickCount={5}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideIndicator />}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="var(--primary)"
                  dot={({ cx, cy, payload }) => {
                    const r = 18;
                    const isDNP = payload.isDNP;
                    return isDNP ? (
                      <XCircleIcon
                        key={payload.pointKey}
                        x={cx - r / 2}
                        y={cy - r / 2}
                        width={r}
                        height={r}
                        fill="var(--background)"
                        stroke="var(--destructive)"
                      />
                    ) : (
                      <CircleCheck
                        key={payload.pointKey}
                        x={cx - r / 2}
                        y={cy - r / 2}
                        width={r}
                        height={r}
                        fill="var(--background)"
                        stroke="var(--primary)"
                      />
                    );
                  }}
                  activeDot={false}
                />
              </LineChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>

        <CardFooter className="w-full flex-col items-start gap-2 px-6 pt-1 pb-0 text-sm">
          {priceSeries.length >= 2 ? (
            <div className="flex gap-2 leading-none font-medium">
              {scoreDifference >= 0 ? 'PR up' : 'PR down'} by{' '}
              {Math.abs(percentageDifference).toFixed(1)}% vs last{' '}
              {priceSeries.length} games
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </div>
          ) : (
            <div className="text-muted-foreground leading-none font-medium">
              Need another PR quote before a trend % is meaningful.
            </div>
          )}
          <div className="text-muted-foreground leading-none">
            Latest PR: {current.score.toFixed(1)} (last-{priceSeries.length}{' '}
            avg {averageScore.toFixed(1)})
          </div>
        </CardFooter>
      </div>
      <CardContent className="flex grow justify-center p-6 md:p-0 md:pr-6">
        <PlayerTicker
          score={current.score}
          isMock={current.isMock}
          source={current.source}
        />
      </CardContent>
    </Card>
  );
}

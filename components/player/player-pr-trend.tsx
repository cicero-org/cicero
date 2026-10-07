import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PrPricePoint } from '@/lib/definitions';
import { getPrTrend } from '@/lib/pr-price';

export default function PlayerPrTrend({
  priceSeries,
}: {
  priceSeries: PrPricePoint[];
}) {
  const trend = getPrTrend(priceSeries);

  if (!trend) {
    return (
      <Card className="flex h-full w-full flex-col justify-start">
        <CardHeader className="pb-3">
          <CardTitle>PR Trend</CardTitle>
          <CardDescription>
            Needs at least two PR quotes to show a real change.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          {priceSeries.length === 0
            ? 'No PR score history yet — trend will appear when scores arrive.'
            : 'Only one PR quote so far. Check back after the next score update.'}
        </CardContent>
      </Card>
    );
  }

  const direction =
    trend.delta > 0 ? 'up' : trend.delta < 0 ? 'down' : 'flat';
  const deltaLabel =
    trend.delta > 0
      ? `+${trend.delta.toFixed(1)}`
      : trend.delta.toFixed(1);
  const vsAvgLabel =
    trend.vsAverage > 0
      ? `+${trend.vsAverage.toFixed(1)}`
      : trend.vsAverage.toFixed(1);
  const sourceLabel =
    trend.source === 'cicero_scores'
      ? 'from cicero_scores'
      : 'from game stats (cicero_scores empty)';

  return (
    <Card className="flex h-full w-full flex-col justify-start">
      <CardHeader className="pb-3">
        <CardTitle>PR Trend</CardTitle>
        <CardDescription>
          Last {trend.pointCount} quotes · {sourceLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          Latest PR {trend.latest.score.toFixed(1)} is{' '}
          <span className="font-medium">
            {direction === 'flat'
              ? 'unchanged'
              : `${direction} ${Math.abs(trend.delta).toFixed(1)}`}
          </span>{' '}
          from the prior quote ({trend.previous.score.toFixed(1)} on{' '}
          {trend.previous.label}).
        </p>
        <p className="text-muted-foreground">
          Change vs prior: {deltaLabel} · vs last {trend.pointCount} games avg (
          {trend.average.toFixed(1)}): {vsAvgLabel}
        </p>
      </CardContent>
    </Card>
  );
}

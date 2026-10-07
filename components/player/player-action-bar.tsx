import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PlayerAverages, PrPricePoint } from '@/lib/definitions';

interface PlayerActionBarProps {
  averages: PlayerAverages | null | undefined;
  priceSeries: PrPricePoint[];
}

function formatAvg(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return '—';
  return Number(value).toFixed(1);
}

const PlayerActionBar = ({ averages, priceSeries }: PlayerActionBarProps) => {
  const recentForm = priceSeries.slice(-5);
  const hasAverages =
    averages?.ppg != null || averages?.apg != null || averages?.rpg != null;

  return (
    <Card className="flex h-full w-full flex-col gap-6 py-6 md:col-span-4">
      <CardHeader className="w-full space-y-3 pb-0">
        <div>
          <CardTitle className="text-lg">Season averages</CardTitle>
          <CardDescription>
            Context next to the PR price — not a second score.
          </CardDescription>
        </div>
        {hasAverages ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide">
                PPG
              </div>
              <div className="text-2xl font-semibold tabular-nums">
                {formatAvg(averages?.ppg)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide">
                APG
              </div>
              <div className="text-2xl font-semibold tabular-nums">
                {formatAvg(averages?.apg)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide">
                RPG
              </div>
              <div className="text-2xl font-semibold tabular-nums">
                {formatAvg(averages?.rpg)}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Season averages aren&apos;t available for this player yet.
          </p>
        )}
      </CardHeader>

      <CardContent className="flex w-full flex-col gap-3 border-t pt-6">
        <div>
          <div className="text-lg font-semibold">Recent form</div>
          <p className="text-muted-foreground text-sm">
            Same PR series as the chart (oldest → newest).
          </p>
        </div>
        {recentForm.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No recent PR quotes to show yet.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {recentForm.map((point, index) => (
              <div
                key={`${point.label}-${point.score}-${index}`}
                className="flex items-center gap-2"
              >
                <div className="bg-muted rounded-md px-2.5 py-1.5 text-center">
                  <div className="text-sm font-semibold tabular-nums">
                    {point.score.toFixed(1)}
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                    {point.label}
                  </div>
                </div>
                {index < recentForm.length - 1 ? (
                  <span className="text-muted-foreground text-sm" aria-hidden>
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerActionBar;

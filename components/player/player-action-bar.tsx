import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PlayerAverages } from '@/lib/definitions';

interface PlayerActionBarProps {
  averages: PlayerAverages | null | undefined;
}

function formatAvg(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return '—';
  return Number(value).toFixed(1);
}

const PlayerActionBar = ({ averages }: PlayerActionBarProps) => {
  const hasAverages =
    averages?.ppg != null || averages?.apg != null || averages?.rpg != null;

  return (
    <Card className="flex w-full flex-col justify-start py-6 md:col-span-8">
      <CardHeader className="w-full space-y-3">
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
    </Card>
  );
};

export default PlayerActionBar;

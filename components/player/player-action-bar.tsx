import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlayerAverages } from '@/lib/definitions';

interface PlayerActionBarProps {
  averages: PlayerAverages | null | undefined;
}

const PlayerActionBar = ({ averages }: PlayerActionBarProps) => {
  return (
    <Card className="flex h-full w-full flex-col justify-between py-6 md:col-span-8 md:flex-row">
      <CardHeader className="w-full flex-row md:w-3/4">
        <CardTitle className="text-xl">PPG: {averages?.ppg ?? '—'}</CardTitle>
        <CardTitle className="text-xl">APG: {averages?.apg ?? '—'}</CardTitle>
        <CardTitle className="text-xl">RPG: {averages?.rpg ?? '—'}</CardTitle>
      </CardHeader>

      <CardContent className="text-muted-foreground flex w-full items-center justify-end text-sm md:w-1/4">
        Season averages
      </CardContent>
    </Card>
  );
};

export default PlayerActionBar;

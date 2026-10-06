import {
  PlayerDetailsStaticSkeleton,
  PlayerStatsChartSkeleton,
  PlayerActionBarSkeleton,
  PlayerPrTrendSkeleton,
} from '@/components/layout/skeletons';

export default function Loading() {
  return (
    <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_auto_auto]">
      <PlayerDetailsStaticSkeleton />
      <PlayerStatsChartSkeleton />
      <PlayerActionBarSkeleton />
      <PlayerPrTrendSkeleton />
    </div>
  );
}

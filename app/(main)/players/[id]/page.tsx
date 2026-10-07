import { Suspense } from 'react';
import {
  PlayerDetailsStaticSkeleton,
  PlayerStatsChartSkeleton,
  PlayerActionBarSkeleton,
  PlayerPrTrendSkeleton,
} from '@/components/layout/skeletons';
import { fetchPlayerDataByID } from '@/lib/data/players';
import { PlayerDetailsStatic } from '@/components/player/player-detail-static';
import { PlayerStatsChart } from '@/components/player/player-stats-chart';
import PlayerPrTrend from '@/components/player/player-pr-trend';
import PlayerActionBar from '@/components/player/player-action-bar';

export default async function PlayerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playerId = Number(id);

  if (isNaN(playerId)) {
    return <InvalidPlayerIdError />;
  }

  const player = await fetchPlayerDataByID(playerId);

  if (!player) {
    return <PlayerNotFoundError />;
  }

  const priceSeries = player.pr_price_series ?? [];

  return (
    <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_auto]">
      <Suspense fallback={<PlayerDetailsStaticSkeleton />}>
        <PlayerDetailsStatic player={player} />
      </Suspense>

      <Suspense fallback={<PlayerStatsChartSkeleton />}>
        <PlayerStatsChart priceSeries={priceSeries} />
      </Suspense>

      <Suspense fallback={<PlayerActionBarSkeleton />}>
        <PlayerActionBar averages={player.averages} priceSeries={priceSeries} />
      </Suspense>

      <Suspense fallback={<PlayerPrTrendSkeleton />}>
        <PlayerPrTrend priceSeries={priceSeries} />
      </Suspense>
    </div>
  );
}

function InvalidPlayerIdError() {
  return (
    <div className="flex flex-col content-center justify-center">
      <h1 className="text-4xl font-bold">Invalid Player ID 🫠</h1>
    </div>
  );
}

function PlayerNotFoundError() {
  return (
    <div className="flex flex-col content-center justify-center">
      <h1 className="text-4xl font-bold">
        Technical Foul! Player not found. 🫠
      </h1>
    </div>
  );
}

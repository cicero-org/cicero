import { Suspense } from 'react';
import {
  PlayerDetailsStaticSkeleton,
  PlayerStatsChartSkeleton,
  PlayerNewsSkeleton,
  PlayerActionBarSkeleton,
  PlayerAiSummarySkeleton,
} from '@/components/layout/skeletons';
import { fetchPlayerDataByID } from '@/lib/data/players';
import { PlayerDetailsStatic } from '@/components/player/player-detail-static';
import { PlayerStatsChart } from '@/components/player/player-stats-chart';
import PlayerNews from '@/components/player/player-news';
import PlayerAiSummary from '@/components/player/player-ai-summary';
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

  // const queryClient = getQueryClient();

  // queryClient.prefetchQuery({
  //   queryKey: ['playerStats', playerId],
  //   queryFn: () => fetchPlayerStatsByID(playerId),
  // });

  // const stats = await fetchPlayerStatsByID(playerId);
  // // console.log(stats);

  return (
    <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]">
      <Suspense fallback={<PlayerDetailsStaticSkeleton />}>
        <PlayerDetailsStatic player={player} />
      </Suspense>

      <Suspense fallback={<PlayerStatsChartSkeleton />}>
        <PlayerStatsChart priceSeries={player.pr_price_series ?? []} />
      </Suspense>

      <Suspense fallback={<PlayerActionBarSkeleton />}>
        <PlayerActionBar averages={player.averages} />
      </Suspense>

      <Suspense fallback={<PlayerNewsSkeleton />}>
        <PlayerNews playerId={player.id} />
      </Suspense>

      <Suspense fallback={<PlayerAiSummarySkeleton />}>
        <PlayerAiSummary playerId={player.id} />
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

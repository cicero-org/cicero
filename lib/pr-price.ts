import type { PrPricePoint } from '@/lib/definitions';

type CiceroScoreRow = {
  cicero_score: string | number;
  calculated_at: Date | null;
};

type StatsRowForPrice = {
  stats_id: number;
  prScore: number | null;
  gamedate: Date;
  is_mock?: boolean | null;
  points?: number;
  assists?: number;
  totReb?: number;
  opp?: string | null;
  game_result?: string | null;
  min?: string;
  comment?: string | null;
};

function formatPriceLabel(date: Date) {
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });
}

export function buildPrPriceSeries(
  ciceroRows: CiceroScoreRow[],
  statsRows: StatsRowForPrice[],
  limit = 5,
): PrPricePoint[] {
  const fromCicero = ciceroRows
    .filter((row) => row.calculated_at != null)
    .map((row) => {
      const at = new Date(row.calculated_at!);
      return {
        score: Number(row.cicero_score),
        at,
        source: 'cicero_scores' as const,
        isMock: false,
        label: formatPriceLabel(at),
      };
    })
    .filter((point) => Number.isFinite(point.score))
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  if (fromCicero.length > 0) {
    return fromCicero.slice(Math.max(fromCicero.length - limit, 0));
  }

  const fromStats = statsRows
    .filter((row) => row.prScore != null && Number.isFinite(row.prScore))
    .map((row) => {
      const at = new Date(row.gamedate);
      return {
        score: Number(row.prScore),
        at,
        source: 'player_stats' as const,
        isMock: Boolean(row.is_mock),
        label: formatPriceLabel(at),
        statsId: row.stats_id,
        points: row.points,
        assists: row.assists,
        rebounds: row.totReb,
        opp: row.opp ?? null,
        gameResult: row.game_result ?? null,
        min: row.min,
        comment: row.comment ?? null,
      };
    })
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  return fromStats.slice(Math.max(fromStats.length - limit, 0));
}

export function getCurrentPrPrice(series: PrPricePoint[]) {
  if (series.length === 0) return null;
  return series[series.length - 1];
}

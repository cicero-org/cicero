import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import { unstable_cache } from 'next/cache';
import { players } from '@/server/db/schema/players';
import { playerStats } from '@/server/db/schema/player_stats';
import { asc, eq } from 'drizzle-orm';
import {
  playerSchema,
  Player,
  NewsArticle,
  newsArticleSchema,
  playerStatsSchema,
  PlayerStats,
} from '@/lib/definitions';

// import { BLACKLISTED_TERMS } from '@/config.js';

import { db } from '@/server/db';
import { playerAverages } from '@/server/db/schema/player_averages';
import { ciceroScores } from '@/server/db/schema/cicero_scores';
import { desc } from 'drizzle-orm';
import { buildPrPriceSeries } from '@/lib/pr-price';

export const fetchPlayerData = unstable_cache(
  async (): Promise<Player[]> => {
    try {
      // Perform a join between players and player_stats
      // console.log('Fetching player data');

      const result = await db
        .select()
        .from(players)
        .where(eq(players.rosterstatus, 'Active'))
        .limit(10); // console.log('Data Fetched');

      // Convert the grouped data into an array and add picture URLs
      // Add picture URLs
      const playersWithPictures = result.map((player) => {
        const pictureUrl = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/${player.id}.png`;
        return { ...player, picture: pictureUrl };
      });

      // Parse each player object using the schema
      return playersWithPictures.map((playerData) =>
        playerSchema.parse(playerData),
      );
    } catch (error) {
      throw new Error(
        'Failed to fetch players data - Function: fetchPlayerData()' + error,
      );
    }
  },
  ['players-key'],
  { revalidate: 86400 },
);

export async function fetchPlayerDataByID(id: number): Promise<Player | null> {
  const [playerResult, statsResult, averagesResult, ciceroScoreResult] =
    await Promise.all([
      db.select().from(players).where(eq(players.id, id)),
      db
        .select()
        .from(playerStats)
        .where(eq(playerStats.player_id, id))
        .orderBy(asc(playerStats.gamedate)),
      db
        .select()
        .from(playerAverages)
        .where(eq(playerAverages.player_id, id)),
      db
        .select()
        .from(ciceroScores)
        .where(eq(ciceroScores.player_id, id))
        .orderBy(desc(ciceroScores.calculated_at))
        .limit(20),
    ]);

  if (playerResult.length === 0) {
    return null;
  }

  const player = playerResult[0];
  const pictureUrl = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/${id}.png`;
  const stats = statsResult || [];
  const pr_price_series = buildPrPriceSeries(ciceroScoreResult, stats);

  try {
    return playerSchema.parse({
      ...player,
      averages: averagesResult[0],
      stats,
      pr_price_series,
      picture: pictureUrl,
    });
  } catch (error) {
    console.error('Failed to parse player data:', error);
    return null;
  }
}

export const fetchPlayerStatsByID = async (
  id: number,
): Promise<PlayerStats[]> => {
  const result = await db
    .select()
    .from(playerStats)
    .where(eq(playerStats.player_id, id))
    .orderBy(asc(playerStats.gamedate));
  try {
    // Parse each player object using the schema
    const parsedStats = result.map((stat) => {
      try {
        return playerStatsSchema.parse(stat);
      } catch (error) {
        console.error('Failed to parse player stat:', stat, error);
        return null; // Or throw an error, depending on your error handling strategy
      }
    });

    // Filter out any null values that resulted from parsing errors
    return parsedStats.filter((stat): stat is PlayerStats => stat !== null);
  } catch (error) {
    console.error('Failed to fetch player stats data:', error);
    return [];
  }

  // return db.select().from(playerStats).where(eq(playerStats.player_id, id));
};

export async function fetchNewsArticles(): Promise<NewsArticle[] | null> {
  const url = 'https://nba-latest-news.p.rapidapi.com/articles?limit=10';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
      'X-RapidAPI-Host': 'nba-latest-news.p.rapidapi.com',
    },
  };
  noStore();

  try {
    const response = await fetch(url, options);

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Fetched data: ", data);

    // Assuming 'data' is an array of articles
    return data.map((article: any) => newsArticleSchema.parse(article));
  } catch (error) {
    return null;
    // console.error('Error fetching articles: ', error);
    // throw new Error('Failed to fetch articles data.');
  }
}

export async function FetchNewsArticlesByPlayerID(
  first_name: string,
  last_name: string,
): Promise<NewsArticle[] | null> {
  // console.log(first_name + last_name);
  const url = `https://nba-latest-news.p.rapidapi.com/articles?player=${first_name.toLowerCase()}-${last_name.toLowerCase()}&limit=10`;
  // console.log(url);
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
      'X-RapidAPI-Host': 'nba-latest-news.p.rapidapi.com',
    },
  };
  noStore();
  try {
    // console.log("Fetching Data");
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    return data.map((article: any) => newsArticleSchema.parse(article));
  } catch (error: any) {
    // console.error('Error fetching articles: ', error);
    // throw new Error('Failed to fetch articles data.');
    return null;
  }
}

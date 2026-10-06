import { z } from 'zod';
import { InferSelectModel } from 'drizzle-orm';
import { users } from '@/server/db/schema/users';

// ---- User ----

// Derived directly from the Drizzle schema — updates automatically when the schema changes
export type User = InferSelectModel<typeof users>;

// Form schema for profile editing — validates input at the form boundary
export const updateUserFormSchema = z.object({
  id: z.string(),
  display_name: z
    .string()
    .min(2, { message: 'Display name must be at least 2 characters.' }),
  picture: z.string().url().nullable().optional(),
  bio: z
    .string()
    .max(160, { message: 'Bio must be 160 characters or less.' })
    .nullable()
    .optional(),
});

// ---- Player ----

const playerStatsSchema = z.object({
  stats_id: z.number(),
  player_id: z.number(),
  points: z.number(),
  min: z.string(),
  fgm: z.number(),
  fga: z.number(),
  fgp: z.number(),
  ftm: z.number(),
  fta: z.number(),
  ftp: z.number(),
  tpm: z.number(),
  tpa: z.number(),
  tpp: z.number(),
  offReb: z.number(),
  defReb: z.number(),
  totReb: z.number(),
  assists: z.number(),
  pFouls: z.number(),
  steals: z.number(),
  turnovers: z.number(),
  blocks: z.number(),
  game_result: z.string().nullable(),
  season: z.number(),
  game_id: z.string(),
  comment: z.string().nullable(),
  prScore: z.number().nullable(),
  opp: z.string().nullable(),
  plusMinus: z.string(),
  gamedate: z.date(),
  created_at: z.date(),
  is_mock: z.boolean().nullable().optional(),
});

export const prPricePointSchema = z.object({
  score: z.number(),
  at: z.date(),
  source: z.enum(['cicero_scores', 'player_stats']),
  isMock: z.boolean(),
  label: z.string(),
  statsId: z.number().optional(),
  points: z.number().optional(),
  assists: z.number().optional(),
  rebounds: z.number().optional(),
  opp: z.string().nullable().optional(),
  gameResult: z.string().nullable().optional(),
  min: z.string().optional(),
  comment: z.string().nullable().optional(),
});

const playerAveragesSchema = z.object({
  averages_id: z.number(),
  player_id: z.number(),
  ppg: z.number().optional(),
  apg: z.number().optional(),
  rpg: z.number().optional(),
  last_update: z.date().optional().nullable(),
});

const playerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  display_first_last: z.string(),
  display_last_comma_first: z.string(),
  display_fi_last: z.string(),
  player_slug: z.string(),
  birthdate: z.string(),
  school: z.string(),
  country: z.string(),
  last_affiliation: z.string(),
  height: z.string(),
  weight: z.string(),
  season_exp: z.number(),
  jersey: z.string(),
  position: z.string(),
  rosterstatus: z.string(),
  team_id: z.number(),
  team_name: z.string(),
  team_abbreviation: z.string(),
  team_code: z.string(),
  team_city: z.string(),
  playercode: z.string(),
  from_year: z.number().nullable(),
  to_year: z.number().nullable(),
  dleague_flag: z.string(),
  nba_flag: z.string(),
  games_played_flag: z.string(),
  draft_year: z.string(),
  draft_round: z.string().nullable(),
  draft_number: z.string().nullable(),
  is_active: z.string(),
  picture: z.string().optional(),
  averages: playerAveragesSchema.optional(),
  stats: z.array(playerStatsSchema).optional(),
  pr_price_series: z.array(prPricePointSchema).optional(),
  last_update: z.date().optional().nullable(),
});

export { playerStatsSchema, playerAveragesSchema, playerSchema };
export type PlayerStats = z.infer<typeof playerStatsSchema>;
export type PlayerAverages = z.infer<typeof playerAveragesSchema>;
export type Player = z.infer<typeof playerSchema>;
export type PrPricePoint = z.infer<typeof prPricePointSchema>;

// ---- News ----

export const newsArticleSchema = z.object({
  title: z.string(),
  url: z.string(),
  source: z.string(),
});
export type NewsArticle = z.infer<typeof newsArticleSchema>;

// ---- Team ----

const teamSchema = z.object({
  team_id: z.number(),
  name: z.string(),
  nickname: z.string(),
  logo: z.string(),
  city: z.string(),
  abbreviation: z.string(),
  state: z.string(),
  year_founded: z.number(),
});

export { teamSchema };
export type Team = z.infer<typeof teamSchema>;

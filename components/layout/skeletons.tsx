import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
  ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ExploreTableSkeleton() {
  return (
    <>
      <h2 className="my-2 text-2xl font-bold">Active Players</h2>
      <Table className="w-full gap-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Loading</TableCell>
            <TableCell>Loading</TableCell>
            <TableCell>Loading</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
export async function PlayerDetailsStaticSkeleton() {
  return (
    <Card className="bg-card text-card-foreground col-span-1 flex w-full flex-col items-center justify-between rounded-xl border shadow-xs md:col-span-3 lg:col-span-2">
      <CardHeader className="flex w-full flex-col items-center justify-center pb-0 md:gap-1">
        <Skeleton className="h-[200px] w-[200px] rounded-full" />

        <div className="mt-4 w-full space-y-2">
          <Skeleton className="h-8 w-3/4" />
        </div>
      </CardHeader>

      <CardContent className="flex w-full flex-col justify-start">
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;
export function PlayerStatsChartSkeleton() {
  return (
    <Card className="flex h-full grow flex-col md:col-span-5 lg:col-span-6">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl">Pulse Rating (PR)</CardTitle>
        <CardDescription>Last X games</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-start justify-start pb-0 md:flex-row">
        <Skeleton className="h-[200px] w-full"></Skeleton>
      </CardContent>
    </Card>
  );
}

export async function PlayerActionBarSkeleton() {
  return (
    <Card className="flex w-full flex-col py-6 md:col-span-8">
      <CardHeader className="w-full space-y-3">
        <CardTitle>Season averages</CardTitle>
        <CardDescription>Loading decision context…</CardDescription>
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardHeader>
    </Card>
  );
}

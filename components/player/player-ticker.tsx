'use client';

import React, { useState, useEffect } from 'react';
import { CardHeader } from '@/components/ui/card';
import NumberFlow from '@number-flow/react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { ComingSoonButton } from '@/components/coming-soon';
import type { PrPricePoint } from '@/lib/definitions';

const PlayerTicker = ({
  score,
  isMock = false,
  source,
}: {
  score: number;
  isMock?: boolean;
  source: PrPricePoint['source'];
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setDisplayScore(score);
  }, [score]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 md:gap-1">
      <CardHeader className="p-0 text-center text-8xl font-bold md:text-6xl">
        <NumberFlow continuous={true} value={displayScore} />
        <div className="text-muted-foreground text-sm">PR price</div>
        {isMock ? (
          <div className="text-muted-foreground text-xs font-normal">Mock</div>
        ) : null}
        {source === 'player_stats' ? (
          <div className="text-muted-foreground text-xs font-normal">
            From game stats
          </div>
        ) : null}
      </CardHeader>
      <ComingSoonButton
        className="w-full rounded-md text-lg md:h-10 md:text-base"
        size={'lg'}
      >
        Buy <ArrowUpIcon className="h-4 w-4" />
      </ComingSoonButton>
      <ComingSoonButton
        className="w-full rounded-md text-lg md:h-10 md:text-base"
        variant={'destructive'}
        size={'lg'}
      >
        Sell <ArrowDownIcon className="h-4 w-4" />
      </ComingSoonButton>
    </div>
  );
};

export default PlayerTicker;

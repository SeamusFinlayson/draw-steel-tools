export type DieResult = {
  value: number;
  dropped: boolean;
};

export type Roll = {
  timeStamp: number;
  playerName: string;
  bonus: number;
  hasSkill: boolean;
  netEdges: number;
  tier: number;
  critical: boolean;
  total: number;
  dieResults: DieResult[];
};

export type Trackers = {
  malice: number;
  heroTokens: number;
};

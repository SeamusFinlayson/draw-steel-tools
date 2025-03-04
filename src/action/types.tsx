export type Roll = {
  timeStamp: number;
  playerName: string;
  bonus: number;
  netEdges: number;
  tier: number;
  critical: boolean;
  total: number;
  rolls: number[];
};

export type Trackers = {
  malice: number;
  heroTokens: number;
};

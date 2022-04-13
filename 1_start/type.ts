export type Invoice = {
  customer: string;
  performances: Performances[];
};

export type Performances = {
  playId: string;
  audience: number;
};

export type PlayList = {
  [key: string]: Play;
};

export type Play = {
  name: string;
  type: string;
};

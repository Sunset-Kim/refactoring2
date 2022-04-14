type PlayName = "hamlet" | "as-like" | "othello";

export type Invoice = {
  customer: string;
  performances: Performances[];
};

export type Performances = {
  playId: PlayName;
  audience: number;
};

export type PlayList = {
  [key in PlayName]: Play;
};

export type Play = {
  name: string;
  type: string;
};

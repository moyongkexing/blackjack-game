import { Player } from "./Player";
type Action = Player["action"];
type Actions = {
  [key in Action]?: number[];
}
type BotStrategies = {
  [key: string]: Actions;
}

// 参考: https://www.youtube.com/watch?v=iyfrI0Eqw40
export const BotStrategies: BotStrategies = {
  2: {
    "hit": [3,4,5,6,7,8,9,12],
    "double": [10,11],
    "stand": [13,14,15,16,17],
    "surrender": [],
  },
  3: {
    "hit": [3,4,5,6,7,8,12],
    "double": [9,10,11],
    "stand": [13,14,15,16,17],
    "surrender": [],
  },
  4: {
    "hit": [3,4,5,6,7,8],
    "double": [9,10,11],
    "stand": [12,13,14,15,16,17],
    "surrender": [],
  },
  5: {
    "hit": [3,4,5,6,7,8],
    "double": [9,10,11],
    "stand": [12,13,14,15,16,17],
    "surrender": [],
  },
  6: {
    "hit": [3,4,5,6,7,8],
    "double": [9,10,11],
    "stand": [12,13,14,15,16,17],
    "surrender": [],
  },
  7: {
    "hit": [3,4,5,6,7,8,9,12,13,14,15,16],
    "double": [10,11],
    "stand": [17],
    "surrender": [],
  },
  8: {
    "hit": [3,4,5,6,7,8,9,12,13,14,15,16],
    "double": [10,11],
    "stand": [17],
    "surrender": [],
  },
  9: {
    "hit": [3,4,5,6,7,8,9,12,13,14,15],
    "double": [10,11],
    "stand": [17],
    "surrender": [16],
  },
  10: {
    "hit": [3,4,5,6,7,8,9,10,12,13,14],
    "double": [11],
    "stand": [17],
    "surrender": [15,16],
  },
  11: {
    "hit": [3,4,5,6,7,8,9,12,13,14,15],
    "double": [10,11],
    "stand": [17],
    "surrender": [16],
  },
}


import { Card } from "../Card";
import { ChallengerStatus, DealerStatus } from "./StatusType";

export interface Player {
  name: string;
  hand: Card[];
  status: ChallengerStatus | DealerStatus;
  isTurnEnd: boolean;
  handScore: number;
  
  getCard(card: Card): void;
  stand(): void;
  hit(card: Card): void;
  resetState(): void;
}

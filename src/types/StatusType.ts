enum PlayerStatus {
  INITIAL = "Initial",
  SURRENDER = "Surrender",
  STAND = "Stand",
  BUST = "Bust",
  DOUBLE = "Double",
  DOUBLEBUST = "DoubleBust",
  BLACKJACK = "Blackjack"
}

enum DealerStatus {
  INITIAL = "Initial",
  STAND = "Stand",
  BUST = "Bust",
  BLACKJACK = "Blackjack",
}

export { PlayerStatus, DealerStatus };
import { Table } from "./Table";
import { Action } from "./types/ActionType";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";
import { ChallengerStatus } from "./types/StatusType";

export class View {
  private table: Table;

  private startPage = document.getElementById("start-page") as HTMLElement;
  private usernameInput = (document.getElementById("username-input") as HTMLInputElement);

  private betPage = document.getElementById("bet-page") as HTMLElement;
  private moneyAmount = document.getElementById("money-amount") as HTMLSpanElement;
  private betAmount = document.getElementById("bet-amount") as HTMLSpanElement;
  private dealBtn = document.getElementById("deal-btn") as HTMLElement;
  private resetBtn = document.getElementById("reset-btn") as HTMLElement;

  private dealPage = document.getElementById("deal-page") as HTMLElement;
  private username = document.getElementById("username") as HTMLHeadingElement;
  private actionButtons = document.getElementById("action-buttons") as HTMLElement;
  private doubleBtn = document.getElementById("double-btn") as HTMLButtonElement;
  private hitBtn = document.getElementById("hit-btn") as HTMLButtonElement;
  private nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
  private gameLog = (document.getElementById("game-log") as HTMLElement);

  public constructor() {
    this.table = Table.getInstance(this.usernameInput.value);
    this.initializeView();
    this.initializeController();

    this.startPage.classList.add("hidden");
    this.betPage.classList.remove("hidden");
  }

  private initializeView(): void {
    this.moneyAmount.innerText = String(this.table.user.money);
    this.betAmount.innerText = String(Table.betDenominations[0]); // 5$
    
    this.username.innerText = this.table.user.name;
    for(let player of this.table.players) {
      const id = this.getIdFromPlayer(player);
      (document.getElementById(`${id}-hands`) as HTMLElement).innerHTML = "";
      (document.getElementById(`${id}-status`) as HTMLElement).innerHTML = "";
    }
    this.actionButtons.style.visibility = "hidden";
  }

  private initializeController(): void {
    // "DEAL" button
    this.dealBtn.addEventListener("click", async () => {
      this.betPage.classList.add("hidden");
      this.dealPage.classList.remove("hidden");
      this.nextBtn.classList.add("disable");

      // assign the argument value to User.betAmount
      this.table.bet(parseInt(this.betAmount.innerText)); 
      // assign two cards to all players (dealer get only one card as exception)
      this.table.distribution(); 

      for(let player of this.table.players) {
        await this.sleep(1000);
        // draw the player's hand in the view
        this.updatePlayerHand(player); 
        // in the case of player is blackjack, draw the status in the view
        this.updatePlayerStatus(player); 
      };
      // ex: "BOT1 has bet 100$."
      this.updateTurnLog(); 

      this.actionButtons.style.visibility = "visible";
      // user who has bet more than half of total money cannot choose double
      if(!this.table.user.canDouble) this.doubleBtn.classList.add("disable");
      else this.doubleBtn.classList.remove("disable");
      // if user is blackjack, end the turn and let the bots and dealers act
      if(this.table.user.isTurnEnd) await this.autoRendering();
    });

    // Action button
    const actions: Action[] = [Action.SURRENDER, Action.STAND, Action.HIT, Action.DOUBLE];
    for (let action of actions) {
      (document.getElementById(`${action.toLowerCase()}-btn`) as HTMLButtonElement
      ).addEventListener("click", async () => {
        this.table.userAct(action);
        this.updatePlayerHand(this.table.user);
        this.updateTurnLog();
        console.log(this.table.user.status);
        if(!this.table.user.canDouble) this.doubleBtn.classList.add("disable");
        if(!this.table.user.canHit) this.hitBtn.classList.add("disable");
        if(this.table.user.isTurnEnd) await this.autoRendering();
      });
    }
    
    // "Next Game" button
    this.nextBtn.addEventListener("click", () => {
      this.table.resetTable();
      this.initializeView();
      this.makeChipButtonClickable();
    
      this.dealPage.classList.add("hidden");
      this.betPage.classList.remove("hidden");
    });

    // "RESET" button
    this.resetBtn.addEventListener("click", () => {
      this.betAmount.innerText = String(Table.betDenominations[0]); // 5$
      this.makeChipButtonClickable();
    });
    

    // Chip button
    for (let i = 0; i < Table.betDenominations.length; i++) {
      let chipBtn = document.getElementById(`bet-${Table.betDenominations[i]}`) as HTMLElement;
      chipBtn.addEventListener("click", () => {
        const total: number = parseInt(this.betAmount.innerText) + Table.betDenominations[i];
        if(total + Table.betDenominations[i] > this.table.user.money) {
          for(let j = i; j < Table.betDenominations.length; j++) {
            let disableChipBtn = document.getElementById(`bet-${Table.betDenominations[j]}`) as HTMLElement;
            disableChipBtn.classList.add("disable");
          }
        }
        if(total <= this.table.user.money) this.betAmount.innerText = String(total);
      });
    }
  }

  private async autoRendering() {
    this.actionButtons.style.visibility = "hidden";
    this.updatePlayerStatus(this.table.user);

    for(let bot of this.table.players) {
      if(bot instanceof User) continue;
      if(bot instanceof Dealer) continue;

      await this.sleep(1000);
      this.table.botAct(bot);
      this.updatePlayerHand(bot);
      this.updatePlayerStatus(bot);
      this.updateTurnLog();
    }

    await this.sleep(1000);
    this.table.dealerOpen();
    this.updatePlayerHand(this.table.dealer);
    this.updateTurnLog();

    await this.sleep(1000);
    this.table.dealerAct();
    this.updatePlayerHand(this.table.dealer);
    this.updatePlayerStatus(this.table.dealer);
    this.updateTurnLog();

    await this.sleep(1000);
    this.table.evaluation();
    this.updateTurnLog();

    if(this.table.user.isBroke) {
      this.table.gameOver();
      this.updateTurnLog();
    }
    else this.nextBtn.classList.remove("disable");
  }

  private updatePlayerHand(player: User | Bot | Dealer) {
    const id = this.getIdFromPlayer(player);
    const handArea = (document.getElementById(`${id}-hands`) as HTMLElement);
    handArea.innerHTML = "";  

    for (let i = 1; i <= player.hand.length; i++) {
      let card = player.hand[i - 1];
      handArea.innerHTML += `
        <div id="${id}-card-${i}">
          <div class="card ${card.suit}"><span>${card.rank}</span></div>
        </div>
      `;
    }
    // player's hand should be centered horizontally
    handArea.style.width = `${(player.hand.length + 3) * 28}px`;
  }

  private updatePlayerStatus(player: User | Bot | Dealer): void {
    const id = this.getIdFromPlayer(player);
    if(player.status !== ChallengerStatus.INITIAL) {
      (document.getElementById(`${id}-status`) as HTMLElement
      ).innerHTML = `${player.status}`;
    }
  }

  private updateTurnLog(): void {
    for(let sentence of this.table.turnLog.pop() as string[]) {
      this.gameLog.innerHTML += `<p>${sentence}</p>`;
    }
    this.gameLog.scrollTop = this.gameLog.scrollHeight;
  }

  private sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  private makeChipButtonClickable(): void {
    for (let d of Table.betDenominations) {
      let chipBtn = document.getElementById(`bet-${d}`) as HTMLElement;
      chipBtn.classList.remove("disable");
    }
  }

  private getIdFromPlayer(player: User | Bot | Dealer): string {
      return player instanceof User ? "USER" : player instanceof Dealer ? "DEALER" : player.id;
  }

  private debug(): void {
    console.log("");
    console.log("");
    for (let player of this.table.players) {
      console.log(player);
      console.log(player.hand);
      console.log("isTurnEnd");
      console.log(player.isTurnEnd);
      console.log("handScore");
      console.log(player.handScore);
    }
    console.log(this.table.dealer);
    console.log(this.table.dealer.hand);
    console.log("handScore");
    console.log(this.table.dealer.handScore);
  }
}

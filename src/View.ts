import { Table } from "./Table";
import { ActionType } from "./types/ActionType";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";


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
  private actionBtns = document.getElementById("action-buttons") as HTMLElement;
  private doubleBtn = document.getElementById("double-btn") as HTMLButtonElement;
  private nextBtn = document.getElementById("next-btn") as HTMLButtonElement;

  public constructor() {
    this.table = new Table(this.usernameInput.value);
    this.initializeView();
    this.initializeController();

    this.startPage.classList.add("hidden");
    this.betPage.classList.remove("hidden");
  }

  private initializeView(): void {
    this.username.innerText = this.table.user.name;
    this.moneyAmount.innerText = String(this.table.user.money);
    this.betAmount.innerText = String(Table.betDenominations[0]); // 5$

    for(let player of this.table.players) {
      (document.getElementById(`${player.type}-hands`) as HTMLElement).innerHTML = "";
      (document.getElementById(`${player.type}-status`) as HTMLElement).innerHTML = "";
    }
    this.actionBtns.style.visibility = "hidden";
  }

  private initializeController(): void {
    // "DEAL" button
    this.dealBtn.addEventListener("click", async () => {
      this.betPage.classList.add("hidden");
      this.dealPage.classList.remove("hidden");
      this.nextBtn.classList.add("disable");

      this.table.bet(parseInt(this.betAmount.innerText)); // assign the argument value to User.betAmount
      this.table.distribution(); // assing two cards to all players (dealer get only one card as exception)

      for(let player of this.table.players) {
        await this.sleep(1000);
        this.updatePlayerHand(player); // draw the player's hand in the view
        this.updatePlayerStatus(player); // in the case of player is blackjack, draw the status in the view
      };
      this.updateTurnLog();

      this.actionBtns.style.visibility = "visible"; // display operation screen for User
      if(!this.table.user.canDouble) this.doubleBtn.classList.add("disable");
      if(this.table.user.isTurnEnd) await this.autoRendering();
    });

    // Action button
    const actions: ActionType[] = ["surrender", "stand", "hit", "double"];
    for (let action of actions) {
      (document.getElementById(`${action}-btn`) as HTMLButtonElement
      ).addEventListener("click", async () => {
        this.table.userAct(action);
        this.updatePlayerHand(this.table.user);
        this.updateTurnLog();

        if (this.table.user.isTurnEnd) await this.autoRendering();
      });
    }
    
    // "Next Game" button
    this.nextBtn.addEventListener("click", () => {
      this.table.resetTable();

      this.initializeView();
    
      this.dealPage.classList.add("hidden");
      this.betPage.classList.remove("hidden");
    });

    // "RESET" button
    this.resetBtn.addEventListener("click", () => {
      this.betAmount.innerText = String(Table.betDenominations[0]); // 5$
    });
    

    // Coin button
    for (let d of Table.betDenominations) {
      (document.getElementById(`bet-${d}`) as HTMLElement).addEventListener
      ("click", () => {
          const total: number = parseInt(this.betAmount.innerText) + d;
          this.betAmount.innerText =
            total > this.table.user.money ? this.betAmount.innerText : String(total);
      });
    }
  }

  private async autoRendering() {
    this.actionBtns.style.visibility = "hidden";

    this.updatePlayerStatus(this.table.user);

    for(let bot of this.table.players.filter(player => player instanceof Bot) as Bot[]) {
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
    const handArea = (document.getElementById(`${player.type}-hands`) as HTMLElement);
    handArea.innerHTML = "";  

    for (let i = 1; i <= player.hand.length; i++) {
      let card = player.hand[i - 1];
      handArea.innerHTML += `
        <div id="${player.type}-card-${i}">
          <div class="card ${card.suit}"><span>${card.rank}</span></div>
        </div>
      `;
    }
    // player's hand should be centered horizontally
    handArea.style.width = `${(player.hand.length + 3) * 28}px`;
  }

  private updatePlayerStatus(player: User | Bot | Dealer): void {
    if(player.status !== "initial") {
      (document.getElementById(`${player.type}-status`) as HTMLElement
      ).innerHTML = `${player.status}`;
    }
  }

  private updateTurnLog(): void {
    const target = (document.getElementById("game-log") as HTMLElement);
    for(let sentence of this.table.turnLog[this.table.turnLog.length - 1]) {
      target.innerHTML += `<p>${sentence}</p>`;
    }
    target.scrollTop = target.scrollHeight;
  }

  private sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  // private debug(): void {
  //   console.log("");
  //   console.log("");
  //   for (let player of this.table.players) {
  //     console.log(player);
  //     console.log(player.hand);
  //     console.log("isTurnEnd");
  //     console.log(player.isTurnEnd);
  //     console.log("handScore");
  //     console.log(player.handScore);
  //   }
  //   console.log(this.table.dealer);
  //   console.log(this.table.dealer.hand);
  //   console.log("handScore");
  //   console.log(this.table.dealer.handScore);
  // }
}

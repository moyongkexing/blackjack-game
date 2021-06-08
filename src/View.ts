import { Table } from "./Table";
import { ActionType } from "./types/ActionType";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";

export class View {
  private table: Table;

  public constructor() {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    this.table = new Table(username);
    this.initializeBetPage();
    this.initializeController();

    this.hide("start-page");
    this.show("bet-page");
  }

  private initializeController(): void {
    const betAmount = document.getElementById("bet-amount") as HTMLSpanElement;
    const resetBtn = (document.getElementById("reset-btn") as HTMLElement);
    const dealBtn = (document.getElementById("deal-btn") as HTMLElement);
    const nextBtn = (document.getElementById("next-btn") as HTMLButtonElement);
    const doubleBtn = (document.getElementById("double-btn") as HTMLButtonElement);
    const actionBtns = (document.getElementById("action-buttons") as HTMLElement);

    resetBtn.addEventListener("click", () => (betAmount.innerText = String(Table.betDenominations[0])));
    dealBtn.addEventListener("click", async () => {
        this.hide("bet-page");
        this.show("deal-page");

        this.table.bet(parseInt(betAmount.innerText));
        this.table.distribution();
        await this.renderDistribution();
        this.updateTurnLog();

        this.show("action-ctrl");
        if (this.table.user.money < this.table.user.betAmount * 2) {
          doubleBtn.classList.add("disable");
        } 
        if (this.table.user.isTurnEnd) await this.afterUserTurn();
      }
    );

    nextBtn.addEventListener("click", () => {
      this.table.resetTable();

      this.initializeDealPage();
      this.initializeBetPage();
    
      this.hide("deal-page");
      this.show("bet-page");

    })

    // actionBtn
    const actions: ActionType[] = ["surrender", "stand", "hit", "double"];
    for (let action of actions) {
      (document.getElementById(`${action}-btn`) as HTMLButtonElement
      ).addEventListener("click", async () => {
        this.table.userAct(action);
        this.updatePlayerHand(this.table.user);
        this.updateTurnLog();
        actionBtns.style.visibility = "hidden";

        if (this.table.user.isTurnEnd) await this.afterUserTurn();
        nextBtn.classList.remove("disable");
      });
    }

    // betBtn
    for (let d of Table.betDenominations) {
      (document.getElementById(`bet-${d}`) as HTMLElement).addEventListener
      ("click", () => {
          const total: number = parseInt(betAmount.innerText) + d;
          betAmount.innerText =
            total > this.table.user.money ? betAmount.innerText : String(total);
        }
      );
    }
  }

  private initializeBetPage(): void {
    (document.getElementById("money-amount") as HTMLSpanElement
    ).innerText = String(this.table.user.money);
    (document.getElementById("bet-amount") as HTMLSpanElement
    ).innerText = String(this.table.user.betAmount);
  }

  private initializeDealPage(): void {
    for(let player of this.table.players) {
      (document.getElementById(`${player.type}-hands`) as HTMLElement).innerHTML = "";
      (document.getElementById(`${player.type}-status`) as HTMLElement).innerHTML = "";
    }

    this.hide("action-ctrl");
    (document.getElementById("action-buttons") as HTMLElement).style.visibility = "visible";
  }

  private async renderDistribution() {
    for (let player of this.table.players) {
      await this.sleep(800);
      this.updatePlayerHand(player);
      this.updatePlayerStatus(this.table.user);
      if (player.status === "blackjack") this.updatePlayerStatus(player);
    }
  }

  private async afterUserTurn() {
    for(let bot of this.table.bots) {
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
    this.toString();
  }

  private updatePlayerHand(player: User | Bot | Dealer): void {
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
    (document.getElementById(`${player.type}-status`) as HTMLElement
    ).innerHTML = `${player.status}`;
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

  private hide(id: string): void {
    (document.getElementById(id) as HTMLElement).classList.add("hidden");
  }

  private show(id: string): void {
    (document.getElementById(id) as HTMLElement).classList.remove("hidden");
  }
}

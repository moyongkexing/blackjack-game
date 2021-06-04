import { Table } from "./Table";
import { ActionType } from "./types/ActionType";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";

export class ViewController {
  private table: Table;

  public constructor() {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    this.table = new Table(username);
    this.hide("start-page");
    this.show("bet-page");
    this.renderBetPage();
    this.initializeClickEvent();
  }

  private initializeClickEvent(): void {
    let betAmount = document.getElementById(
      "betAmountInBetPage"
    ) as HTMLSpanElement;

    // button of [5,20,50,100]
    for (let d of Table.betDenominations) {
      (document.getElementById(`bet-${d}`) as HTMLElement).addEventListener
      ("click",
        () => {
          const total: number = parseInt(betAmount.innerText) + d;
          betAmount.innerText =
            total > this.table.user.money ? betAmount.innerText : String(total);
        }
      );
    }

    // "RESET" button
    (document.getElementById("reset-btn") as HTMLElement).addEventListener
    ("click",
      () => (betAmount.innerText = String(Table.betDenominations[0]))
    );

    // "DEAL" button
    (document.getElementById("deal-btn") as HTMLElement).addEventListener
    ("click",
      async () => {
        this.table.bet(parseInt(betAmount.innerText));
        this.hide("bet-page");

        this.show("deal-page");
        this.table.distribution();
        await this.renderDistribution();

        this.show("action-buttons");

        if (this.table.user.isTurnEnd) {
          this.hide("action-buttons");
          this.table.dealerAct();
          this.table.evaluation();

          // state、つまりblackjackなどのstateがログに記録されないこと
          // 一人一人のレンダリングに合わせてそれぞれのログを出力したい
          // 勝敗の結果が記録されないこと
        }
      }
    );

    // button of ["surrender", "stand", "hit", "double"]
    const actions: ActionType[] = ["surrender", "stand", "hit", "double"];
    for (let action of actions) {
      (
        document.getElementById(`${action}-btn`) as HTMLButtonElement
      ).addEventListener("click", async () => {
        this.table.userAct(action);

        this.renderUserAction();
        if (this.table.user.isTurnEnd) {
          this.hide("action-buttons");

          this.table.botAct();
          await this.renderBotAction();

          this.table.dealerAct();
          await this.renderDealerAction();
          
          this.table.evaluation();
        }
        this.toString();
      });
    }
  }

  private async renderDistribution() {
    let players: Array<User | Bot | Dealer> = [];
    players.push(this.table.dealer);
    this.table.players.forEach((player) => players.push(player));

    for (let player of players) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait a second
      this.updateHand(player);
      if (player.status !== "initial") this.updateStatus(player);
    }
  }

  private renderUserAction() {
    this.updateHand(this.table.user);
    if (this.table.user.status !== "initial") this.updateStatus(this.table.user);
  }
  
  private async renderBotAction() {
    for (let bot of this.table.bots) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.updateHand(bot);
      if (bot.status !== "initial") this.updateStatus(bot);
    }
  }

  private async renderDealerAction() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    this.updateHand(this.table.dealer);
    if (this.table.dealer.status !== "initial") this.updateStatus(this.table.dealer);
  }

  private toString(): void {
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

  

  private renderBetPage(): void {
    (document.getElementById("moneyAmountInBetPage") as HTMLSpanElement
    ).innerText = String(this.table.user.money);
  }

  private updateHand(player: User | Bot | Dealer): void {
    for (let i = 1; i <= player.hand.length; i++) {
      let card = player.hand[i - 1];
      (document.getElementById(`${player.type}-card-${i}`) as HTMLElement
      ).innerHTML = `<div class="card ${card.suit}"><span>${card.rank}</span></div>`;
    }
    
    (document.getElementById(`${player.type}-width`) as HTMLElement
    ).style.width = `${(player.hand.length + 3) * 28}px`;
  }

  private updateStatus(player: User | Bot | Dealer): void {
    (document.getElementById(`${player.type}-status`) as HTMLElement
    ).innerHTML = `${player.status}`;
  }

  private hide(id: string): void {
    (document.getElementById(id) as HTMLElement).classList.add("hidden");
  }

  private show(id: string): void {
    (document.getElementById(id) as HTMLElement).classList.remove("hidden");
  }
}

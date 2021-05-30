import { Table } from "./Table";

class Controller {
  private static readonly IDS = {
    betCtrl: "control-wrapper bet-ctrl",
    actionCtrl: "control-wrapper bet-ctrl",
  }
  public constructor() {
    // const startBtn = document.getElementById("start-btn") as HTMLElement;
    const form = document.getElementById("form") as HTMLFormElement;
    if(form) form.addEventListener("submit", () => this.startGame());
  }

  private startGame() {
    console.log("hi")
  }
}

new Controller();

// 状態の更新は必ずそのクラスのインスタンスメソッドで行う
// 他クラスの状態は、読み取るだけで更新することはしない
// Playerクラスが肥大化してる...?
// import { Table } from "./Table";

// const IDS = {
//   root: document.getElementById("root"),
// }

class ViewControl {
  public constructor() {
    const startBtn = document.getElementById("start-btn");
    startBtn?.addEventListener("click", () => ViewControl.startGame());
  }
  private static startGame(): void {
    console.log("test")
  }
}

new ViewControl();

// 状態の更新は必ずそのクラスのインスタンスメソッドで行う
// 他クラスの状態は、読み取るだけで更新することはしない
// Playerクラスが肥大化してる...?
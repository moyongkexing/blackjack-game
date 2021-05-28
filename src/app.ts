import { Deck } from "./Deck";
import { Table } from "./Table";

class View {
  public static createBetFrom() {
    const form = document.getElementById("betForm");
    for(let d of Table.betDenominations) {
      const label = document.createElement("p");
      label.id = `betLabel${d}`;
      label.innerText = `${d}`;

      const input = document.createElement("input");
      input.id = `betInput${d}`;
      input.type = "number";
      input.min = "0";
      input.value = "0";
      input.classList.add(`betInput${d}`);

      const inputBx = document.createElement("div");
      inputBx.append(label, input);
      form?.append(inputBx);
    }
  }
}
View.createBetFrom();
console.log("hi")
// 状態の更新は必ずそのクラスのインスタンスメソッドで行う
// 他クラスの状態は、読み取るだけで更新することはしない
// Playerクラスが肥大化してる...?
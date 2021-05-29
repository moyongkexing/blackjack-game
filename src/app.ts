import { Table } from "./Table";

const IDS = {
  root: document.getElementById("root"),
}
new Table()




// 状態の更新は必ずそのクラスのインスタンスメソッドで行う
// 他クラスの状態は、読み取るだけで更新することはしない
// Playerクラスが肥大化してる...?
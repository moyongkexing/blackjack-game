import { ViewController } from "./ViewController";
const form = document.getElementById("form") as HTMLFormElement;
if(form) form.addEventListener("submit", () => new ViewController());

// 状態の更新は必ずそのクラスのインスタンスメソッドで行う
// 他クラスの状態は、読み取るだけで更新することはしない
// Playerクラスが肥大化してる...?
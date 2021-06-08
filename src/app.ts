import { View } from "./View";
const form = document.getElementById("form") as HTMLFormElement;
if(form) form.addEventListener("submit", () => new View());

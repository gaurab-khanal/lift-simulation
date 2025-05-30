import { Engine } from "./Engine.js";
import { GenerateUI } from "./GenerateUI.js";

const getFloors = document.getElementById("floors");
const getlifts = document.getElementById("lifts");
const submitbtn = document.getElementById("submitbtn");

submitbtn.addEventListener("click", function () {
  const floors = getFloors.value;
  const lifts = getlifts.value;
  if (floors < 2 || lifts < 1) {
    alert("Please provide floor>1 and lift>0");
    return;
  }
  new GenerateUI(floors, lifts);
  new Engine(floors, lifts);
});

import { Engine } from "./Engine.js";
import { GenerateUI } from "./GenerateUI.js";

const getFloors = document.getElementById("floors");
const getlifts = document.getElementById("lifts");
const submitbtn = document.getElementById("submitbtn");
const body = document.querySelector("body");
const askdetails = document.querySelector(".askdetails");

submitbtn.addEventListener("click", function () {
  const floors = getFloors.value;
  const lifts = getlifts.value;

  const building = new GenerateUI(floors, lifts);
  const engine = new Engine(floors, lifts);
  engine.getTrackLiftMapFloor();
  askdetails.style.display = "none";
});

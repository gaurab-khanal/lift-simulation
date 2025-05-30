export class Engine {
  constructor(noOfFloor, noOfLift) {
    this.noOfFloor = noOfFloor;
    this.noOfLift = noOfLift;
    this.trackLiftMapFloor = [];

    for (let i = 0; i < this.noOfLift; i++) {
      const eachLiftDetails = {};
      const currentLift = `lift_${i}`;
      eachLiftDetails[currentLift] = `floor_${this.noOfFloor - 1}`;
      eachLiftDetails["run"] = false;
      this.trackLiftMapFloor.push(eachLiftDetails);
    }

    this.getButtonIdAndFunction();
  }

  getTrackLiftMapFloor() {
    console.log(this.trackLiftMapFloor);
  }

  getButtonIdAndFunction() {
    document.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const clickId = event.target.id;
        console.log("ClickedBtn Id: ", clickId);

        if (clickId.startsWith("up_")) {
          const split = clickId.split("_");
          console.log(split);
          this.changeLiftFloorOnButtonClick(split[0], split[1]);
        } else if (clickId.startsWith("down_")) {
          const split = clickId.split("_");
          console.log(split);
          this.changeLiftFloorOnButtonClick(split[0], split[1]);
        }
      });
    });
  }

  changeLiftFloorOnButtonClick(fn, floor) {
    const track = this.trackLiftMapFloor;
    console.log("Hello");
    for (let i = 0; i < track.length; i++) {
      console.log(track, floor, fn);
      if (!track[i].run) {
        track[i].run = true;
        const currentFloorIndex = track[i][`lift_` + i].split("_")[1];
        track[i][`lift_` + i] = `floor_` + floor;
        console.log(track[i]);
        this.moveLiftAfterFoorUpdate(i, currentFloorIndex, floor);
        break;
      }
    }
  }

  animateDoorOnLiftCall(liftIndex) {
    const leftDoor = document.getElementById("left-door-" + liftIndex);
    const rightDoor = document.getElementById("right-door-" + liftIndex);

    leftDoor.classList.add("left-door-open");
    rightDoor.classList.add("right-door-open");

    return new Promise((resolve) => {
      setTimeout(() => {
        leftDoor.classList.remove("left-door-open");
        rightDoor.classList.remove("right-door-open");
        resolve();
      }, 5000);
    });
  }

  async moveLiftAfterFoorUpdate(liftIndex, currentFloorIndex, nextFloorIndex) {
    // get floor height
    await this.animateDoorOnLiftCall(liftIndex);
    const floor = document.getElementsByClassName("floor")[0];
    const floorHeight = floor.getBoundingClientRect().height;

    // get gap between each floor
    const building = document.getElementsByClassName("building")[0];
    const floorGap = parseFloat(
      window.getComputedStyle(building).gap.split("px")[0]
    );
    // calculate distn between adjacent floor (bottom of one floor to another )
    const calculetedDistn = floorHeight + floorGap;
    const pixelToMove = (this.noOfFloor - nextFloorIndex - 1) * calculetedDistn;

    const getLiftToMove = document.getElementById(`lift_${liftIndex}`);
    const floorToMove = currentFloorIndex - nextFloorIndex;
    getLiftToMove.style.transition = `transform ${floorToMove * 2}s linear`;
    getLiftToMove.style.transform = `translateY(-${pixelToMove}px)`;
    setTimeout(() => {
      this.trackLiftMapFloor[liftIndex].run = false;
    }, floorToMove * 2 * 1000);
    console.log(this.trackLiftMapFloor[liftIndex]);
  }
}

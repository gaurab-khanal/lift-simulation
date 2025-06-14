export class GenerateUI {
  constructor(noOfFloors, noOfLifts) {
    this.noOfFloors = noOfFloors;
    this.noOfLifts = noOfLifts;
    this.building = null;
    this.createBuilding();
    this.makeWidthOfAllFloorSame();
  }

  makeWidthOfAllFloorSame() {
    const floors = document.querySelectorAll(".floor");
    const floorWidths = Array.from(floors).map((floor) => floor.scrollWidth);
    const maxWidth = Math.max(...floorWidths);

    floors.forEach((floor) => {
      floor.style.width = maxWidth + "px";
    });
  }

  createBuilding() {
    const existingBuilding = document.querySelector(".building");
    if (existingBuilding) {
      existingBuilding.remove();
    }

    this.building = document.createElement("div");
    this.building.classList.add("building");
    this.createFloors();
    document.body.appendChild(this.building);
    this.createLifts();
  }

  createFloors() {
    for (let i = 0; i < this.noOfFloors; i++) {
      this.floor = document.createElement("div");
      this.floor.classList.add("floor");
      this.floor.id = i;
      this.building.appendChild(this.floor);
      this.createButtons(i);
    }
  }

  createButtons(i) {
    this.keys = document.createElement("div");
    this.keys.classList.add("keys");

    // create buttons
    if (i != 0) {
      const upButton = document.createElement("button");
      upButton.id = "up_" + i;
      upButton.textContent = "up";
      this.keys.appendChild(upButton);
    }

    if (i != this.noOfFloors - 1) {
      const downButton = document.createElement("button");
      downButton.id = "down_" + i;
      downButton.textContent = "down";
      this.keys.appendChild(downButton);
    }

    this.floor.appendChild(this.keys);
  }

  createLifts() {
    const lastFloorId = String(this.noOfFloors - 1);
    console.log(lastFloorId);
    const getLastFloor = document.getElementById(lastFloorId);

    for (let i = 0; i < this.noOfLifts; i++) {
      this.lift = document.createElement("div");
      this.lift.classList.add("lift");
      this.lift.classList.add("floor_" + lastFloorId);
      this.lift.id = `lift_${i}`;

      this.createDoors(i);
      getLastFloor.appendChild(this.lift);
    }
  }

  createDoors(i) {
    const leftDoor = document.createElement("div");
    leftDoor.classList.add("left-door");
    leftDoor.id = "left-door-" + i;
    this.lift.appendChild(leftDoor);

    const rightDoor = document.createElement("div");
    rightDoor.classList.add("right-door");
    rightDoor.id = "right-door-" + i;
    this.lift.appendChild(rightDoor);
  }
}

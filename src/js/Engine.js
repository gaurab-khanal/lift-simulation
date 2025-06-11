export class Engine {
  constructor(noOfFloor, noOfLift) {
    this.noOfFloor = noOfFloor;
    this.noOfLift = noOfLift;
    this.trackLiftMapFloor = [];
    this.trackPrvBtnFn = [];
    this.trackPrvFloor = [];
    this.trackBtnFloorClickOnAllRun = [];

    for (let i = 0; i < this.noOfLift; i++) {
      const eachLiftDetails = {};
      const currentLift = `lift_${i}`;
      eachLiftDetails[currentLift] = `floor_${this.noOfFloor - 1}`;
      eachLiftDetails["run"] = false;
      this.trackLiftMapFloor.push(eachLiftDetails);
    }

    this.getButtonIdAndFunction();
  }

  getButtonIdAndFunction() {
    document.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (event) => {
        // ✅ Skip the submit button

        const clickId = event.target.id;
        if (clickId === "submitbtn") return;

        const split = clickId.split("_");
        if (this.checkIfAllRunning()) {
          // track if already clicked
          const alreadyQueued = this.trackBtnFloorClickOnAllRun.some(
            (req) => req.btn === split[0] && req.floor === split[1]
          );
          if (alreadyQueued) return;
          this.trackBtnFloorClickOnAllRun.push({
            btn: split[0],
            floor: split[1],
          });
          return;
        }
        this.changeLiftFloorOnButtonClick(split[0], split[1]);
      });
    });
    this.checkPendingRequestsLoop();
  }

  checkPendingRequestsLoop() {
    setInterval(() => {
      if (
        !this.checkIfAllRunning() &&
        this.trackBtnFloorClickOnAllRun.length > 0
      ) {
        const nextRequest = this.trackBtnFloorClickOnAllRun.shift();
        if (nextRequest) {
          this.changeLiftFloorOnButtonClick(nextRequest.btn, nextRequest.floor);
        }
      }
    }, 1000); // checks every second
  }

  checkIfAllRunning() {
    return this.trackLiftMapFloor.every((item) => item.run);
  }

  hasMoreThanTwoValues(floor) {
    // return false if it is at ground floor;
    const floorFullValue = `floor_${floor}`;
    console.log(floorFullValue);
    const extractLiftMapFloorArray = this.trackLiftMapFloor.map(
      (item) => Object.values(item)[0]
    );
    console.log(extractLiftMapFloorArray);
    this.freqMap = {};
    for (const val of extractLiftMapFloorArray) {
      this.freqMap[val] = (this.freqMap[val] || 0) + 1;
    }
    if (this.freqMap[floorFullValue] >= 2) {
      return true;
    } else {
      false;
    }
  }

  async changeLiftFloorOnButtonClick(fn, floor) {
    const track = this.trackLiftMapFloor;
    console.log(typeof floor, typeof this.noOfFloor);
    if (parseInt(floor) !== parseInt(this.noOfFloor) - 1) {
      this.trackPrvFloor.push(floor);
      this.trackPrvBtnFn.push(fn);
    } else if (this.trackPrvBtnFn.length > 0) {
      this.trackPrvFloor.push(floor);
      this.trackPrvBtnFn.push(fn);
    }

    for (let i = 0; i < track.length; i++) {
      console.log(track, floor, fn);
      if (!track[i].run) {
        // find neareast lift of called floor so that only one lift door is opened
        const targetFloor = `floor_${floor}`;
        const findNearestLifOfSelectedFloorBtn =
          this.trackLiftMapFloor.findIndex(
            (item, i) => item[`lift_${i}`] == targetFloor
          );

        // check for if  lift exist for any floor

        const isLiftExist = this.trackLiftMapFloor.some(
          (item, i) => item[`lift_${i}`] == targetFloor
        );

        // checking this cause if clicked btn is from floor equal to the total floor then
        // theres no need to check for multiple lifts as there will be multiple lifts by default on ground floor.
        console.log(typeof floor, typeof (this.noOfFloor - 1));
        if (
          this.hasMoreThanTwoValues(floor) &&
          parseInt(floor) !== parseInt(this.noOfFloor - 1)
        ) {
          if (!this.trackLiftMapFloor[findNearestLifOfSelectedFloorBtn].run) {
            this.trackLiftMapFloor[findNearestLifOfSelectedFloorBtn].run = true;
            await this.animateDoorOnLiftCall(findNearestLifOfSelectedFloorBtn);
            this.trackLiftMapFloor[findNearestLifOfSelectedFloorBtn].run =
              false;
          }
          break;
        } else if (
          parseInt(floor) == parseInt(this.noOfFloor - 1) &&
          this.trackPrvBtnFn.length == 0
        ) {
          track[i].run = true;
          await this.animateDoorOnLiftCall(findNearestLifOfSelectedFloorBtn);
          track[i].run = false;
          break;
        }

        console.log(this.trackPrvBtnFn);
        // prevents calling more than one lift on same floor for same direction
        if (this.trackPrvBtnFn.length > 1 && this.trackPrvFloor.length > 1) {
          console.log(typeof floor, this.noOfFloor - 1);
          let extractPrvBtn = this.trackPrvBtnFn[this.trackPrvBtnFn.length - 2];
          let extractPrvFloor =
            this.trackPrvFloor[this.trackPrvFloor.length - 2];
          console.log(extractPrvBtn, fn);

          if (extractPrvBtn == fn && extractPrvFloor == floor) {
            // take the lift index of that floor and animate door
            // at first take the whole object of matched floor
            const targetFloor = `floor_${floor}`;
            const matched = this.trackLiftMapFloor.find(
              (item) => Object.values(item)[0] === targetFloor
            );
            const liftIndex = matched
              ? Object.keys(matched)[0]?.split("_")[1]
              : null;
            if (liftIndex && !track[liftIndex].run) {
              this.trackLiftMapFloor[liftIndex].run = true;
              await this.animateDoorOnLiftCall(liftIndex);
              this.trackLiftMapFloor[liftIndex].run = false;
              break;
            }
            break;
          } else if (
            isLiftExist &&
            extractPrvBtn !== fn &&
            !track[findNearestLifOfSelectedFloorBtn].run
          ) {
            track[i].run = true;
            await this.animateDoorOnLiftCall(findNearestLifOfSelectedFloorBtn);
            track[i].run = false;
            break;
          }
        }

        // only allow 1 lift for 1st and last floor
        if (
          (isLiftExist && parseInt(floor) == 0) ||
          (isLiftExist && parseInt(floor) == parseInt(this.noOfFloor) - 1)
        ) {
          return;
        }

        const targetFloorNum = parseInt(floor);
        let minDistance = Number.MAX_SAFE_INTEGER;
        let selectedLiftIndex = -1;
        // Find the nearest available lift
        for (let j = i; j < this.trackLiftMapFloor.length; j++) {
          if (!this.trackLiftMapFloor[j].run) {
            const liftFloorStr = this.trackLiftMapFloor[j][`lift_${j}`];
            const liftFloor = parseInt(liftFloorStr.split("_")[1]);
            const distance = Math.abs(liftFloor - targetFloorNum);
            if (distance < minDistance) {
              minDistance = distance;
              selectedLiftIndex = j;
            }
          }
        }

        if (selectedLiftIndex === -1) {
          // All lifts are running, queue the request
          this.trackBtnFloorClickOnAllRun.push({ btn: fn, floor });
          return;
        }

        const currentFloorIndex =
          track[selectedLiftIndex][`lift_` + selectedLiftIndex].split("_")[1];
        track[selectedLiftIndex][`lift_` + selectedLiftIndex] =
          `floor_` + floor;
        track[selectedLiftIndex].run = true;
        this.moveLiftAfterFoorUpdate(
          selectedLiftIndex,
          currentFloorIndex,
          floor
        );
        console.log("Success");
        // prevents more than two lifts on same floor
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

  // fn for finding which btn(up/down) is clicked and move down with down btn and up with up btn
  movementUpDown(liftIndex, currentFloorIndex, nextFloorIndex, btn) {
    const floorToMove = Math.abs(currentFloorIndex - nextFloorIndex);
    // calculate lift movement down or up if floorToMove is -ve then only down btn should move
    // lift down and if +ve then only up can move lift up.
    const movement = currentFloorIndex - nextFloorIndex;
    if (floorToMove == 0) return false;
    if (movement < 1 && btn == "down") {
      this.moveLiftAfterFoorUpdate(liftIndex, floorToMove, nextFloorIndex);
      return true;
    } else if (movement >= 1 && btn == "up") {
      this.moveLiftAfterFoorUpdate(liftIndex, floorToMove, nextFloorIndex);
      return true;
    } else {
      return false;
    }
  }

  async moveLiftAfterFoorUpdate(liftIndex, currentFloorIndex, nextFloorIndex) {
    // get floor height
    const floor = document.getElementsByClassName("floor")[0];
    const floorHeight = floor.getBoundingClientRect().height;

    const floorToMove = Math.abs(currentFloorIndex - nextFloorIndex);

    // get gap between each floor
    const building = document.getElementsByClassName("building")[0];
    const floorGap = parseFloat(
      window.getComputedStyle(building).gap.split("px")[0]
    );
    // calculate distn between adjacent floor (bottom of one floor to another )
    const calculetedDistn = floorHeight + floorGap;
    const pixelToMove = (this.noOfFloor - nextFloorIndex - 1) * calculetedDistn;
    const getLiftToMove = document.getElementById(`lift_${liftIndex}`);
    getLiftToMove.style.transition = `transform ${floorToMove * 2}s linear`;
    getLiftToMove.style.transform = `translateY(-${pixelToMove}px)`;

    setTimeout(async () => {
      await this.animateDoorOnLiftCall(liftIndex);
      this.trackLiftMapFloor[liftIndex].run = false;
    }, floorToMove * 2 * 1000);
  }
}

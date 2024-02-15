"use strict";

// DOM
const towersDIVs = document.querySelectorAll(".tower");
const hanoiansDIVs = document.getElementsByClassName("hanoi"); // at first this is undefined

//  Game
const towers = [
  {
    id: 0,
    hanoians: [],
  },
  {
    id: 1,
    hanoians: [],
  },
  {
    id: 2,
    hanoians: [],
  },
];

let selectedHanoi;

const henoiColors = ["blue", "yellow", "green"];

// Functions - GAME LOGIC
// Function to select a hanoi when clicked
function selectHanoi(e) {
  const { value, tower } = e.target.dataset;

  if (selectedHanoi) {
    // If the selected hanoi is clicked again, deselect it
    if (selectedHanoi.value === +value) {
      e.target.classList.remove("hanoi-active");
      selectedHanoi = null;
    }

    return;
  }

  const isHanoiAtTop = towers[+tower].hanoians.indexOf(+value) === 0;
  // Check if the clicked hanoi is at the top of its tower
  if (!isHanoiAtTop) return;

  // Set the clicked hanoi as selected
  selectedHanoi = { value: +value, tower: +tower };
  e.target.classList.add("hanoi-active"); // Apply active class to the selected hanoi
}

// Function to move a hanoi when a tower is clicked
function moveHanoi(e, clickedTowerIdx) {
  if (!selectedHanoi || selectedHanoi?.tower === clickedTowerIdx) return;

  const newHanoiTower = towers[clickedTowerIdx];

  // Check if the selected hanoi can be placed on the clicked tower
  if (
    newHanoiTower.hanoians[0] &&
    selectedHanoi.value > newHanoiTower.hanoians[0]
  )
    return;

  // Move the hanoi to the new tower
  newHanoiTower.hanoians.unshift(selectedHanoi.value);

  // Remove the hanoi from the previous tower
  towers[selectedHanoi.tower].hanoians.splice(
    towers[selectedHanoi.tower].hanoians.indexOf(selectedHanoi?.value),
    1
  );

  // Find the hanoi element in the DOM and move it to the new tower
  for (let i = 0; i < towersDIVs.length; i++) {
    const towerChildren = [...towersDIVs[i].children];
    const hanoiDIV = towerChildren.find((hanoi) =>
      hanoi.classList.contains("hanoi-active")
    );

    if (hanoiDIV) {
      towersDIVs[i].removeChild(hanoiDIV);
      hanoiDIV.setAttribute("data-tower", clickedTowerIdx);
      e.prepend(hanoiDIV);
      hanoiDIV.classList.remove("hanoi-active");
      break;
    }
  }

  selectedHanoi = undefined;

  // Check if the player has won the game
  checkWin();
}

// Function to check if the player has won the game
function checkWin() {
  const winCondition = towers[towers.length - 1].hanoians.length === 3;

  if (winCondition) {
    alert("You won!"); // Display a victory message
  }
}

// Function to generate hanoians and initialize the game
function generateHanoians() {
  const hanoiansArr = Array.from({ length: 3 }).map((_, i) => i + 1);
  towers[0].hanoians = hanoiansArr;

  const html = hanoiansArr
    .map(
      (hanoi, idx) =>
        `<div style="width:${50 * hanoi + "px"}; background-color:${
          henoiColors[idx]
        }" class="hanoi" data-value="${hanoi}" data-tower="0"></div>`
    )
    .join("");

  towersDIVs[0].insertAdjacentHTML("afterbegin", html);
}

// Event listeners
(() => {
  generateHanoians(); // Generate hanoians when the game starts

  // Add event listeners to hanoians
  Array.from(hanoiansDIVs).forEach((hanoi) =>
    hanoi.addEventListener("click", selectHanoi)
  );

  // Add event listeners to towers
  towersDIVs.forEach((towerDIV, idx) =>
    towerDIV.addEventListener("click", () => {
      moveHanoi(towerDIV, idx);
    })
  );
})();

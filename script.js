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
let curentDragOverTowerIdx;

const henoiColors = ["blue", "yellow", "green"];

// Functions - GAME LOGIC

// Function to generate hanoians and initialize the game
function generateHanoians() {
  // 1) Generate an array representing the hanoians
  const hanoiansArr = Array.from({ length: 3 }).map((_, i) => i + 1);
  // 2) Set the hanoians of the first tower to the generated array
  towers[0].hanoians = hanoiansArr;
  // 3) Generate HTML elements for each hanoi
  const html = hanoiansArr
    .map(
      (hanoi, idx) =>
        `<div style="width:${50 * hanoi + "px"}; background-color:${
          henoiColors[idx]
        }" class="hanoi" data-value="${hanoi}" data-tower="0" draggable="true"></div>`
    )
    .join("");
  // 4) Insert the generated HTML elements into the first tower's DIV
  towersDIVs[0].insertAdjacentHTML("afterbegin", html);
}

// this = e.target = <div class="hanoi">
function onHanoiDragStart(e) {
  // 1) Retrieve the value and tower of the selected hanoi (data-tower="", data-value="")
  const { value, tower } = this.dataset;
  // 2) Check if the selected hanoi is at the top of its tower
  const isHanoiAtTop = towers[+tower].hanoians.indexOf(+value) === 0;
  // 3) Prevent dragging if the selected hanoi is not at the top
  if (!isHanoiAtTop) {
    e.preventDefault();
    return;
  }
  // 4) Store information about the selected hanoi
  selectedHanoi = { value: +value, tower: +tower, div: this };
  // 5) Apply active class to the selected hanoi
  this.classList.add("hanoi-active");
}

//
function onHanoiDragEnd() {
  const newHanoiTower = towers[curentDragOverTowerIdx];

  if (newHanoiTower) {
    // 1) Check if the selected hanoi can be placed on the clicked tower
    if (
      newHanoiTower.hanoians[0] &&
      selectedHanoi.value > newHanoiTower.hanoians[0]
    )
      return;
    // 2) Move the hanoi to the new tower
    towers[curentDragOverTowerIdx].hanoians.unshift(selectedHanoi.value);
    // 3) Remove the hanoi from the previous tower
    towers[selectedHanoi.tower].hanoians.splice(
      towers[selectedHanoi.tower].hanoians.indexOf(selectedHanoi?.value),
      1
    );
    // 4) Place the selected hanoi's div into the new tower's DIV
    towersDIVs[curentDragOverTowerIdx].prepend(selectedHanoi.div);
    // 5) Update the data-tower attribute of the selected hanoi's div
    selectedHanoi.div.setAttribute("data-tower", curentDragOverTowerIdx);
  }

  // Reset
  selectedHanoi.div.classList.remove("hanoi-active");
  curentDragOverTowerIdx = null;
  selectedHanoi = null;

  // Check winner
  checkWin();
}

// this = e.target = <div class="tower">
function onTowerDragOver(e, towerIdx) {
  // 1) Check if there is a selected hanoi and it's not on the same tower
  if (!selectedHanoi || selectedHanoi?.tower === towerIdx) return;
  // 2) Get the tower object for the tower being dragged over
  const newHanoiTower = towers[towerIdx];
  // 3) Check if the selected hanoi can be placed on the clicked tower
  if (
    newHanoiTower.hanoians[0] &&
    selectedHanoi.value > newHanoiTower.hanoians[0]
  )
    return;

  // 4) Prevent the default behavior of the dragover event
  e.preventDefault();

  // 5) Set the current drag over tower index
  curentDragOverTowerIdx = towerIdx;
}

// Function to check if the player has won the game
function checkWin() {
  const winCondition = towers[towers.length - 1].hanoians.length === 3;

  if (winCondition) {
    alert("You won!"); // Display a victory message
  }
}

// Event listeners
(() => {
  generateHanoians(); // Generate hanoians when the game starts

  // Add event listeners to hanoians
  Array.from(hanoiansDIVs).forEach((hanoi) => {
    hanoi.addEventListener("dragstart", onHanoiDragStart);
    hanoi.addEventListener("dragend", onHanoiDragEnd);
  });

  // Add event listeners to towers
  towersDIVs.forEach((towerDIV, idx) =>
    towerDIV.addEventListener("dragover", (e) =>
      onTowerDragOver.call(towerDIV, e, idx)
    )
  );
})();

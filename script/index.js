"use strict";
// ELEMENTS
const towersContainer = document.querySelector(".towers");
const towersDIV = document.querySelectorAll(".tower");

// Game
let selectedHanoi = null;
let towers = [
  {
    id: 0,
    div: towersDIV[0],
    hanoies: [],
  },
  {
    id: 1,
    div: towersDIV[1],
    hanoies: [],
  },
  {
    id: 2,
    div: towersDIV[2],
    hanoies: [],
  },
];

const selectHenoi = (clickedHenoi) => {
  if (!clickedHenoi) return;

  const previousElement =
    clickedHenoi.previousSibling?.textContent?.length === 17
      ? 9999
      : clickedHenoi.previousSibling?.textContent;
  const aboveIsSmallerHenoi = previousElement < clickedHenoi.textContent;

  if (aboveIsSmallerHenoi) return;

  selectedHanoi = clickedHenoi;
  clickedHenoi.classList.add("active");
};

const generateHanois = () => {
  let hanoies = Array.from({ length: 6 }).map((_, i) =>
    document.createElement("div")
  );
  hanoies.map((hanoi, i) => {
    hanoi.classList.add("henoi");
    hanoi.style.width = `${150 - (10 - i * 30)}px`;
    hanoi.textContent = i + 1;

    towers[0].div.appendChild(hanoi);
    towers[0].hanoies.unshift(hanoi); // insert hanoies in tower
  });
};

const addHenoiToTower = (tower) => {
  // Get hanoi that is at top of tower
  const lastHanoiInThisTower =
    +tower.hanoies[tower.hanoies.length - 1]?.textContent;

  console.log(lastHanoiInThisTower);

  // If that hanoi is smaller than hanoi that we trying to add, return;
  if (lastHanoiInThisTower < +selectedHanoi.textContent) {
    selectedHanoi.classList.remove("active");
    selectedHanoi = null;
    return;
  }

  // Index of tower where this hanoi was
  const index = towers.findIndex(
    (tower) => tower.hanoies.indexOf(selectedHanoi) !== -1
  );
  // Remove hanoi from that tower
  towers[index].hanoies.pop();
  // Add hanoi to another tower
  tower.hanoies.push(selectedHanoi);
  // Dom manipulation
  tower.div.prepend(selectedHanoi);
  selectedHanoi.classList.remove("active");

  // Set selected hanoi back to null
  selectedHanoi = null;
};

const addEventListenersToHenoi = () => {
  towers.forEach((tower) => {
    tower.div.addEventListener("click", (e) => {
      if (selectedHanoi) {
        addHenoiToTower(tower);
      } else {
        selectHenoi(e.target.closest(".henoi"));
      }
    });
  });
};

(() => {
  generateHanois();
  addEventListenersToHenoi();
})();

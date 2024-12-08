// Source code: https://codepen.io/francesc/pen/dPbMZRd

// const TADA_SRC='https://saltamarges.org/bingo/tada.mp3';
const TADA_SRC = 'tada.mp3';

// const ROLLING_SRC = 'https://saltamarges.org/bingo/rolling.mp3';
const ROLLING_SRC = 'rolling.mp3';

const FLASH_DELAY_MS = 100;
const MIN_FLASHES = 20;
const MAX_FLASHES = 50;

const numbersOn = [];
const numbersOff = [];

let currentFlash = null;
let flashCount = 0;

let lastCell = null;

const tadaSound = new Audio(TADA_SRC);
const rollingSound = new Audio(ROLLING_SRC);

const randomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const createCell = (id, text = null) => {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = `cell${id}`;
  cell.appendChild(document.createTextNode(text || id));
  return cell;
};

const populateGrid = (gridElement, numElements = 90) => {
  for (let i = 0; i < numElements; i++) {
    gridElement.appendChild(createCell(i + 1));
    numbersOff.push(i + 1);
  }
};

const unFlash = () => {
  if (currentFlash)
    document.getElementById(`cell${currentFlash}`).classList.remove('flash');
  currentFlash = null;
};

const flashNext = () => {
  unFlash();
  if (numbersOff.length > 0) {
    const index = randomInt(numbersOff.length);
    currentFlash = numbersOff[index];
    document.getElementById(`cell${currentFlash}`).classList.add('flash');
  }
};

const markNum = () => {
  unFlash();
  if (lastCell) {
    document.getElementById(`cell${lastCell}`).classList.remove('lastCell');
    lastCell = null;
  }
  if (numbersOff.length > 0) {
    const index = randomInt(numbersOff.length);
    const num = numbersOff[index];
    document.getElementById(`cell${num}`).classList.add('cellOn', 'lastCell');
    numbersOn.push(num);
    numbersOff.splice(index, 1);
    lastCell = num;
  }
  rollingSound.pause();
  tadaSound.play();
};

const nextFlash = () => {
  if (--flashCount <= 0) markNum();
  else {
    flashNext();
    window.setTimeout(nextFlash, FLASH_DELAY_MS);
  }
};

const nextNum = () => {
  if (!flashCount) {
    flashCount = MIN_FLASHES + randomInt(MAX_FLASHES - MIN_FLASHES);
    rollingSound.currentTime = 0;
    rollingSound.play();
    nextFlash();
  }
};

window.onload = function () {
  populateGrid(document.getElementById('grid'), 90);
  document.addEventListener("keydown", (ev) => {
    if (ev.key === ' ')
      nextNum();      
  });
  // document.addEventListener('click', nextNum);
};

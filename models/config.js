// === GLOBAL VARIABLES ===

// DOM elementszz
export const introScreen = document.getElementById("introScreen");
export const ballDive = document.getElementById("ball");
export const paddleDive = document.getElementById("paddle");
export const gameMessage = document.getElementById("gameMessage");
export const bricksContainer = document.getElementById("bricksContainer");
export const timeValue = document.querySelector(".time-value");
export const container = document.getElementById("gameArea");
export const pauseIcon = document.querySelector(".pause-icon");
export const continueBtn = document.getElementById("continueBtn");
export const restartBtn = document.getElementById("restartBtn");
export const scoreValue = document.querySelector(".score-value");
export const lifeValue = document.querySelector(".lives-value");
export const gameContainer = document.getElementById("content")


// Game state
export const gameState = {
  gameStart: false,
  gamePause: false,
  gameOver: false,
  gameWine: false,
};

// Levels
export const Level1 = [
  0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
  1, 1, 2, 2, 1, 1,
]

export const Level2 = [
  1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
  1, 1, 0, 0, 1, 1,
  1, 0, 0, 0, 0, 1,
  0, 0, 0, 0, 0, 0,
]

export const Level3 = [
  1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
  1, 1, 0, 0, 1, 1,
]

// Brick settings
export const brick = {
  rows: 6,
  cols: 6,
  gap: 10,
  width: 0,
  height: 0,
  colors: [
    "brick-red",
    "brick-orange",
    "brick-yellow",
    "brick-green",
    "brick-blue",
    "brick-purple",
  ],
};
export const bricksPositions = [];

// Paddle settings
export const paddle = {
  element: paddleDive,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

// Ball settings
export const ball = {
  x: 0,
  y: 0,
  width: ballDive.clientWidth,
  height: ballDive.clientHeight,
  speed: 4,
  dx: 4,
  dy: -4,
};

// Canvas size
export const cvs = { width: 0, height: 0 };

// Keyboard controls
export let cursors = { rightPressed: false, leftPressed: false };

// Timer
export const time = {
  interval: null,
  sec: 0,
  min: 0,
};

// Score & Lives
export const gameStatus = {
  lifes: 3,
  score: 0,
  scoreValue: scoreValue,
  lifeValue: lifeValue,
};

export const requestID = { id: null };

export let wait = { status: false };

export const lastTime = {time: performance.now()}

export const Levels = {
  level: 1,
  1: Level1,
  2: Level2,
  3: Level3,
};

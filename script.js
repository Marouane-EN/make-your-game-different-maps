import * as config from "./models/config.js";
import { movePaddle, setupInput } from "./models/paddel.js";
import { resetBall } from "./models/ball.js";
import {
  draw,
  clearAnimation,
  creatTime,
  updateGameAreaSize,
  setupSizes,
  createBricks,
} from "./models/helpers.js";
import {
  Pause,
  start,
  Restart,
  gameOver,
  gameWin,
} from "./models/gameStatus.js";

function loop(now) {
  let delta = (now - config.lastTime.time) / 1000; // convert ms → seconds
  config.lastTime.time = now;
  if (!config.gameState.gameStart && !config.wait.status) return;
  if (config.gameState.gameStart && !config.wait.status) {
    update(delta);
    draw();
    config.requestID.id = requestAnimationFrame(loop);
  } else if (
    config.gameState.gameStart &&
    config.wait.status &&
    !config.gameState.gameOver &&
    !config.gameState.gameWine
  ) {
    movePaddle(config.cursors, config.paddle, config.cvs);
    resetBall();
    draw();
    config.requestID.id = requestAnimationFrame(loop);
  }
}

function update(delta) {
  movePaddle(config.cursors, config.paddle, config.cvs);
  if (isNaN(delta)) {
    delta = 0.016;
  }
  config.ball.x += config.ball.dx * delta * 60;
  config.ball.y += config.ball.dy * delta * 60;

  if (config.ball.x <= 0) {
    if (config.ball.dx < 0) {
      config.ball.dx *= -1;
    }
    return;
  }
  if (config.ball.x + config.ball.width >= config.cvs.width) {
    if (config.ball.dx > 0) {
      config.ball.dx *= -1;
    }

    return;
  }
  if (config.ball.y <= 0) {
    if (config.ball.dy < 0) {
      config.ball.dy *= -1;
    }
    return;
  }
  if (config.ball.y >= config.cvs.height) {
    config.gameStatus.lifes--;

    if (config.gameStatus.lifes === 0) {
      config.gameState.gameOver = true;
      config.gameState.gameStart = false;
      gameOver();
      return;
    }
    config.wait.status = true;
    setTimeout(() => {
      config.wait.status = false;
      clearAnimation();
      loop();
    }, 1500);
    return;
  }

  // Collision with paddle
  if (
    config.ball.y + config.ball.height >= config.paddle.y &&
    config.ball.y <= config.paddle.y + config.paddle.height / 2 &&
    config.ball.x + config.ball.width >= config.paddle.x &&
    config.ball.x <= config.paddle.x + config.paddle.width
  ) {
    // to check the  ball is in the left or right of the paddel debend of the center of the paddle
    let collidePoint =
      config.ball.x +
      config.ball.width / 2 -
      (config.paddle.x + config.paddle.width / 2);
    //  to make the collidePoint  between [-1 , 1 ]
    collidePoint =
      Math.floor((collidePoint / (config.paddle.width / 2)) * 10) / 10;

    // if the ball hit  exactly the center of the paddle -> with an angle (zawya)
    if (collidePoint >= 0 && collidePoint <= 0.2) {
      collidePoint = 0.2;
    }
    if (collidePoint >= -0.2 && collidePoint < 0) {
      collidePoint = -0.2;
    }
    //zawya li ghatmchi biha ela hsaab lblasa fin drbat lball
    let angle = collidePoint * (Math.PI / 3);

    config.ball.dx = (config.ball.speed + 1) * Math.sin(angle);
    config.ball.dy = -(config.ball.speed + 1) * Math.cos(angle);
    return;
  }

  // Collision with bricks
  for (let b of config.bricksPositions) {
    if (!b.status) continue;

    const ballLeft = config.ball.x;
    const ballRight = config.ball.x + config.ball.width;
    const ballTop = config.ball.y;
    const ballBottom = config.ball.y + config.ball.height;

    const brickLeft = b.x;
    const brickRight = b.x + b.width;
    const brickTop = b.y;
    const brickBottom = b.y + b.height;

    const isColliding =
      ballRight > brickLeft &&
      ballLeft < brickRight &&
      ballBottom > brickTop &&
      ballTop < brickBottom;

    if (isColliding) {
      if (b.type > 1 && b.count < 1) {
        b.element.classList.add("crack");
        b.count++;
      } else {
        b.status = false;
        b.element.style.opacity = 0;
        config.gameStatus.score += 20;
      }

      // Calculate how deep the ball overlaps on each side
      const overlapLeft = ballRight - brickLeft;
      const overlapRight = brickRight - ballLeft;
      const overlapTop = ballBottom - brickTop;
      const overlapBottom = brickBottom - ballTop;

      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      const threshold = 4; // corner sensitivity in pixels

      if (Math.abs(minOverlapX - minOverlapY) < threshold) {
        config.ball.dx *= -1;
        config.ball.dy *= -1;
      } else if (minOverlapX < minOverlapY) {
        // side collision
        config.ball.dx *= -1;
      } else {
        // top/bottom collision
        config.ball.dy *= -1;
      }

      break;
    }
  }
  const allBricksBroken = config.bricksPositions.every(
    (b) => b.status === false
  );
  if (
    allBricksBroken &&
    config.Levels.level < 3 &&
    !config.gameState.gameOver &&
    !config.gameState.gameWine
  ) {
    config.Levels.level++;
    nextLevel();
    return;
  }
  if (
    allBricksBroken &&
    config.Levels.level === 3 &&
    !config.gameState.gameOver &&
    !config.gameState.gameWine
  ) {
    config.gameState.gameWine = true;
    config.gameState.gameStart = false;
    gameWin();
    return;
  }
}

function nextLevel() {
  config.wait.status = true;
  config.levelContainer.style.display = "block";
  config.levelMessage.textContent = `Level ${config.Levels.level}`;
  setTimeout(() => {
    config.levelContainer.style.display = "none";
    config.wait.status = false;
    clearAnimation();
    loop();
  }, 1500);
  if (config.Levels.level < 3) {
    config.ball.speed += 2.5;
  } else {
    config.ball.speed += 0.5;
  }
  createBricks();
}

function GameLoop() {
  config.introScreen.classList.add("image");
  config.gameContainer.style.opacity = "0";
  config.continueBtn.addEventListener("click", () => {
    config.gameContainer.style.opacity = "1";
    config.gameState.gameStart = true;
    config.gameState.gamePause = false;
    start();
    creatTime();
    clearAnimation();
    loop();
  });

  config.restartBtn.addEventListener("click", () => {
    Restart();
  });

  let spaceCooldown = false;

  document.body.addEventListener("keydown", (event) => {
    if (event.key === " " && !spaceCooldown) {
      spaceCooldown = true;
      if (
        (config.gameState.gameOver || config.gameState.gameWine) &&
        config.gameState.gamePause
      ) {
        Restart();
      } else if (!config.gameState.gameStart && !config.gameState.gamePause) {
        config.introScreen.classList.add("hidden");
        config.gameContainer.style.opacity = "1";
        config.gameState.gameStart = true;
        config.gameState.gamePause = false;
        start();
        creatTime();
        clearAnimation();
        loop();
      } else if (config.gameState.gameStart && !config.gameState.gamePause) {
        config.gameContainer.style.opacity = "0.3";
        config.gameState.gamePause = true;
        config.gameState.gameStart = false;
        clearAnimation();
        creatTime();
        Pause();
      } else if (
        !config.gameState.gameStart &&
        config.gameState.gamePause &&
        !config.gameState.gameOver &&
        !config.gameState.gameWine
      ) {
        config.gameContainer.style.opacity = "1";
        config.gameState.gameStart = true;
        config.gameState.gamePause = false;
        start();
        creatTime();
        clearAnimation();
        loop();
      }

      setTimeout(() => {
        spaceCooldown = false;
      }, 500);
    }
  });

  updateGameAreaSize();
  setupSizes();
  createBricks();
  setupInput(config.cursors);
  let resizeTimeout;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      Restart();
    }, 200);
  });
}
document.addEventListener("load", GameLoop());

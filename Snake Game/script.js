// Initialize canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let snake = [];
let food = {};
let direction = "right";
let nextDirection = "right";
let gameRunning = false;
let gameSpeed = 100;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;

// Grid settings
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// Initialize game
function initGame() {
  // Reset snake to starting position
  snake = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ];

  // Reset direction
  direction = "right";
  nextDirection = "right";

  // Reset score
  score = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("highScore").textContent = highScore;

  // Place food
  placeFood();

  // Draw initial state
  draw();
}

// Generate random position for food
function placeFood() {
  // Generate random position
  food = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };

  // Make sure food doesn't appear on snake
  for (let segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      placeFood(); // Try again
      break;
    }
  }
}

// Draw everything on canvas
function draw() {
  // Clear canvas
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    // Head is a different color
    ctx.fillStyle = index === 0 ? "#32CD32" : "#4CAF50";
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );

    // Draw border for each segment
    ctx.strokeStyle = "#2E8B57";
    ctx.strokeRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });

  // Draw food
  ctx.fillStyle = "#FF6347";
  ctx.beginPath();
  const centerX = food.x * gridSize + gridSize / 2;
  const centerY = food.y * gridSize + gridSize / 2;
  const radius = gridSize / 2;
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
}

// Update game state
function update() {
  if (!gameRunning) return;

  // Update direction
  direction = nextDirection;

  // Get current head position
  const head = { ...snake[0] };

  // Move head based on direction
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  // Check for collisions with walls
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    gameOver();
    return;
  }

  // Check for collisions with self
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  // Add new head
  snake.unshift(head);

  // Check if food eaten
  if (head.x === food.x && head.y === food.y) {
    // Increase score
    score++;
    document.getElementById("score").textContent = score;

    // Update high score if needed
    if (score > highScore) {
      highScore = score;
      document.getElementById("highScore").textContent = highScore;
      localStorage.setItem("snakeHighScore", highScore);
    }

    // Place new food
    placeFood();

    // Speed up slightly every 5 points
    if (score % 5 === 0 && gameSpeed > 50) {
      gameSpeed -= 5;
    }
  } else {
    // Remove tail if no food was eaten
    snake.pop();
  }

  // Draw updated game
  draw();

  // Schedule next update
  setTimeout(update, gameSpeed);
}

// Game over function
function gameOver() {
  gameRunning = false;
  alert(`Game Over! Your score: ${score}`);
}

// Start the game
function startGame() {
  if (!gameRunning) {
    gameRunning = true;
    gameSpeed = 100;
    update();
  }
}

// Key press handler
function handleKeyPress(e) {
  if (!gameRunning) return;

  // Prevent default key actions (like scrolling)
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }

  // Change direction based on key press
  // Prevent 180-degree turns (can't go directly opposite of current direction)
  switch (e.key) {
    case "ArrowUp":
      if (direction !== "down") nextDirection = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") nextDirection = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") nextDirection = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") nextDirection = "right";
      break;
  }
}

// Event listeners
document.getElementById("startBtn").addEventListener("click", () => {
  initGame();
  startGame();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  initGame();
  startGame();
});

document.addEventListener("keydown", handleKeyPress);

// Initialize the game on load
window.addEventListener("load", initGame);

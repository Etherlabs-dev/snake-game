// Game constants
const GRID_SIZE = 20;
const GRID_COUNT = 20;
const GAME_SPEED = 100;

// Game variables
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameLoop = null;
let score = 0;

// Get canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = canvas.width / GRID_COUNT;

// Initialize game
function initGame() {
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    generateFood();
    score = 0;
    direction = 'right';
    nextDirection = 'right';
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
}

// Generate food at random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * GRID_COUNT),
        y: Math.floor(Math.random() * GRID_COUNT)
    };
    // Check if food spawned on snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

// Update game state
function update() {
    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check collision with walls
    if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
        gameOver();
        return;
    }

    // Check collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 1, cellSize - 1);
    });

    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1);
}

// Game loop
function runGameLoop() {
    update();
    render();
}

// Game over
function gameOver() {
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

// Start game
function startGame() {
    initGame();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(runGameLoop, GAME_SPEED);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// Start the game when the page loads
window.onload = startGame;
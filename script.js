// Get canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleHeight = 80;
const paddleWidth = 10;
const ballSize = 8;
const gameWidth = canvas.width;
const gameHeight = canvas.height;

// Player paddle
const player = {
    x: 10,
    y: gameHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Computer paddle
const computer = {
    x: gameWidth - paddleWidth - 10,
    y: gameHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 4
};

// Ball object
const ball = {
    x: gameWidth / 2,
    y: gameHeight / 2,
    dx: -5,
    dy: -5,
    size: ballSize,
    speed: 5,
    maxSpeed: 8
};

// Scores
let playerScore = 0;
let computerScore = 0;

// Input handling
const keys = {};
let mouseY = gameHeight / 2;

// Keyboard input
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse input
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update game state
function update() {
    // Move player paddle with mouse and arrow keys
    if (keys['ArrowUp'] || keys['w']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] || keys['s']) {
        player.y += player.speed;
    }

    // Use mouse Y position
    const mouseDiff = mouseY - (player.y + paddleHeight / 2);
    if (Math.abs(mouseDiff) > 5) {
        player.y += mouseDiff * 0.2;
    }

    // Constrain player paddle to canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > gameHeight) player.y = gameHeight - player.height;

    // Computer AI
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    if (computerCenter < ballCenter - 35) {
        computer.y += computer.speed;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= computer.speed;
    }

    // Constrain computer paddle to canvas
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > gameHeight) computer.y = gameHeight - computer.height;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.size < 0 || ball.y + ball.size > gameHeight) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.size < 0 ? ball.size : gameHeight - ball.size;
    }

    // Ball collision with paddles
    if (
        ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.size;
        
        // Add spin based on paddle position
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy += deltaY * 0.05;
        
        // Increase ball speed slightly
        const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
        if (speed < ball.maxSpeed) {
            ball.dx *= 1.02;
            ball.dy *= 1.02;
        }
    }

    if (
        ball.x + ball.size > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.size;
        
        // Add spin based on paddle position
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy += deltaY * 0.05;
        
        // Increase ball speed slightly
        const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
        if (speed < ball.maxSpeed) {
            ball.dx *= 1.02;
            ball.dy *= 1.02;
        }
    }

    // Score points and reset ball
    if (ball.x - ball.size < 0) {
        computerScore++;
        resetBall();
    }
    if (ball.x + ball.size > gameWidth) {
        playerScore++;
        resetBall();
    }

    // Update scoreboard
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Reset ball to center
function resetBall() {
    ball.x = gameWidth / 2;
    ball.y = gameHeight / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 6;
}

// Draw game objects
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Draw center line
    ctx.strokeStyle = '#00ff00';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
    ctx.shadowBlur = 0;

    // Draw ball
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

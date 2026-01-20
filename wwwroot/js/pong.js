const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const menuOverlay = document.getElementById("menuOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreSpan = document.getElementById("finalScore");

// ===== GAME STATE =====
let gameRunning = false;
let botSpeed = 2;
let score = 0;

// ===== PADDLES =====
const paddleWidth = 10;
const paddleHeight = 100;

const botWidth = 10;
const botHeight = 100;

let paddleY = (canvas.height - paddleHeight) / 2;
let botY = (canvas.height - botHeight) / 2;

// ===== BALL =====
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
const ballRadius = 10;
let ballSpeedX = 0;
let ballSpeedY = 0;

// ===== START GAME =====
function startGame(difficulty) {
    menuOverlay.style.display = "none";
    gameOverOverlay.style.display = "none";

    if (difficulty === "easy") botSpeed = 1;
    else if (difficulty === "medium") botSpeed = 3;
    else if (difficulty === "hard") botSpeed = 6;

    score = 0;
    document.getElementById("score").innerText = score;

    paddleY = (canvas.height - paddleHeight) / 2;
    botY = (canvas.height - botHeight) / 2;

    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 4;
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

    gameRunning = true;
}

// ===== RESTART =====
function restartGame() {
    gameOverOverlay.style.display = "none";
    menuOverlay.style.display = "flex";
    gameRunning = false;
}

// ===== GAME OVER =====
function showGameOver() {
    finalScoreSpan.innerText = score;
    gameOverOverlay.style.display = "flex";
}

// ===== DRAW =====
function drawPaddle() {
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(0, paddleY, paddleWidth, paddleHeight);
}

function drawBot() {
    ctx.fillStyle = "#DD9500";
    ctx.fillRect(canvas.width - botWidth, botY, botWidth, botHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff4757"; // RED ball so it's visible
    ctx.fill();
}

// ===== GAME LOOP =====
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameRunning) {
        requestAnimationFrame(draw);
        return;
    }

    drawPaddle();
    drawBot();
    drawBall();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce top/bottom
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY *= -1;
    }

    // Player paddle
    if (
        ballX - ballRadius < paddleWidth &&
        ballY > paddleY &&
        ballY < paddleY + paddleHeight
    ) {
        ballSpeedX *= -1;
        score++;
        document.getElementById("score").innerText = score;
    }

    // Bot paddle
    if (
        ballX + ballRadius > canvas.width - botWidth &&
        ballY > botY &&
        ballY < botY + botHeight
    ) {
        ballSpeedX *= -1;
    }

    // Game over
    // Player missed
    if (ballX - ballRadius < 0 && gameRunning) {
        gameRunning = false;
        saveScore(score);
        showGameOver();
    }

    // Bot missed
    if (ballX + ballRadius > canvas.width && gameRunning) {
        gameRunning = false;
        saveScore(score);
        showGameOver();
    }


    // Bot AI
    const botCenter = botY + botHeight / 2;
    if (ballY > botCenter + 10) botY += botSpeed;
    else if (ballY < botCenter - 10) botY -= botSpeed;

    botY = Math.max(0, Math.min(canvas.height - botHeight, botY));

    requestAnimationFrame(draw);
}

// ===== PLAYER CONTROL =====
canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    paddleY = e.clientY - rect.top - paddleHeight / 2;
    paddleY = Math.max(0, Math.min(canvas.height - paddleHeight, paddleY));
});

// ===== SAVE SCORE =====
function saveScore(score) {
    fetch("/Game/SaveScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score })
    });
}

// START LOOP
draw();

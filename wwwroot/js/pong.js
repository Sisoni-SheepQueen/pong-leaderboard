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
const paddleWidth = 10, paddleHeight = 100;
let paddleY = (canvas.height - paddleHeight) / 2;
let botY = (canvas.height - paddleHeight) / 2;

// ===== BALL =====
let ballX, ballY;
let ballRadius = 10;
let ballSpeedX, ballSpeedY;

// ===== START GAME =====
function startGame(difficulty) {
    // make sure overlay exists
    if (menuOverlay) menuOverlay.style.display = "none";
    if (gameOverOverlay) gameOverOverlay.style.display = "none";

    // Set bot speed depending on difficulty
    if (difficulty === "easy") botSpeed = 1;
    else if (difficulty === "medium") botSpeed = 3;
    else if (difficulty === "hard") botSpeed = 6;

    // Reset score and paddles
    score = 0;
    document.getElementById("score").innerText = score;

    paddleY = (canvas.height - paddleHeight) / 2;
    botY = (canvas.height - paddleHeight) / 2;

    // Reset ball in center
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

// ===== DRAW =====
function drawPaddle() {
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(0, paddleY, paddleWidth, paddleHeight);
}

function drawBot() {
    ctx.fillStyle = "#DD9500";
    ctx.fillRect(canvas.width - paddleWidth, botY, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
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

    // Ball move
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall bounce
    if (ballY < ballRadius || ballY > canvas.height - ballRadius) {
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
        ballX + ballRadius > canvas.width - paddleWidth &&
        ballY > botY &&
        ballY < botY + paddleHeight
    ) {
        ballSpeedX *= -1;
    }

    // Missed
    if (ballX < 0) {
        gameRunning = false;
        finalScoreSpan.innerText = score;
        gameOverOverlay.style.display = "flex";
        saveScore(score);
    }

    // Bot AI
    let botCenter = botY + paddleHeight / 2;
    if (ballY > botCenter + 10) botY += botSpeed;
    else if (ballY < botCenter - 10) botY -= botSpeed;

    botY = Math.max(0, Math.min(canvas.height - paddleHeight, botY));

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

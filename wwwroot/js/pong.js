const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Paddle
const paddleWidth = 10, paddleHeight = 100;
let paddleY = (canvas.height - paddleHeight) / 2;

// Bot Paddle
const botWidth = 10, botHeight = 100;
let botY = (canvas.height - botHeight) / 2;
const botSpeed = 4; // higher number = harder bot

// Ball
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Score
let score = 0;

function drawPaddle() {
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(0, paddleY, paddleWidth, paddleHeight);
}

function drawBot() {
    ctx.fillStyle = "#DD9500"; // bot color
    ctx.fillRect(canvas.width - botWidth, botY, botWidth, botHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawBot();
    drawBall();

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce top/bottom
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Bounce player paddle
    if (ballX - ballRadius < paddleWidth &&
        ballY > paddleY &&
        ballY < paddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        score += 1;
        document.getElementById("score").innerText = score;
    }

    // Bounce bot paddle
    if (ballX + ballRadius > canvas.width - botWidth &&
        ballY > botY &&
        ballY < botY + botHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball missed player
    if (ballX - ballRadius < 0) {
        alert("Game Over! Your score: " + score);
        saveScore(score);
        document.location.reload();
    }

    // Ball missed bot (bounce back)
    if (ballX + ballRadius > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX; // bounce back to player
        ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1); // random vertical direction
    }

    // Bot AI: follow the ball
    const botCenter = botY + botHeight / 2;
    if (ballY > botCenter + 10) { // add a small buffer to smooth movement
        botY += botSpeed;
    } else if (ballY < botCenter - 10) {
        botY -= botSpeed;
    }

    // Keep bot inside canvas
    if (botY < 0) botY = 0;
    if (botY + botHeight > canvas.height) botY = canvas.height - botHeight;

    requestAnimationFrame(draw);
}

// Control paddle with mouse
canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    paddleY = e.clientY - rect.top - paddleHeight / 2;

    // Keep player paddle inside canvas
    if (paddleY < 0) paddleY = 0;
    if (paddleY + paddleHeight > canvas.height) paddleY = canvas.height - paddleHeight;
});

draw();

function saveScore(score) {
    fetch('/Game/SaveScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: score })
    });
}

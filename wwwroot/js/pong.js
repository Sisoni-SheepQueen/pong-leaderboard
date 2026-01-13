const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Paddle
const paddleWidth = 10, paddleHeight = 100;
let paddleY = (canvas.height - paddleHeight) / 2;

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
    drawBall();

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce top/bottom
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Bounce paddle
    if (ballX - ballRadius < paddleWidth && ballY > paddleY && ballY < paddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        score += 1;
        document.getElementById("score").innerText = score;
    }

    // Ball missed
    if (ballX - ballRadius < 0) {
        alert("Game Over! Your score: " + score);
        saveScore(score); // записваме резултата
        document.location.reload();
    }

    requestAnimationFrame(draw);
}

// Control paddle with mouse
canvas.addEventListener("mousemove", function (e) {
    let rect = canvas.getBoundingClientRect();
    paddleY = e.clientY - rect.top - paddleHeight / 2;
});

draw();
function saveScore(score) {
    fetch('/Game/SaveScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: score })
    });
}

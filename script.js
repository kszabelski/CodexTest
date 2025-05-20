const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const restartBtn = document.getElementById('restart');
const themeBtn = document.getElementById('theme');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake, velocity, food, running, loopId, score;
const stepTime = 500; // ms between moves

function init() {
    snake = [{x: 10, y: 10}];
    velocity = {x: 0, y: 0};
    food = randomFood();
    score = 0;
    updateScore();
    running = false;
    draw();
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function start() {
    if (running) return;
    running = true;
    loop();
}

function pause() {
    running = !running;
    if (running) {
        loop();
    } else {
        clearTimeout(loopId);
    }
}

function restart() {
    clearTimeout(loopId);
    init();
    start();
}

function updateScore() {
    scoreEl.textContent = score;
}

function loop() {
    if (!running) return;
    update();
    draw();
    loopId = setTimeout(loop, stepTime);
}

function update() {
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};
    if (velocity.x === 0 && velocity.y === 0) return; // not started moving
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        running = false;
        alert('Game over!');
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        food = randomFood();
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    ctx.fillStyle = 'green';
    snake.forEach(seg => {
        ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize, gridSize);
    });
}

function changeDirection(e) {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (velocity.y === 1) break;
            velocity = {x: 0, y: -1};
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (velocity.y === -1) break;
            velocity = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (velocity.x === 1) break;
            velocity = {x: -1, y: 0};
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (velocity.x === -1) break;
            velocity = {x: 1, y: 0};
            break;
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
restartBtn.addEventListener('click', restart);
window.addEventListener('keydown', changeDirection);

themeBtn.addEventListener('click', toggleTheme);

init();

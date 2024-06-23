const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'player-128.png';
const enemyImage = new Image();
enemyImage.src = 'enemy-128.png';

const player = {
    x: canvas.width / 2 - 64,
    y: canvas.height - 140,
    width: 128,
    height: 128,
    speed: 5,
    bullets: []
};

const enemies = [];

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBullets() {
    player.bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed;
        if (bullet.x > canvas.width) {
            player.bullets.splice(index, 1);
        }
        ctx.fillStyle = 'black';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        if (enemy.x < 0) {
            enemies.splice(index, 1);
        }
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function spawnEnemy() {
    const y = Math.random() * (canvas.height - 128);
    enemies.push({ x: canvas.width, y, width: 128, height: 128, speed: 2 });
}

function handleCollisions() {
    player.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                player.bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });
}

function update() {
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < canvas.width - player.width) player.x += player.speed;
    if (keys.Space) {
        player.bullets.push({ x: player.x + player.width - 5, y: player.y + player.height / 2 - 1, width: 10, height: 2, speed: 7 });
        keys.Space = false; // Only shoot one bullet per key press
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawPlayer();
    drawBullets();
    drawEnemies();
    handleCollisions();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    if (e.code in keys) keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
});

setInterval(spawnEnemy, 1000);
gameLoop();

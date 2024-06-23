const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'player-128.png';

const enemyImages = [];
for (let i = 1; i <= 7; i++) {
    const img = new Image();
    img.src = `enemy-${i}.png`;
    enemyImages.push(img);
}

const needleImage = new Image();
needleImage.src = 'needle.png';

const player = {
    x: 50,
    y: canvas.height / 2 - 64,
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

let enemyAnimationFrame = 0;

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

function drawEnemyBullets() {
    enemies.forEach(enemy => {
        enemy.bullets.forEach((bullet, index) => {
            bullet.x -= bullet.speed;
            if (bullet.x < 0) {
                enemy.bullets.splice(index, 1);
            }
            ctx.drawImage(needleImage, bullet.x, bullet.y, bullet.width, bullet.height);
        });
    });
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        if (enemy.x < -enemy.width) {
            enemies.splice(index, 1);
        }
        const currentImage = enemyImages[Math.floor(enemyAnimationFrame) % enemyImages.length];
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(currentImage, -enemy.x - enemy.width, enemy.y, enemy.width, enemy.height);
        ctx.restore();

        if (enemy.shootCooldown <= 0) {
            enemy.bullets.push({
                x: enemy.x,
                y: enemy.y + enemy.height / 2 - 5,
                width: 10,
                height: 2,
                speed: 5
            });
            enemy.shootCooldown = 14;
        } else {
            enemy.shootCooldown--;
        }
    });
}

function spawnEnemy() {
    const y = Math.random() * (canvas.height - 128);
    enemies.push({ x: canvas.width, y, width: 128, height: 128, speed: 1, bullets: [], shootCooldown: 14 });
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

    enemies.forEach(enemy => {
        enemy.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.x < player.x + player.width &&
                bullet.x + bullet.width > player.x &&
                bullet.y < player.y + player.height &&
                bullet.y + bullet.height > player.y) {
                enemy.bullets.splice(bulletIndex, 1);
                // Handle player hit (e.g., reduce health or end game)
            }
        });
    });
}

function update() {
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y < canvas.height - player.height) player.y += player.speed;
    if (keys.Space) {
        player.bullets.push({ x: player.x + player.width - 5, y: player.y + player.height / 2 - 1, width: 10, height: 2, speed: 7 });
        keys.Space = false; // Only shoot one bullet per key press
    }
    enemyAnimationFrame += 0.1; // Adjust the speed of animation as needed
}

function gameLoop() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    update();
    drawPlayer();
    drawBullets();
    drawEnemyBullets();
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

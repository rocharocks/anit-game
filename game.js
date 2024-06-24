const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const aspectRatio = 2 / 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width / height > aspectRatio) {
        canvas.height = height;
        canvas.width = height * aspectRatio;
    } else {
        canvas.width = width;
        canvas.height = width / aspectRatio;
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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
    bullets: [],
    health: 10,
    isDead: false,
    fadeValue: 1,
    rotation: 0
};

const enemies = [];
const splatters = [];

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

let allImagesLoaded = false;
let startTime = null;

const initialEnemySpeed = 0.67 * 1.25;
const initialNeedleSpeed = 1.25 * 1.25;
const maxMultiplier = 2;
const duration = 120000; // 2 minutes in milliseconds

function getSpeedMultiplier() {
    const elapsed = Date.now() - startTime;
    const ratio = Math.min(elapsed / duration, 1);
    return 1 + ratio * (maxMultiplier - 1);
}

function createSplatter(x, y, color) {
    const splatter = [];
    for (let i = 0; i < 20; i++) {
        splatter.push({
            x,
            y,
            dx: (Math.random() - 0.5) * 6,
            dy: (Math.random() - 0.5) * 6,
            size: Math.random() * 3 + 1,
            color
        });
    }
    return splatter;
}

function drawSplatter() {
    splatters.forEach((splatter, splatterIndex) => {
        splatter.forEach((dot, dotIndex) => {
            dot.x += dot.dx;
            dot.y += dot.dy;
            dot.size *= 0.95;
            if (dot.size < 0.1) {
                splatter.splice(dotIndex, 1);
            } else {
                ctx.fillStyle = dot.color;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        if (splatter.length === 0) {
            splatters.splice(splatterIndex, 1);
        }
    });
}

function drawPlayer() {
    if (player.isDead) {
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.rotate(player.rotation * Math.PI / 180);
        ctx.globalAlpha = player.fadeValue;
        ctx.drawImage(playerImage, -player.width / 2, -player.height / 2, player.width, player.height);
        ctx.restore();
    } else {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }
}

function drawHealthBar() {
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthBarX = 20;
    const healthBarY = 20;
    const currentHealthWidth = healthBarWidth * (player.health / 10);

    ctx.fillStyle = player.health > 3 ? 'green' : 'red';
    ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
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
    const speedMultiplier = getSpeedMultiplier();

    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed * speedMultiplier;
        if (enemy.x < -enemy.width) {
            enemies.splice(index, 1);
        }
        const currentImage = enemyImages[Math.floor(enemy.animationFrame) % enemyImages.length];
        ctx.drawImage(currentImage, enemy.x, enemy.y, enemy.width, enemy.height);

        if (enemy.shootCooldown <= 0) {
            enemy.bullets.push({
                x: enemy.x,
                y: enemy.y + enemy.height / 2 - 15,
                width: 60, // 2x bigger width
                height: 12, // 2x bigger height
                speed: initialNeedleSpeed * speedMultiplier // Gradually increasing speed
            });
            enemy.shootCooldown = 240; // 4 seconds at 60 FPS (half as frequent)
        } else {
            enemy.shootCooldown--;
        }

        enemy.animationFrame += enemy.animationSpeed;
    });
}

function drawEnemyBullets() {
    const speedMultiplier = getSpeedMultiplier();

    enemies.forEach(enemy => {
        enemy.bullets.forEach((bullet, index) => {
            bullet.x -= bullet.speed * speedMultiplier;
            if (bullet.x < 0) {
                enemy.bullets.splice(index, 1);
            }
            ctx.drawImage(needleImage, bullet.x, bullet.y, bullet.width, bullet.height);
        });
    });
}

function spawnEnemy() {
    const y = Math.random() * (canvas.height - 128);
    enemies.push({
        x: canvas.width,
        y,
        width: 128,
        height: 128,
        speed: initialEnemySpeed, // Initial speed
        bullets: [],
        shootCooldown: 240,
        animationFrame: 0,
        animationSpeed: 0.05 + Math.random() * 0.1
    });
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
                splatters.push(createSplatter(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 'red'));
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
                player.health--;
                splatters.push(createSplatter(player.x + player.width / 2, player.y + player.height / 2, 'red'));
                if (player.health <= 0 && !player.isDead) {
                    player.isDead = true;
                }
            }
        });
    });
}

function update() {
    if (player.isDead) {
        player.rotation += 10; // Spin
        player.width *= 0.98; // Shrink
        player.height *= 0.98; // Shrink
        player.fadeValue -= 0.02; // Fade
        if (player.fadeValue <= 0) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'red';
            ctx.font = '24px sans-serif'; // Reduced font size
            ctx.textAlign = 'center';
            ctx.fillText('ANOTHER INNOCENT KILLED BY', canvas.width / 2, canvas.height / 2 - 20);
            ctx.fillText('DR. FAUCI', canvas.width / 2, canvas.height / 2 + 20);
        }
    } else {
        if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
        if (keys.ArrowDown && player.y < canvas.height - player.height) player.y += player.speed;
        if (keys.Space) {
            player.bullets.push({ x: player.x + player.width - 5, y: player.y + player.height / 2 - 1, width: 10, height: 2, speed: 7 });
            keys.Space = false; // Only shoot one bullet per key press
        }
    }
}

function gameLoop() {
    if (!allImagesLoaded) return; // Wait until all images are loaded
    if (!startTime) startTime = Date.now();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    update();
    drawPlayer();
    if (!player.isDead || player.fadeValue > 0) {
        drawBullets();
        drawEnemies();
        drawEnemyBullets();
        drawHealthBar();
        drawSplatter();
    }
    handleCollisions();
    requestAnimationFrame(gameLoop);
}

function loadImages(images, callback) {
    let loadedImages = 0;
    images.forEach(image => {
        image.onload = () => {
            loadedImages++;
            if (loadedImages === images.length) {
                callback();
            }
        };
        image.onerror = () => {
            console.error(`Error loading image: ${image.src}`);
        };
    });
}

window.addEventListener('keydown', (e) => {
    if (e.code in keys) keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
});

// Handle touch events for mobile
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent screen from moving
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;

    if (deltaY < 0 && player.y > 0) {
        player.y -= player.speed;
    } else if (deltaY > 0 && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    touchStartY = touchY;
});

canvas.addEventListener('touchend', () => {
    keys.Space = true; // Shoot when touch ends
});

loadImages([...enemyImages, playerImage, needleImage], () => {
    allImagesLoaded = true;
    setInterval(spawnEnemy, 2000); // half as frequent spawn
    gameLoop();
});

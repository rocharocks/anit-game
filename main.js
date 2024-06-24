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

const antivaxerImage = new Image();
antivaxerImage.src = 'antivaxer.jpg';

const player = {
    x: 50,
    y: canvas.height / 2 - 64,
    width: 128,
    height: 128,
    speed: 5,
    bullets: [],
    health: 10,
    lives: 3,
    isDead: false,
    fadeValue: 1,
    rotation: 0
};

let score = 0;

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
let showAntivaxer = true;
let antivaxerAlpha = 1;
let currentAudio = null;
let audioPlaying = false;
let scoreInterval = null;

const initialEnemySpeed = 0.67 * 1.25;
const initialNeedleSpeed = 1.25 * 1.25;
const maxMultiplier = 2;
const duration = 120000; // 2 minutes in milliseconds

const audioFiles = [
    'fauci1.m4a',
    'fauci2.m4a',
    'fauci3.m4a',
    'fauci4.m4a',
    'fauci5.m4a',
    'fauci6.m4a',
    'fauci7.m4a',
    'fauci8.m4a',
    'fauci9.m4a'
];

const audioButton = document.getElementById('audioButton');

function getSpeedMultiplier() {
    const elapsed = Date.now() - startTime;
    const ratio = Math.min(elapsed / duration, 1);
    return 1 + ratio * (maxMultiplier - 1);
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

audioButton.addEventListener('click', toggleAudio);

startGame();

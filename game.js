const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let menuActive = true;
let menuOptions = ["Start Spill", "Oppdater Side"];
let selectedOption = 0;
let prevGamepadButtons = [];

// Grunnleggende konfig
const tileSize = 40;
const gravity = 0.5;
const jumpForce = -10;

// SOUNDS
const attackSound = new Audio("sounds/effects/playerSwing.wav");
const hitSound = new Audio("sounds/effects/enemyHit.wav");

const solidTiles = ["G1", "S1", "TR"];

const tileImages = {
  "G1": "images/assets/grass.png",     // Grass
  "S1": "images/assets/stone.png",     // Stone
  "TR": "images/assets/transparent.png",// usynlig
  "  ": null                    // Empty / Air
};

const tileSprites = {};

// Last inn alle bilder
for (let key in tileImages) {
  if (tileImages[key]) {
    const img = new Image();
    img.src = tileImages[key];
    tileSprites[key] = img;
  }
}


const levels = [
    {
        background: "images/background/darkForest.png",
        data: [
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["TR","  ","  ","G1","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","G1","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ]
    },
    {
        background: "images/background/darkForest.png",
        data: [
        ["  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
        ["G1","G1","G1","G1","G1","G1","G1","  ","  ","  ","  ","  ","  ","  ","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","G1","  ","  ","  ","  ","  ","  ","  ","G1","G1","G1","G1","G1","G1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","  ","  ","  ","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","  ","  ","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ["S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1","S1"],
        ]
    },
];

let currentLevelIndex = 0;
let level = levels[currentLevelIndex].data;

const backgroundImage = new Image();
backgroundImage.src = levels[currentLevelIndex].background;

//------------------------------Spiller------------------------------
const player = {
    x: 100,
    y: 100,
    width: 60,
    height: 70,
    xSpeed: 0,
    ySpeed: 0,
    grounded: false,
    direction: "right", // 'left' eller 'right'
    state: "idle",      // 'idle', 'run', 'jump'
    frameIndex: 0,
    frameTimer: 0,
    attacking: false,
    attackTimer: 0,
    attackPower: 1,
    hitEnemies: [],
    health: 100,       // 0–100
    maxHealth: 100,
    stamina: 100,      // 0–100
    maxStamina: 100,
    staminaRegenRate: 0.2, // per frame
};

function drawPlayerBars() {
  const barWidth = 200;
  const barHeight = 15;
  const x = 20;
  let y = 20;

  // 🔴 HELSE
  const healthPercent = player.health / player.maxHealth;
  ctx.fillStyle = "#444"; // Bakgrunn
  ctx.fillRect(x, y, barWidth, barHeight);
  
  ctx.fillStyle = "#f00"; // Alltid rød
  ctx.fillRect(x, y, barWidth * healthPercent, barHeight);

  // 🟢 STAMINA
  y += 25;
  const staminaPercent = Math.max(0, player.stamina / player.maxStamina); // 👈 hindrer negativ bredde
  
  ctx.fillStyle = "#444";
  ctx.fillRect(x, y, barWidth, barHeight);
  
  ctx.fillStyle = "#0f0";
  ctx.fillRect(x, y, barWidth * staminaPercent, barHeight); // 👈 alltid positiv lengde
  
  ctx.strokeStyle = "#000";
  ctx.strokeRect(x, y, barWidth, barHeight);
}

const playerSprites = {
  idle: [loadImage("images/player/idle1.png"), loadImage("images/player/idle2.png")],
  run: [loadImage("images/player/run1.png"), loadImage("images/player/run2.png"), loadImage("images/player/run3.png")],
  jump: [loadImage("images/player/jump.png")],
  attack: [loadImage("images/player/attack1.png"), loadImage("images/player/attack2.png")]
};

//------------------------------Spiller SLUTT------------------------------


//---------------------------------ENEMIES------------------------------

const enemySprite = loadImage("images/enemy/jump.png"); // legg bildet i denne banen

const enemies = [
  createEnemy(400, 400),
  createEnemy(500, 400),

];

function createEnemy(x, y) {
  return {
    x,
    y,
    width: 50,
    height: 60,
    xSpeed: 1.2,
    direction: "left",
    health: 10,
    maxHealth: 10,
    grounded: false,
    alive: true
  };
}

function drawEnemies() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    const drawX = enemy.x - camera.x;
    const drawY = enemy.y - camera.y;

    // Tegn helsebar over fiende
    const healthPercent = enemy.health / enemy.maxHealth;
    ctx.fillStyle = "#f00";
    ctx.fillRect(drawX, drawY - 10, enemy.width * healthPercent, 5);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(drawX, drawY - 10, enemy.width, 5);

    // Tegn sprite
    ctx.drawImage(enemySprite, drawX, drawY, enemy.width, enemy.height);
  }
}

function updateEnemies() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    // Tyngdekraft
    enemy.ySpeed = (enemy.ySpeed || 0) + gravity;
    enemy.y += enemy.ySpeed;

    // Bevegelse
    enemy.x += enemy.direction === "left" ? -enemy.xSpeed : enemy.xSpeed;

    // Enkel "vegg"-kollisjon med tiles
    const frontX = enemy.direction === "right" ? enemy.x + enemy.width : enemy.x - 1;
    const tileFront = isSolid(frontX, enemy.y + enemy.height - 1);

    if (tileFront) {
      enemy.direction = enemy.direction === "right" ? "left" : "right";
    }

    // Fallkollisjon
    if (checkCollision(enemy)) {
      enemy.y = Math.floor((enemy.y + enemy.height) / tileSize) * tileSize - enemy.height - 0.01;
      enemy.ySpeed = 0;
      enemy.grounded = true;
    } else {
      enemy.grounded = false;
    }
  }
}


//---------------------------------ENEMIES SLUTT------------------------------

  
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

// Input
const keys = {
  left: false,
  right: false,
  up: false
};

const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

document.addEventListener("keydown", (e) => {
  if (menuActive) {
    if (e.repeat) return;

    if (e.code === "ArrowUp") {
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
    }
    if (e.code === "ArrowDown") {
      selectedOption = (selectedOption + 1) % menuOptions.length;
    }
    if (e.code === "Enter" || e.code === "KeyX") {
      activateMenuOption(selectedOption);
    }

    return; // Ikke gå videre til spillkontroll
  }

  // Spillkontroller (uten repeat)
  if (e.code === "ArrowLeft") keys.left = true;
  if (e.code === "ArrowRight") keys.right = true;
  if ((e.code === "Space" || e.code === "ArrowUp") && player.grounded) {
    player.ySpeed = jumpForce;
    player.grounded = false;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') keys.left = false;
  if (e.code === 'ArrowRight') keys.right = false;
});

// Kollisjonssjekk
function isSolid(x, y) {
    const tileX = Math.floor(x / tileSize);
    const tileY = Math.floor(y / tileSize);
    const code = level[tileY]?.[tileX];
    return solidTiles.includes(code);
}

function isColliding(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
}

function checkCollision(player) {
  // Undersøk hvilke hjørner som overlapper med solide blokker
  const x1 = Math.floor(player.x / tileSize);
  const y1 = Math.floor(player.y / tileSize);
  const x2 = Math.floor((player.x + player.width) / tileSize);
  const y2 = Math.floor((player.y + player.height) / tileSize);

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      const tile = level[y]?.[x];
      if (solidTiles.includes(tile)) {
        return true;
      }
    }
  }
  return false;
}


function updatePlayer() {
  // HORISONTAL bevegelse
  player.xSpeed = 0;
  const prevState = player.state;

  if (player.state !== prevState) {
    player.frameIndex = 0;
    player.frameTimer = 0;
  }

  if (keys.left) player.xSpeed = -3;
  if (keys.right) player.xSpeed = 3;

  player.x += player.xSpeed;

  if (checkCollision(player)) {
      // Gå mot høyre
      if (player.xSpeed > 0) {
      player.x = Math.floor((player.x + player.width) / tileSize) * tileSize - player.width - 0.01;
      }
      // Gå mot venstre
      else if (player.xSpeed < 0) {
      player.x = Math.floor(player.x / tileSize + 1) * tileSize + 0.01;
      }
      player.xSpeed = 0;
  }

  // VERTIKAL bevegelse
  player.ySpeed += gravity;
  player.y += player.ySpeed;

  if (checkCollision(player)) {
      if (player.ySpeed > 0) {
      // Treffer bakken
      player.y = Math.floor((player.y + player.height) / tileSize) * tileSize - player.height - 0.01;
      player.grounded = true;
      } else if (player.ySpeed < 0) {
      // Treffer taket
      player.y = Math.floor(player.y / tileSize + 1) * tileSize + 0.01;
      }
      player.ySpeed = 0;
  } else {
      player.grounded = false;
  }

  // Oppdater retning
  if (player.xSpeed > 0) player.direction = "right";
  else if (player.xSpeed < 0) player.direction = "left";
  if (player.attacking) {
    player.state = "attack";
  } else if (!player.grounded) {
    player.state = "jump";
  } else if (player.xSpeed !== 0) {
    player.state = "run";
  } else {
    player.state = "idle";
  }

  // Animasjonstimer
  player.frameTimer++;
  if (player.frameTimer > 10) {
      player.frameTimer = 0;
      player.frameIndex++;
      const frames = playerSprites[player.state];
      if (player.frameIndex >= frames.length) {
      player.frameIndex = 0;
      }
  }

  // Nivåbredde i piksler
  const levelWidth = level[0].length * tileSize;

  // Gå til neste nivå om du går ut til høyre
  if (player.x > levelWidth) {
  if (currentLevelIndex < levels.length - 1) {
      player.x = 0; // starter fra venstre side
      loadLevel(currentLevelIndex + 1);
  } else {
      player.x = levelWidth - player.width; // hold spilleren inne hvis siste nivå
  }
  }

  // Gå til forrige nivå om du går ut til venstre
  if (player.x + player.width < 0) {
      if (currentLevelIndex > 0) {
          player.x = level[0].length * tileSize - player.width; // starter fra høyre side
          loadLevel(currentLevelIndex - 1);
      } else {
          player.x = 0; // ikke tillat å gå utenfor første nivå
      }
  }

  if (player.attacking) {
    const hitbox = {
      x: player.direction === "right" ? player.x + player.width : player.x - 30,
      y: player.y + 10,
      width: 30,
      height: player.height - 20
    };
  
    for (const enemy of enemies) {
      if (
        enemy.alive &&
        isColliding(hitbox, enemy) &&
        !player.hitEnemies.includes(enemy)
      ) {
        enemy.health -= player.attackPower;
        player.hitEnemies.push(enemy); // registrer at denne er truffet

        hitSound.currentTime = 0; // Hit Sound
        hitSound.play();
  
        if (enemy.health <= 0) {
          enemy.alive = false;
        }
      }
    }
  }
  

  // Regenerer stamina gradvis
  player.stamina += player.staminaRegenRate;
  if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;

  if (player.attacking) {
    player.attackTimer--;
    if (player.attackTimer <= 0) {
      player.attacking = false;
    }
  }

}

//----------------------MENY-----------------------------

let menuInputCooldown = 0;
  
function drawMenu() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "28px sans-serif";
  ctx.textAlign = "center";

  ctx.fillText("BLAZESPIRE", canvas.width / 2, 120);

  menuOptions.forEach((text, i) => {
    if (i === selectedOption) {
      ctx.fillStyle = "#0f0";
    } else {
      ctx.fillStyle = "#fff";
    }
    ctx.fillText(text, canvas.width / 2, 200 + i * 50);
  });

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#ccc";
  ctx.fillText("Controller only", canvas.width / 2, canvas.height - 50);

}

function activateMenuOption(index) {
  const choice = menuOptions[index];
  if (choice === "Start Spill") {
    menuActive = false;
  } else if (choice === "Oppdater Side") {
    location.reload();
  }
}



//----------------------MENY SLUTT-----------------------------


function drawLevel() {
const startCol = Math.floor(camera.x / tileSize);
const endCol = Math.ceil((camera.x + camera.width) / tileSize);
const startRow = Math.floor(camera.y / tileSize);
const endRow = Math.ceil((camera.y + camera.height) / tileSize);

    for (let y = startRow; y < endRow; y++) {
        for (let x = startCol; x < endCol; x++) {
        const code = level[y]?.[x];
        const sprite = tileSprites[code];
            if (sprite) {
                ctx.drawImage(
                sprite,
                x * tileSize - camera.x,
                y * tileSize - camera.y,
                tileSize,
                tileSize
                );
            }
        }
    }
}

function drawPlayer() {
    const frames = playerSprites[player.state];
    if (!frames) return;
  
    const sprite = frames[player.frameIndex % frames.length];
    if (!sprite || !sprite.complete) return; // Bildet ikke lastet
  
    const drawX = player.x - camera.x;
    const drawY = player.y - camera.y;
  
    if (player.direction === "left") {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, -drawX - player.width, drawY, player.width, player.height);
      ctx.restore();
    } else {
      ctx.drawImage(sprite, drawX, drawY, player.width, player.height);
    }
  }

let gamepadIndex = null;

window.addEventListener("gamepadconnected", (e) => {
  console.log("Gamepad connected:", e.gamepad);
  gamepadIndex = e.gamepad.index;
});

window.addEventListener("gamepaddisconnected", (e) => {
  console.log("Gamepad disconnected");
  gamepadIndex = null;
});

function handleGamepadInput() {
  if (gamepadIndex === null) return;

  const gamepad = navigator.getGamepads()[gamepadIndex];
  if (!gamepad) return;

  const buttons = gamepad.buttons.map(b => b.pressed);

  const threshold = 0.2;
  const horizontal = gamepad.axes[0]; // Venstre analog
  const jumpPressed = buttons[0] && !prevGamepadButtons[0]; // Cross (X)

  keys.left = horizontal < -threshold;
  keys.right = horizontal > threshold;

  if (jumpPressed && player.grounded) {
    player.ySpeed = jumpForce;
    player.grounded = false;
  }
  const attackPressed = buttons[2] && !prevGamepadButtons[2];
  if (attackPressed && !player.attacking && player.stamina >= 10) {
    player.attacking = true;
    attackSound.currentTime = 0; // start fra begynnelsen
    attackSound.play();
    player.attackTimer = 10;
    player.stamina -= 10;
    player.hitEnemies = [];
  
    // Tillat at alle fiender kan bli truffet igjen
    for (const enemy of enemies) {
      enemy.recentlyHit = false;
    }
  }

  // Start/Options-knapp åpner/lukker menyen
  const startPressed = buttons[9] && !prevGamepadButtons[9];

  if (startPressed) {
    menuActive = !menuActive; // Veksler menyen av/på
    if (menuActive) selectedOption = 0;
  }

  // Naviger meny
  if (menuActive) {
    const up = buttons[12] && !prevGamepadButtons[12];
    const down = buttons[13] && !prevGamepadButtons[13];
    const select = buttons[0] && !prevGamepadButtons[0];
    if (select) activateMenuOption(selectedOption);
    if (up) selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
    if (down) selectedOption = (selectedOption + 1) % menuOptions.length;
    
  }

  prevGamepadButtons = buttons;

}

function loadLevel(index) {
    currentLevelIndex = index;
    level = levels[index].data;
    backgroundImage.src = levels[index].background;
  
    player.y = 100;
    player.ySpeed = 0;
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}  

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleGamepadInput();

  if (menuActive) {
    drawMenu();
  } else {
    // Vanlig spill
    camera.x = player.x + player.width / 2 - camera.width / 2;
    camera.y = player.y + player.height / 2 - camera.height / 2;

    camera.x = Math.max(0, Math.min(camera.x, level[0].length * tileSize - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, level.length * tileSize - camera.height));

    updatePlayer();
    drawBackground();
    drawLevel();
    updateEnemies();
    drawEnemies();
    drawPlayer();
    drawPlayerBars();
  }

  requestAnimationFrame(gameLoop);
}



gameLoop();

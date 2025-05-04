const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Grunnleggende konfig
const tileSize = 40;
const gravity = 0.5;
const jumpForce = -10;

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
        ["TR","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
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

// Spiller
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
    attackTimer: 0
};

const enemies = [
    {
      x: 400,
      y: 400,
      width: 40,
      height: 60,
      health: 3,
      alive: true
    }
];

function drawEnemies() {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      ctx.fillStyle = 'red';
      ctx.fillRect(
        enemy.x - camera.x,
        enemy.y - camera.y,
        enemy.width,
        enemy.height
      );
    }
}

const playerSprites = {
    idle: [loadImage("images/player/idle1.png"), loadImage("images/player/idle2.png")],
    run: [loadImage("images/player/run1.png"), loadImage("images/player/run2.png"), loadImage("images/player/run3.png")],
    jump: [loadImage("images/player/jump.png")],
    attack: [loadImage("images/player/attack1.png"), loadImage("images/player/attack2.png")]
};
  
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

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    if (player.grounded) {
      player.ySpeed = jumpForce;
      player.grounded = false;
    }
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

    // Oppdater spillerens tilstand
    if (player.attacking) {
        player.attackTimer--;
        if (player.attackTimer <= 0) {
          player.attacking = false;
        }
        player.state = "attack";
      } else {
        if (!player.grounded) {
          player.state = "jump";
        } else if (player.xSpeed !== 0) {
          player.state = "run";
        } else {
          player.state = "idle";
        }
    }

    // Oppdater retning
    if (player.xSpeed > 0) player.direction = "right";
    else if (player.xSpeed < 0) player.direction = "left";

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
          if (enemy.alive && isColliding(hitbox, enemy)) {
            enemy.health--;
            if (enemy.health <= 0) {
              enemy.alive = false;
            }
          }
        }
      }

}
  
  

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

  const threshold = 0.2;
  const horizontal = gamepad.axes[0]; // Venstre analog
  const jumpPressed = gamepad.buttons[0].pressed; // Cross (X)

  keys.left = horizontal < -threshold;
  keys.right = horizontal > threshold;

  if (jumpPressed && player.grounded) {
    player.ySpeed = jumpForce;
    player.grounded = false;
  }
  const attackPressed = gamepad.buttons[2].pressed; // Firkant-knappen

  if (attackPressed && !player.attacking) {
  player.attacking = true;
  player.attackTimer = 15; // hvor lenge angrepet varer (i frames)
}
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
    // Følg spilleren
    camera.x = player.x + player.width / 2 - camera.width / 2;
    camera.y = player.y + player.height / 2 - camera.height / 2;

    // Begrens kameraet innenfor nivået
    camera.x = Math.max(0, Math.min(camera.x, level[0].length * tileSize - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, level.length * tileSize - camera.height));

    // Tøm skjermen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handleGamepadInput();   // For at kontroller skal virke
    updatePlayer();         // For at spilleren skal bevege seg og falle
    drawBackground();
    drawLevel();
    drawEnemies();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}


gameLoop();

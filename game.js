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

let selectedInventoryIndex = 0;
let itemInfoActive = false;

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
};

//------------------------------Spiller SLUTT------------------------------

//------------------------------Items/inventory------------------------------

let inventoryActive = false;

const playerInventory = [
  "fishDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
  "landDefault",
];

const items = {
  fishDefault: {
    name: "fish",
    type: "fish",
    rarity: "common",
    icon: loadImage("images/items/defaultFish.png")
  },
  landDefault: {
    name: "animal",
    type: "animal",
    rarity: "uncommon",
    icon: loadImage("images/items/defaultTree.png")
  },
};

function drawInventory() {
  const gridCols = 6;
  const cellSize = 80;
  const spacing = 24;

  const padding = 40;
  const panelWidth = canvas.width;
  const panelHeight = canvas.height;

  const startX = padding;
  const startY = padding + 50;

  const itemsPerRow = gridCols;
  const rows = Math.ceil(playerInventory.length / itemsPerRow);

  // Bakgrunn
  ctx.fillStyle = "rgba(0,0,0,0.95)";
  ctx.fillRect(0, 0, panelWidth, panelHeight);

  // Tittel
  ctx.fillStyle = "#fff";
  ctx.font = "32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Inventory", panelWidth / 2, 50);

  // Grid
  ctx.textAlign = "left";
  for (let i = 0; i < playerInventory.length; i++) {
    const itemId = playerInventory[i];
    const item = items[itemId];
    if (!item) continue;

    const col = i % itemsPerRow;
    const row = Math.floor(i / itemsPerRow);

    const x = startX + col * (cellSize + spacing);
    const y = startY + row * (cellSize + spacing);

    // Rarity-farge
    const rarityColor = {
      common: "#aaa",
      uncommon: "#2ecc71",
      rare: "#3498db",
      legendary: "#e67e22"
    }[item.rarity] || "#fff";

    // Ramme og boks
    ctx.fillStyle = rarityColor;
    ctx.fillRect(x - 2, y - 2, cellSize + 4, cellSize + 4);

    ctx.fillStyle = "#222";
    ctx.fillRect(x, y, cellSize, cellSize);

      // Highlight item hvis valgt
    if (i === selectedInventoryIndex) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 4, y - 4, cellSize + 8, cellSize + 8);
    }

    // Icon
    if (item.icon && item.icon.complete) {
      ctx.drawImage(item.icon, x + 8, y + 8, cellSize - 16, cellSize - 16);
    }

    // Navn
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#fff";
  }

  ctx.textAlign = "left"; // reset text align
}

function drawItemInfo() {
  const itemId = playerInventory[selectedInventoryIndex];
  const item = items[itemId];
  if (!item) return;

  const panelWidth = 300;
  const panelHeight = 180;
  const x = canvas.width / 2 - panelWidth / 2;
  const y = canvas.height / 2 - panelHeight / 2;

  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  ctx.fillRect(x, y, panelWidth, panelHeight);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, panelWidth, panelHeight);

  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText(item.name, x + 20, y + 40);

  ctx.font = "16px sans-serif";
  ctx.fillText("Type: " + item.type, x + 20, y + 80);
  ctx.fillText("Rarity: " + item.rarity, x + 20, y + 110);

  if (item.icon && item.icon.complete) {
    ctx.drawImage(item.icon, x + panelWidth - 80, y + 20, 48, 48);
  }

  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#ccc";
  ctx.fillText("Press O to go back", x + 20, y + panelHeight - 20);
}



//------------------------------Items/inventory SLUTT------------------------------

  
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

  if (inventoryActive) {
    if (e.repeat) return;
  
    const cols = 6;
    const total = playerInventory.length;
  
    if (e.code === "ArrowRight") selectedInventoryIndex = (selectedInventoryIndex + 1) % total;
    if (e.code === "ArrowLeft") selectedInventoryIndex = (selectedInventoryIndex - 1 + total) % total;
    if (e.code === "ArrowDown") selectedInventoryIndex = (selectedInventoryIndex + cols) % total;
    if (e.code === "ArrowUp") selectedInventoryIndex = (selectedInventoryIndex - cols + total) % total;
  
    return;
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
  if (!player.grounded) {
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
  
  // Regenerer stamina gradvis
  player.stamina += player.staminaRegenRate;
  if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;

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

  // 📦 Inventory-lås (åpne/lukk med trekant)
  if (inventoryActive) {
    const trianglePressed = buttons[3] && !prevGamepadButtons[3];
    if (trianglePressed) inventoryActive = false;

    const up = buttons[12] && !prevGamepadButtons[12];
    const down = buttons[13] && !prevGamepadButtons[13];
    const left = buttons[14] && !prevGamepadButtons[14];
    const right = buttons[15] && !prevGamepadButtons[15];
    const select = buttons[0] && !prevGamepadButtons[0]; // X
    const back = buttons[1] && !prevGamepadButtons[1];   // O
  
    const cols = 6;
    const total = playerInventory.length;
  
    if (!itemInfoActive) {
      if (right) selectedInventoryIndex = (selectedInventoryIndex + 1) % total;
      if (left) selectedInventoryIndex = (selectedInventoryIndex - 1 + total) % total;
      if (down) selectedInventoryIndex = (selectedInventoryIndex + cols) % total;
      if (up) selectedInventoryIndex = (selectedInventoryIndex - cols + total) % total;
      if (select) itemInfoActive = true; // Åpne info
    } else {
      if (back) itemInfoActive = false; // Lukk info
    }

    prevGamepadButtons = buttons;
    return; // 🚫 Blokker all annen input
  }

  const threshold = 0.2;
  const horizontal = gamepad.axes[0]; // Venstre analog
  const jumpPressed = buttons[0] && !prevGamepadButtons[0]; // Cross (X)

  keys.left = horizontal < -threshold;
  keys.right = horizontal > threshold;

  if (jumpPressed && player.grounded) {
    player.ySpeed = jumpForce;
    player.grounded = false;
  }

  // Inventory åpen/lukk
  const inventoryPressed = buttons[3] && !prevGamepadButtons[3];
  if (inventoryPressed) {
    inventoryActive = true;
    selectedInventoryIndex = 0;
  }

  // Meny
  const startPressed = buttons[9] && !prevGamepadButtons[9];
  if (startPressed) {
    menuActive = !menuActive;
    if (menuActive) selectedOption = 0;
  }

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

  if (inventoryActive) {
    drawInventory();
    if (itemInfoActive) {
      drawItemInfo();
    }
    requestAnimationFrame(gameLoop);
    return;
  }

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
    drawPlayer();
    drawPlayerBars();
  }

  requestAnimationFrame(gameLoop);
}



gameLoop();

let scene = 1; 
let score = 0; 
let rocketY = 400;
let rocketSpeed = 8;

let bullets = [];
let monsters = [];
let stars = [];
let planets = [];
let explosions = [];

let rocketImg, starImg, monsterImg, explosionImg;
let planetImgs = [];
let startBG, winBG, lostBG, startBtn, restartBtn;

let spaceFontBold, spaceFontReg;

function preload() {
  spaceFontBold = loadFont('SpaceMono-Bold.ttf');
  spaceFontReg = loadFont('SpaceMono-Regular.ttf');

  rocketImg = loadImage('roket.png'); 
  starImg = loadImage('star.png');
  monsterImg = loadImage('monster.png');
  explosionImg = loadImage('boom.png');
  planetImgs[0] = loadImage('1.png');
  planetImgs[1] = loadImage('2.png');
  planetImgs[2] = loadImage('3.png');
  planetImgs[3] = loadImage('4.png');
  
  startBG = loadImage('start.png'); 
  winBG = loadImage('won.png');        
  lostBG = loadImage('lost.png');     
  startBtn = loadImage('start_button.png'); 
  restartBtn = loadImage('restart.png');
}

function setup() {
  createCanvas(800, 800);
  imageMode(CENTER);
}

function draw() {
  background(25);

  if (scene == 1) {
    drawStart();
  } else if (scene == 2) {
    drawGame();
  } else if (scene == 3) {
    drawEnd(winBG);
  } else if (scene == 4) {
    drawEnd(lostBG);
  }
}

function drawStart() {
  image(startBG, 400, 400, 800, 800);
  image(startBtn, 400, 700); 
}

function drawGame() {
  // Planets (Infinite space effect)
  if (frameCount % 100 == 0) {
    let size = random(350, 500); // Massive planets
    planets.push(new GameObject(950, random(height), 1.5, random(planetImgs), size));
  }
  for (let i = planets.length - 1; i >= 0; i--) {
    planets[i].update(); 
    planets[i].display();
    if (planets[i].x < -400) planets.splice(i, 1);
  }

  // --- ROCKET (Size: 190x130) ---
  if (keyIsDown(UP_ARROW)) rocketY -= rocketSpeed;
  if (keyIsDown(DOWN_ARROW)) rocketY += rocketSpeed;
  rocketY = constrain(rocketY, 100, 700);
  image(rocketImg, 150, rocketY, 190, 130);

  // --- STARS AND MONSTERS ---
  if (frameCount % 85 == 0) stars.push(new GameObject(850, random(100, 700), 4, starImg, 100));
  if (frameCount % 110 == 0) monsters.push(new GameObject(850, random(100, 700), 5 + (score * 0.2), monsterImg, 140));

  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].update(); 
    stars[i].display();
    if (dist(150, rocketY, stars[i].x, stars[i].y) < 90) { 
        score++; 
        stars.splice(i, 1); 
    }
  }
  
  for (let i = monsters.length - 1; i >= 0; i--) {
    monsters[i].update(); 
    monsters[i].display();
    if (dist(150, rocketY, monsters[i].x, monsters[i].y) < 100) scene = 4;
  }

  updateProjectiles();

  // In-Game Score Panel
  fill(0, 200);
  rect(30, 30, 200, 90, 15);
  image(starImg, 75, 75, 60, 60);
  fill(255, 204, 0);
  textFont(spaceFontBold);
  textSize(45);
  textAlign(LEFT, CENTER);
  text("X " + score, 125, 80);

  if (score >= 15) scene = 3;
}

function drawEnd(bgImg) {
  image(bgImg, 400, 400, 800, 800);
  
  // SCORE POSITION 
  fill(255);
  textFont(spaceFontBold);
  textAlign(CENTER);
  textSize(120); 
  text(score, 400, 480); 

  image(restartBtn, 400, 750); 
}

function updateProjectiles() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += 15;
    fill(255, 50, 50); 
    rect(bullets[i].x, bullets[i].y, 40, 12, 5); // Lasers
    
    for (let j = monsters.length - 1; j >= 0; j--) {
      if (dist(bullets[i].x, bullets[i].y, monsters[j].x, monsters[j].y) < 80) {
        explosions.push({x: monsters[j].x, y: monsters[j].y, timer: 20});
        monsters.splice(j, 1); 
        bullets.splice(i, 1); 
        break;
      }
    }
  }
  
  for (let i = explosions.length - 1; i >= 0; i--) {
    image(explosionImg, explosions[i].x, explosions[i].y, 160, 160);
    explosions[i].timer--;
    if (explosions[i].timer <= 0) explosions.splice(i, 1);
  }
}

function keyPressed() {
  if (key === ' ' && scene == 2) {
      bullets.push({x: 240, y: rocketY}); // Projectile exit point
  }
}

function mousePressed() {
  if (scene == 1) {
    if (mouseX > 250 && mouseX < 550 && mouseY > 600 && mouseY < 800) { 
        resetGame(); 
    }
  } else if (scene == 3 || scene == 4) {
    if (mouseX > 250 && mouseX < 550 && mouseY > 650 && mouseY < 850) { 
        resetGame(); 
    }
  }
}

function resetGame() {
  score = 0; 
  rocketY = 400; 
  bullets = []; 
  monsters = [];
  stars = []; 
  planets = []; 
  explosions = []; 
  scene = 2;
}

class GameObject {
  constructor(x, y, speed, img, size) {
    this.x = x; 
    this.y = y; 
    this.speed = speed; 
    this.img = img; 
    this.size = size;
  }
  update() { 
      this.x -= this.speed; 
  }
  display() { 
      image(this.img, this.x, this.y, this.size, this.size); 
  }
}
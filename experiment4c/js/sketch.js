"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {
  birds = [];
  for (let i = 0; i < 10; i++) {
    birds.push(new Bird());
  }
}

let worldSeed;
let birds = [];
function p3_preload() {}


function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};
let rains = {};
let rainTimes = {};

let foliageOffset = 0;

function p3_drawBefore() {
  foliageOffset += 0.01;  // Increase foliage offset over time

  drawBackground();  // Draw the background with noise

  for (let bird of birds) {
    bird.update();  // Update each bird
    let alignment = align(bird, birds);
    bird.speedX += alignment.x;
    bird.speedY += alignment.y;
  }

  // Periodically add new birds
  if (frameCount % 120 === 0) {
    birds.push(new Bird("sparrow"));  // Introduce new bird type
  }
}

function drawBackground() {
  for (let i = 0; i < width; i += 16) {
    for (let j = 0; j < height; j += 16) {
      let noiseValue = noise(i * 0.1, j * 0.1, foliageOffset);
      let greenComponent = Math.floor(map(noiseValue, 0, 1, 50, 200));
      fill(0, greenComponent, 0);  // Green color range based on noise value
      rect(i, j, 16, 16);  // Draw a tile
    }
  }
}

function boostBirdSpeed(bird) {
  // Increase speed drastically
  let newSpeedX = random(5, 10);  // Set a substantial new speed range
  let newSpeedY = random(3, 8);

  bird.speedX = newSpeedX * (random() > 0.5 ? 1 : -1);  // Randomize direction
  bird.speedY = newSpeedY * (random() > 0.5 ? 1 : -1);

  console.log(`Bird ${bird.type} speed drastically increased to ${bird.speedX}, ${bird.speedY}`);
}

function p3_tileClicked(i, j) {
  let key = `${i}-${j}`;
  clicks[key] = (clicks[key] || 0) + 1;
  setTileRain(i, j);  // Set rain on the clicked tile

  // Affect bird behavior near the clicked tile
  let tileCenterX = i * tw;  // Center x-coordinate of the tile
  let tileCenterY = j * th;  // Center y-coordinate of the tile

for (let bird of birds) {
  let d = dist(bird.x, bird.y, tileCenterX, tileCenterY);  // Distance from bird to tile center
  if (d < 200) {  // Increase radius to 200 to affect more birds
    boostBirdSpeed(bird);  // Boost speed of nearby birds
  }
}

  // Optionally continue with other existing behaviors, such as affecting neighboring tiles
  let numNeighbors = Math.floor(Math.random() * 6) + 1;
  let potentialNeighbors = [
    [i + 1, j], [i - 1, j],
    [i, j + 1], [i, j - 1],
    [i - 1, j - 1], [i + 1, j - 1],
    [i - 1, j + 1], [i + 1, j + 1]
  ];

  shuffle(potentialNeighbors);
  let neighbors = potentialNeighbors.slice(0, numNeighbors);

  for (let [ni, nj] of neighbors) {
    setTileRain(ni, nj);  // Rain effect for neighbors
  }
}



function setTileRain(i, j) {
  let key = `${i}-${j}`;
  rains[key] = true;
  rainTimes[key] = millis();  // Set the current time for the rain effect
}


function p3_drawTile(i, j) {
  noStroke();
  let key = `${i}-${j}`;
  let currentTime = millis();
  let tileActive = rains[key] && (currentTime - rainTimes[key] < 2000);  // Check if the rain should still be active

  if (tileActive) {
    fill(102, 204, 255);  // Blue for rain
  } else {
    rains[key] = false;  // Reset rain status
    let noiseValue = noise(i * 0.1, j * 0.1, foliageOffset);
    let greenComponent = Math.floor(map(noiseValue, 0, 1, 50, 150));
    fill(0, greenComponent, 0);  // Green based on noise
  }

  // Draw tile shape
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();
}


function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  for (let bird of birds) {
    bird.draw();
  }
}

class Bird {
  constructor(type = "default") {
    this.type = type;
    this.spawn();
  }

  spawn() {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    
    switch(this.type) {
      case "sparrow":
        this.speedX = random(1, 2);
        this.speedY = random(0.5, 1);
        this.color = color(120, 90, 60);
        break;
      case "blueJay":
        this.speedX = random(0.5, 1.5);
        this.speedY = random(0.25, 1);
        this.color = color(0, 0, 255);
        break;
      default:
        this.speedX = random(0.5, 2) * (random() > 0.5 ? 1 : -1);
        this.speedY = random(0.25, 1);
        this.color = color(random(100, 200), random(100, 200), random(50, 150));
        break;
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > width || this.x < -width || this.y > height) {
      this.spawn();
    }
  }

  draw() {
    fill(this.color);
    noStroke();

    // Body
    ellipse(this.x, this.y, 12, 8);

    // Wings
    let wingOscillation = Math.sin(frameCount * 0.15) * 5;
    let wingX1 = this.x - 4;
    let wingX2 = this.x + 4;
    arc(wingX1, this.y - 2, 12, 8, -PI / 2 + wingOscillation, PI / 2 - wingOscillation);
    arc(wingX2, this.y - 2, 12, 8, -PI / 2 + wingOscillation, PI / 2 - wingOscillation);

    // Head
    ellipse(this.x + 6, this.y, 6, 6);

    // Eyes and beak
    fill(255);
    ellipse(this.x + 7, this.y - 1, 2, 2);
    fill(0);
    ellipse(this.x + 7, this.y - 1, 1, 1);

    fill(255, 165, 0);
    triangle(this.x + 9, this.y - 1, this.x + 11, this.y + 1, this.x + 9, this.y + 1);
  }
}

// Flocking behavior
function align(bird, birds) {
  let perceptionRadius = 50;
  let steering = createVector(0, 0);
  let total = 0;

  for (let other of birds) {
    let d = dist(bird.x, bird.y, other.x, other.y);
    if (other != bird && d < perceptionRadius) {
      steering.add(createVector(other.speedX, other.speedY));
      total++;
    }
  }

  if (total > 0) {
    steering.div(total);
    steering.setMag(1);
    steering.sub(createVector(bird.speedX, bird.speedY));
  }

  return steering;
}

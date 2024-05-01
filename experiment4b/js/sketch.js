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
  fishes = [];
  for (let i = 0; i < 10; i++) {
    fishes.push(new Fish());
  }
}

let worldSeed;
let fishes = [];

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
let shakeStrengths = {};
let colorChanges = {};
let colorChangeTimes = {};

let waterOffset = 0;

function p3_drawBefore() {
  waterOffset += 0.01;

  for (let fish of fishes) {
    fish.update();
  }

  if (frameCount % 60 === 0) {
    fishes.push(new Fish());
  }
}

function p3_tileClicked(i, j) {
  let key = `${i}-${j}`;
  clicks[key] = (clicks[key] || 0) + 1;

  let earthquakeStrength = Math.random() * 50 + 20;

  setTileShakeStrengthAndColorChange(i, j, earthquakeStrength);

  let numNeighbors = Math.floor(Math.random() * 6) + 1;
  let potentialNeighbors = [
    [i + 1, j], [i - 1, j], 
    [i, j + 1], [i, j - 1], 
    [i - 1, j - 1], [i - 1, j + 1], 
    [i + 1, j - 1], [i + 1, j + 1]
  ];

  potentialNeighbors.sort(() => Math.random() - 0.5);
  let neighbors = potentialNeighbors.slice(0, numNeighbors);

  for (let [ni, nj] of neighbors) {
    setTileShakeStrengthAndColorChange(ni, nj, earthquakeStrength / 2);
  }
}

function setTileShakeStrengthAndColorChange(i, j, strength) {
  let key = `${i}-${j}`;
  shakeStrengths[key] = strength;
  colorChanges[key] = true;
  colorChangeTimes[key] = millis();
}

function p3_drawTile(i, j) {
  noStroke();
  let key = `${i}-${j}`;
  
  let currentTime = millis();
  if (colorChanges[key] && currentTime - colorChangeTimes[key] < 1000) {
    fill(139, 69, 19);
  } else {
    colorChanges[key] = false;

    let noiseValue = noise(i * 0.1, j * 0.1, waterOffset);
    let blueComponent = Math.floor(map(noiseValue, 0, 1, 180, 255));
    fill(0, 0, blueComponent);
  }

  let strength = shakeStrengths[key] || 0;
  let shakeX = random(-2 * strength, 2 * strength);
  let shakeY = random(-2 * strength, 2 * strength);

  push();
  translate(shakeX, shakeY);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  pop();

  if (strength > 0) {
    shakeStrengths[key] *= 0.95;
  }
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  endShape (CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  for (let fish of fishes) {
    fish.draw();
  }
}

class Fish {
  constructor() {
    this.spawn();
  }

  spawn() {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.speedX = random(0.5, 2) * (random() > 0.5 ? 1 : -1);
    this.speedY = random(0.25, 1);

    this.color = color(random(100, 200), random(100, 200), random(50, 150));
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

    // Draw body
    ellipse(this.x, this.y, 20, 10);

    // Create a time-based oscillation for the tail fin
    let oscillation = Math.sin(frameCount * 0.1) * 4;  // Adjust 0.1 for faster/slower tail movements

    // Draw tail fin
    let tailWidth = 6;
    let tailHeight = 4 + oscillation;  // Tail height oscillates
    let tailX = this.x - 10;  // Adjusted for body width
    let tailY = this.y;

    triangle(tailX, tailY - tailHeight, tailX - tailWidth, tailY, tailX, tailY + tailHeight);

    // Draw eyes
    fill(255);
    ellipse(this.x + 6, this.y - 3, 3, 3); // Eye whites
    fill(0);
    ellipse(this.x + 6, this.y - 3, 1, 1); // Pupils
  }
}

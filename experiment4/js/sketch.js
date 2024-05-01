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
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;
let cactiTiles = new Map();

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

let duneOffset = 0; // For dune height variations

function p3_drawBefore() {
  duneOffset += 0.01; // To create a shifting sand effect
}



let crossFadeDuration = 9.5;
let cactusDuration = 120;

function p3_tileClicked(i, j) {
  let key = `${i}-${j}`; // Ensure consistent format
  clicks[key] = crossFadeDuration ; // Track clicks separately
}

function p3_drawTile(i, j) {
  noStroke();

  let key = `${i}-${j}`;

  // Set tile sand color
  let sandColor = color(254, 238, 188 * noise(i * 0.1, j * 0.1, duneOffset));
  fill(sandColor);

  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();

  // Introduce cactus with a 2% chance if not present
  if (!cactiTiles.has(key) && random(0, 850) < 0.1) {
    cactiTiles.set(key, cactusDuration);
  }

  // Draw cactus if timer is positive
  if (cactiTiles.has(key) && cactiTiles.get(key) > 0) {
    drawCactus(i, j);
    cactiTiles.set(key, cactiTiles.get(key) - 1);
  } else if (cactiTiles.get(key) <= 0) {
    cactiTiles.delete(key);
  }

  // Check if clicked or neighbors are clicked
  let clicked = clicks[key] || false;
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      let neighborKey = `${i + xOffset}-${j + yOffset}`;
      if (clicks[neighborKey]) {
        clicked = true;
        break;
      }
    }
  }

  // Draw oasis water only if clicked and no cactus
  if (clicked && !cactiTiles.has(key)) {
    let fadeAmount = (cos(frameCount * 0.1) + 1) / 1.5;
    fill(color(0, 0, 255, map(fadeAmount, 0, 1, 0, 255)));
    push();
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
    pop();
  }
  if (clicks[key]) {
    clicks[key] -= 1;
    if (clicks[key] <= 0) {
      delete clicks[key]; // Remove once expired
    }
  }
}


function drawCactus(i, j) {
  push();

  translate(i, j);

  let cactusFill1 = color(107, 142, 35);
  let cactusFill2 = color(85, 107, 47);

  let gradient = lerpColor(cactusFill1, cactusFill2, 0.5);
  stroke(34, 139, 34);
  strokeWeight(2);
  fill(gradient);

  beginShape();
  vertex(0, 0);
  bezierVertex(-8, -50, 8, -50, 0, -100);
  endShape(CLOSE);

  drawArm(-5, -30, -10, -35, -20, -50, -10, -70);
  drawArm(5, -30, 10, -35, 20, -50, 10, -70);

  drawTextureDetails();

  drawFlowers();
  
  pop();
}

function drawArm(x1, y1, x2, y2, x3, y3, x4, y4) {
  beginShape();
  vertex(x1, y1);
  bezierVertex(x2, y2, x3, y3, x4, y4);
  bezierVertex(x3, y3 - 10, x2, y2 + 10, x1, y1);
  endShape(CLOSE);
}

function drawTextureDetails() {
  for (let k = 1; k < 5; k++) {
    line(0, -20 * k, 2, -20 * k - 10);
    line(-7, -20 * k, -9, -20 * k - 10);
    line(7, -20 * k, 9, -20 * k - 10);
  }

  for (let n = 0; n < 15; n++) {
    let x = random(-10, 10);
    let y = random(-100, 0);
    point(x, y);
  }
}

function drawFlowers() {
  fill(255, 0, 0);
  ellipse(-7, -70, 5, 5);
  ellipse(7, -70, 5, 5);
  ellipse(0, -100, 5, 5);
}


function p3_drawAfter() {}
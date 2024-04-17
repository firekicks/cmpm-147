/* exported setup, draw */

let seed = 0;
let skyTop, skyBottom, mountainColors, treeColor;
let staticElementsDrawn = false;
let starsLayer;
let stars = [];
let scrub = 0;
letbirds = [];


function setup() {
  const canvasContainer = select('#canvas-container');
  const canvas = createCanvas(canvasContainer.width, canvasContainer.height);
  canvas.parent('canvas-container');
  colorMode(RGB);
  // Initialize color variables
  skyTop = color(255, 183, 197); 
  skyBottom = color(76, 111, 145); 
  mountainColors = [
    color(179, 132, 145),
    color(147, 113, 137),
    color(115, 95, 130),
    color(82, 77, 122),
    //color(50, 60, 114)
  ]; 
  treeColor = color(25, 20, 20); 

  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.4),
      size: random(1, 3),
      alpha: random(100, 255)
    });
  }

  starsLayer = createGraphics(width, height * 0.4);
  starsLayer.colorMode(RGB);

  // Initial static drawing
  background(skyTop);
  setGradient(0, 0, width, height, skyTop, skyBottom);
  drawSun();  
  drawMountains();
  drawForest();
}


function draw() {
  scrub = mouseX / width;
  if (!staticElementsDrawn) {
    background(skyTop);
    setGradient(0, 0, width, height, skyTop, skyBottom);
    
    let colorBottom = color(227, 146, 175); 
    let colorTop = color(43, 53, 99); 
  
    setGradient(0, 0, width, height, colorTop, colorBottom);  
    
    //Clouds
    drawCloud(width * 0.5, height * 0.3, 120);
    drawCloud(width * 0.2, height * 0.25, 100);
    drawCloud(width * 0.8, height * 0.35, 140);
    
    drawSun();
    drawMountains();
    drawForest();
    drawStars();
    
    for (let i = 0; i < 5; i++) {
      drawBird(random(width), random(height * 0.3));
    }
    
    staticElementsDrawn = true;
  }

//  for (let i = 0; i < birds.length; i++) {
//    drawBird(birds[i].x, mouseY); // Birds follow mouseY position for the y-coordinate
//  }
  drawSun();
  drawStars();
}


// Gradient function
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function drawForestLayer() {
  const baseY = height; // The base of the trees align with the bottom of the canvas

  for (let i = 0; i < width; i += 20) {
    let x = (i - scrub * 100) % width;
    if (x < 0) {
      x += width; 
    }

    const treeHeight = random(height * 0.1, height * 0.15);
    const treeWidth = treeHeight * 0.3;
    const y = baseY - treeHeight; 
    drawTree(x, y, treeWidth, treeHeight);
  }
}

function drawForest() {
  drawForestLayer();
}

function drawHorizon() {
  const horizonBaseY = height * 0.6; 
  const horizonHeight = 10;
  noStroke(); 
  fill(142, 158, 203, 50); 

  beginShape();
  for (let x = 0; x <= width; x++) {
    const y = horizonBaseY + noise(x * 0.01, seed) * horizonHeight - horizonHeight / 2;
    vertex(x, y);
  }
  vertex(width, height); 
  vertex(0, height); 
  endShape(CLOSE); 
}

function drawMountains() {
  for (let i = 0; i < mountainColors.length; i++) {
    let mountainY = map(i, 0, mountainColors.length, height * 0.5, height * 0.65);
    fill(mountainColors[i]);
    noStroke();
    beginShape();
    let x = 0;
    while (x <= width) {
      let y = noise(x * 0.005, i * 1000) * 100 + mountainY;
      vertex(x, y);
      x += 10;
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

function drawTree(x, y, treeWidth, treeHeight) {
  const trunkWidth = treeWidth * 0.15; 
  const trunkHeight = treeHeight * 0.25; 
  const trunkX = x + treeWidth * 0.5 - trunkWidth * 0.5; 
  const trunkY = y + treeHeight - trunkHeight * 0.5; 

  // Draw the trees
  const treeColor = color(20, 30, 45); 
  fill(treeColor);
  noStroke();
  triangle(
    x, y + treeHeight,
    x + treeWidth / 2, y, 
    x + treeWidth, y + treeHeight 
  );

  fill(83, 53, 10); // Trunk color
  rect(
    trunkX, trunkY,
    trunkWidth, trunkHeight
  );
}


function drawStars() {
  starsLayer.clear();
  stars.forEach(star => {
    star.alpha += random(-10, 10);  
    star.alpha = constrain(star.alpha, 100, 255); 

    starsLayer.fill(255, 255, 255, star.alpha);
    starsLayer.noStroke();
    starsLayer.ellipse(star.x, star.y, star.size, star.size);
  });

  image(starsLayer, 0, 0);
}

function drawSun() {
  let sunSize = width * 0.05; 
  let sunX = width / 2;
  let sunY = height * 0.55; 
  let sunColor = color(255, 204, 0); 
  let time = millis() / 1000; 
  let glowSize = sunSize * (0.8 + 0.2 * sin(time)); 
  let glowOpacity = 0.6 + 0.4 * cos(time); 

  drawingContext.shadowBlur = glowSize;
  drawingContext.shadowColor = `rgba(255, 204, 0, ${glowOpacity})`;

  // Sun
  fill(sunColor);
  noStroke();
  ellipse(sunX, sunY, sunSize);

  drawingContext.shadowBlur = 0;
}

function drawBird(x, y) {
  let birdY = map(mouseY, 0, height, height * 0.1, height * 0.3);

  stroke(0);
  strokeWeight(2);
  noFill();
  push();
  translate(x, birdY); 
  beginShape();
  vertex(-5, 0);
  vertex(0, -5);
  vertex(5, 0);
  endShape();
  pop();
}

function drawCloud(x, y) {
  noStroke();
  fill(255, 255, 255, 200); 
  ellipse(x, y, 60, 40);
  ellipse(x + 30, y - 20, 70, 50);
  ellipse(x - 30, y - 10, 50, 30);
  ellipse(x + 20, y + 10, 80, 60);
}




//function reimagineScene() {
//  seed++;
  //redraw();
//}
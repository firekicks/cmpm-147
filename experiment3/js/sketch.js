/* exported generateGrid, drawGrid */
/* global placeTile */

/* exported preload, setup, draw, placeTile */
/* global generateGrid, drawGrid */

// First Sketch

const sketch1 = (p) => {
  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  p.preload = function() {
    tilesetImage = p.loadImage("https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438");
  };

  p.setup = function() {
    const canvasContainer = p.select('#canvasContainer');
    numRows = parseInt(p.select('#asciiBox').attribute('rows'));
    numCols = parseInt(p.select('#asciiBox').attribute('cols'));
    p.createCanvas(16 * numCols, 16 * numRows).parent(canvasContainer);
    p.select('#reseedButton').mousePressed(reseed);
    p.select('#asciiBox').input(reparseGrid);
    reseed();
  };
  

  p.draw = function() {
    p.randomSeed(seed);
    p.background(128); 
    drawGrid(currentGrid);
  };

  function reseed() {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
    regenerateGrid();
  }

  function regenerateGrid() {
    p.select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
    reparseGrid();
  }

  function reparseGrid() {
    currentGrid = stringToGrid(p.select("#asciiBox").value());
  }

  function gridToString(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }

  function getTileIndices(tile) {
    if (tile === '.') return [3, 13];
    else if (tile === '-') return [p.floor(p.random(3)), 13];
    else return [p.floor(p.random(4)), 0]; // '_'
  }

  function stringToGrid(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }

  function generateGrid(numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        let noiseValue = p.noise(i / 10, j / 10);
        let biomeType;
        if (noiseValue > 0.6) {
          biomeType = "."; // water
        } else if (noiseValue < 0.4) {
          biomeType = "_"; // land
        } else {
          biomeType = noiseValue > 0.5 ? "-" : "_"; 
        }
        row.push(biomeType);
      }
      grid.push(row);
    }
    return grid;
  }

  function drawGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        let tileIndex = getTileIndices(cell);
        placeTile(i, j, tileIndex[0], tileIndex[1]);
      }
    }
    const scrub = p.mouseY / p.height; 
    p.noStroke();
    p.fill("#0000FF"); // Color of raindrops
    for (let i = 0; i < 30; i++) {
      let r = 5 * p.random(); // Raindrop size
      let z = p.random(); 
      let y = p.height * (((scrub / 60 + p.millis() / 5000.0) / z) % 1);
      let x = p.width * p.random();
      p.rect(x, y, r, r); 
    }
  }

  function getTileIndices(tile) {
    if (tile === '.') return [3, 13];
    else if (tile === '-') return [p.floor(p.random(3)), 13];
    else return [p.floor(p.random(4)), 0]; // '_'
  }

  function placeTile(i, j, ti, tj) {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }
}

new p5(sketch1);


const sketch2 = (p) => {
  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  p.preload = function() {
    tilesetImage = p.loadImage("https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438");
  };

  p.setup = function() {
    const canvasContainer = p.select('#canvasContainer2');
    numRows = parseInt(p.select('#asciiBox2').attribute('rows'));
    numCols = parseInt(p.select('#asciiBox2').attribute('cols'));
    p.createCanvas(16 * numCols, 16 * numRows).parent(canvasContainer);
    p.select('#reseedButton2').mousePressed(reseed);
    p.select('#asciiBox2').input(reparseGrid);
    reseed();
  };

  p.draw = function() {
    p.randomSeed(seed);
    p.background(128);
    drawGrid(currentGrid);
  };

  function reseed() {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport2").html("seed " + seed);
    regenerateGrid();
  }

  function regenerateGrid() {
    p.select("#asciiBox2").value(gridToString(generateGrid(numCols, numRows)));
    reparseGrid();
  }

  function reparseGrid() {
    currentGrid = stringToGrid(p.select("#asciiBox2").value());
  }

  function gridToString(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }

  function stringToGrid(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }

  function generateGrid(columns, rows) {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      grid.push(Array(columns).fill('_'));
    }
    grid.forEach(row => row.fill('.'));
  
    for (let i = 1; i < rows - 1; i++) {
      grid[i].fill(':', 1, columns - 1);
    }
  
    let rectY = Math.floor(Math.random() * (rows - 1)) + 1;
    let rectY2 = rectY + Math.floor(Math.random() * (rows - rectY)) - 1;
    for (let i = rectY; i <= rectY2; i++) {
      grid[i][columns - 2] = '-';
    }
  
    for (let i = 9; i <= 10; i++) {
      grid[i].fill('-', 0, 20);
    }
  
    for (let i = 0; i <= 18; i++) {
      grid[i].fill('-', 9, 11);
    }
    return grid;
  }

  function drawGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            let tile = grid[i][j];
            if (tile === '.') {
                placeTile(i, j, p.floor(p.random(4)) | 3, 24 - p.floor(p.random(1)));
            } else if (tile === '-') {
                if (p.noise(i / 5, j / 5) > 0.65) {
                    placeTile(i, j, p.floor(p.random(4)) | 3, 30 - p.floor(p.random(1)));
                } else if (p.noise(i / 10, j / 10) > 0.65) {
                    placeTile(i, j, 30, 3);
                } else {
                    placeTile(i, j, p.floor(p.random(4)) | 3, 9 + p.floor(p.random(1)));
                }
            }
        }
    }
    const scrub = p.mouseY / p.height; 
    p.noStroke();
    p.fill("#FF0000"); 
    for (let i = 0; i < 30; i++) {
      let r = 5 * p.random(); 
      let z = p.random(); 
      let y = p.height * (((scrub / 60 + p.millis() / 5000.0) / z) % 1);
      let x = p.width * p.random();
      p.rect(x, y, r, r); 
    }
}

  function placeTile(i, j, ti, tj) {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }
};

new p5(sketch2);












const lookup = [
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12],
  [2,-12]
  [0, 0],
  [2, -13],
  [2, -11],
  [2, -11],
  [3, -12],
  [3, -12],
  [3, -12],
  [3, -12],
  [1, -12],
  [1, -13],
  [1, -11],
  [1, -11]
];

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let noiseValue = noise(i / 10, j / 10);
      let biomeType;
      if (noiseValue > 0.6) {
        biomeType = "."; // water
      } else if (noiseValue < 0.4) {
        biomeType = "_"; // land
      } else {
        biomeType = noiseValue > 0.5 ? "-" : "_"; 
      }
      row.push(biomeType);
    }
    grid.push(row);
  }
  return grid;
}

function drawGrid(grid) {
  background(128); 

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      const cell = grid[i][j];

      if (cell === '_') {
        placeTile(i, j, p.floor(random(4)), 0); 
      } else if (cell === '.') {
        placeTile(i, j, 3, 13); 
      } else if (cell === '-') {
        placeTile(i, j, p.floor(random(3)), 13); 
      }
      if (cell === '.' || cell === '-') {
        drawContext(grid, i, j, cell, 3, 13);
      }
    }
  }
  const scrub = mouseY / height; 
  noStroke();
  fill("#0000FF"); // Color of raindrops
  for (let i = 0; i < 30; i++) {
    let r = 5 * random(); // Raindrop size
    let z = random(); 
    let y = height * (((scrub / 60 + p.millis() / 5000.0) / z) % 1);
    let x = width * random();
    rect(x, y, r, r); 
  }
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    return grid[i][j] === target; 
  }
  return false; 
}

function gridCode(grid, i, j, target) {
  const northBit = gridCheck(grid, i - 1, j, target) ? true : false;
  const southBit = gridCheck(grid, i + 1, j, target) ? true : false;
  const eastBit  = gridCheck(grid, i, j + 1, target) ? true : false;
  const westBit  = gridCheck(grid, i, j - 1, target) ? true : false;

  return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
}

function drawContext(grid, i, j, target, tileType, tileSet) {
  if (grid[i][j] === target) {
    const code = gridCode(grid, i, j, target); 
    if (code < lookup.length) {
      const [tiOffset, tjOffset] = lookup[code];
      placeTile(i, j, tileType + tiOffset, tileSet + tjOffset);
    }
  }
}

//dungeon
/* exported generateGrid, drawGrid */
/* global placeTile */


/*const lookup = [
  [0, 0],
  [2, -13],
  [2, -11],
  [2, -11],
  [3, -12],
  [3, -12],
  [3, -12],
  [3, -12],
  [1, -12],
  [1, -13],
  [1, -11],
  [1, -11]
];*/




function generateGrid(columns, rows) {
  let grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(Array(columns).fill('_'));
  }
  grid.forEach(row => row.fill('.'));

  for (let i = 1; i < rows - 1; i++) {
    grid[i].fill(':', 1, columns - 1);
  }

  let rectY = Math.floor(Math.random() * (rows - 1)) + 1;
  let rectY2 = rectY + Math.floor(Math.random() * (rows - rectY)) - 1;
  for (let i = rectY; i <= rectY2; i++) {
    grid[i][columns - 2] = '-';
  }

  for (let i = 9; i <= 10; i++) {
    grid[i].fill('-', 0, 20);
  }

  for (let i = 0; i <= 18; i++) {
    grid[i].fill('-', 9, 11);
  }
  return grid;
}


function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let tile = grid[i][j];
      if (tile === '.') {
        placeTile(i, j, random(4) | 3, 24 - random(1));
      } else if (tile === '-') {
        if (noise(i / 5, j / 5) > 0.65) {
          placeTile(i, j, random(4) | 3, 30 - random(1));
        } else if (noise(i / 10, j / 10) > 0.65) {
          placeTile(i, j, 30, 3);
        } else {
          placeTile(i, j, random(4) | 3, 9 + random(1));
        }
      } else {
        drawContext(grid, i, j, "", 0, 16);
        drawContext(grid, i, j, ".", 3, 16);
        drawContext(grid, i, j, "-", 3, 16);
      }
    }
  }
  const scrub = mouseY / height; 
  noStroke();
  fill("#FF0000"); 
  for (let i = 0; i < 30; i++) {
    let r = 5 * p.random(); 
    let z = p.random(); 
    let y = height * (((scrub / 60 + millis() / 5000.0) / z) % 1);
    let x = width * random();
    rect(x, y, r, r); 
  }
}


function gridCheck(grid, i, j, target) {
  if (i > -1 && i < grid.length && j > -1 && j < grid[i].length) {
    return grid[i][j] === target;
  } else {
    return false;
  }
}


function gridCode(grid, i, j, target) {
  const northBit = gridCheck(grid, i - 1, j, target) ? true : false;
  const southBit = gridCheck(grid, i + 1, j, target) ? true : false;
  const eastBit = gridCheck(grid, i, j + 1, target) ? true : false;
  const westBit = gridCheck(grid, i, j - 1, target) ? true : false;

  return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
}


function drawContext(grid, i, j, target, ti, tj) {
  const code = gridCode(grid, i, j, target);
  if (code < lookup.length) {
    const [tiOffset, tjOffset] = lookup[code];
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  }
}
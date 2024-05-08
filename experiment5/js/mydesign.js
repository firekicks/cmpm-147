/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

function getInspirations() {
    return [
      {
        name: "Flower",
        assetUrl: "img/flower.jpg",
        credit: "2-black-white-secrets, Image by Beth"
      },
      {
        name: "Natural Bridges",
        assetUrl: "img/natural-bridges-beach.jpg",
        credit: "Natural Bridges Beach, Elizabeth Coleman"
      },
      {
        name: "Jupiter",
        assetUrl: "img/jupiter-new-horizons.jpg",
        credit: "Juptiter New Horizons, California, NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute, 2007"
      },
    ];
  }
  
  function initDesign(inspiration) {
    let canvasContainer = $('.image-container');
    let canvasWidth = 250;  // Fixed width
    let canvasHeight = 250; // Fixed height
    resizeCanvas(canvasWidth, canvasHeight);
    $(".caption").text(inspiration.credit);

    const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);

    // Adjustments for smaller rendering, if necessary
    resizeCanvas(canvasWidth, canvasHeight);
    let imgX = Math.round(map(0, 0, width, 0, inspiration.image.width));
    let imgY = Math.round(map(0, 0, height, 0, inspiration.image.height));
    let c = inspiration.image.get(imgX, imgY);

    let design = {
        color: [random(255), random(255), random(255)],
        size: random(10, 100),
        shape: random(['circle', 'square', 'triangle']),
        fg: [],
        bg: c
    };

    for (let i = 0; i < 2500; i++) {
        design.fg.push({
            x: random(width),
            y: random(height),
            w: random(width / 2),
            h: random(height / 2),
            fill: ""
        });
    }

    console.log(design);
    return design;
}

  
function renderDesign(design, inspiration) {
    noStroke();
    background(design.bg);
    //referenced blending from the p5.js website with the help of Chat GPT
    blendMode(BLEND);
  
    for (let i = 0; i < 2500; i++) {
      let posX = design.fg[i].x;
      let posY = design.fg[i].y;
      let imgX = Math.round(map(posX, 0, width, 0, inspiration.image.width));
      let imgY = Math.round(map(posY, 0, height, 0, inspiration.image.height));
      let c = inspiration.image.get(imgX, imgY);
      fill(red(c), green(c), blue(c), 175);
      if (design.shape === 'circle') {
        ellipse(posX, posY, design.size);
      } else if (design.shape === 'square') {
        rect(posX, posY, design.size, design.size);
      } else if (design.shape === 'triangle') {
        triangle(posX, posY, posX - design.size / 2, posY + design.size / 2, posX + design.size / 2, posY + design.size / 2);
      }
    }
  }
  
  function mutateDesign(design, inspiration, rate) {
    //mutate the size of the design based on the rate
    design.size = mutateValue(design.size, 10, 100, rate);
    blendMode(BLEND);

    //loop through all foreground elements to mutate their properties and draw them based on their shape
    design.fg.forEach((element) => {
        mutateElement(element, rate);
        drawElementBasedOnShape(element, design, inspiration);
    });
}

function mutateValue(value, min, max, rate) {
    return constrain(randomGaussian(value, (rate * (max - min)) / 10), min, max);
}

function mutateElement(element, rate) {
    //mutate position and size of the element
    element.x = mutateValue(element.x, 0, width, rate);
    element.y = mutateValue(element.y, 0, height, rate);
    element.w = mutateValue(element.w, 0, width / 2, rate);
    element.h = mutateValue(element.h, 0, height / 2, rate);
}

function drawElementBasedOnShape(element, design, inspiration) {
    //choose the drawing function based on the shape and apply the color
    let imgX = Math.round(map(element.x, 0, width, 0, inspiration.image.width));
    let imgY = Math.round(map(element.y, 0, height, 0, inspiration.image.height));
    let c = inspiration.image.get(imgX, imgY);
    fill(red(c), green(c), blue(c), 127);

    switch (design.shape) {
        case 'circle':
            ellipse(element.x, element.y, design.size);
            break;
        case 'square':
            rect(element.x, element.y, design.size, design.size);
            break;
        case 'triangle':
            triangle(element.x, element.y, element.x - design.size / 2, element.y + design.size / 2, element.x + design.size / 2, element.y + design.size / 2);
            break;
    }
}

  
function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
  }
// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
  let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  myInstance.myMethod();
}

//let's get this party started - uncomment me
function main() {
  const fillers = {
    chef: ["Gourmet Guru", "Veggie Virtuoso", "Culinary Wizard", "Plant-Based Pioneer", "Kitchen Magician", "Green Gastronome", "Eco Chef", "Salad Sorcerer", "Herb Whisperer", "Gastronomic Genius"],
    action: ["whip up", "craft", "create", "conjure", "prepare", "assemble", "compose", "devise", "invent", "produce"],
    dish: ["a hearty vegetable stew", "an exotic fruit salad", "a savory mushroom risotto", "crispy tofu tacos", "a refreshing quinoa salad", "spicy lentil curry", "roasted root vegetables", "vegan sushi rolls", "a colorful beet burger", "delectable jackfruit sliders"],
    ingredient: ["avocado", "kale", "quinoa", "tofu", "tempeh", "lentils", "jackfruit", "mushrooms", "beets", "chickpeas", "sweet potatoes", "almonds"],
    spice: ["turmeric", "cumin", "coriander", "paprika", "cardamom", "ginger", "basil", "oregano", "thyme", "rosemary", "masala"],
    challenge: ["the ultimate taste test", "a five-course feast", "an impromptu potluck", "a cooking competition", "a vegan banquet", "a plant-based picnic", "a sustainable eating workshop", "a health-conscious dinner party", "a culinary exhibition", "a gourmet cooking show"],
    reward: ["endless gratitude from the taste testers", "a feature in a culinary magazine", "a trophy for outstanding creativity", "the title of Plant-Based Maestro", "recognition in a chef's hall of fame", "a book deal for a vegetarian cookbook", "a guest spot on a cooking show", "a scholarship to a culinary institute", "a year's supply of organic ingredients", "a gourmet kitchen makeover"],
  };
  
  
  const template = `Greetings, $chef!
  
  Your mission, should you choose to accept it, involves a culinary challenge of the highest order. Your task is to $action $dish using a selection of ingredients including $ingredient and a hint of $spice.
  
  This dish will be your entry in $challenge, where you will showcase your skills and creativity. 
  
  Should you succeed, you will be rewarded with $reward. This is your chance to shine and prove that vegetarian cuisine is not only delicious but also an art form in itself!
  
  Bon appétit!
  `;
}

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();

//25engelke SE01.05 Drawing Fifa World Cup 
//Acknowledgements: both ShiftBot and ChatGBT explained and shared ideas with me that I implemented into my code. 
//Thanks AI!

//declare variables
let colorPicker1; //variable used to access the ColorPicker control
let colorPicker2; //second picker
let colorPicker3; //third picker 
let currentColor; //variable used to determine which palette is used
let clearButton; //variable used to access the Button control
let shapeSelector; //variable used to access the dropdown Select control
let sizeSlider; //variable used to access the Slider control
let imageSelector; //variable used to access a Select dropdown control for images
let controlsContainer; //this is an html section in the index.html file!
let sliderValue; //this is the value of the slider which sets the paintbrush size
let currentShape = "draw"; //variable to decide the shape of the paintbrush
let images = []; //collection of images that you can draw on
let currentImage; //the image selected to draw on
let selectedImage; //currently selected image
let isErasing = false; //this is for my erase button 

//create an array of objects with two fields, file and description 
//#0.1 enter the following array code into *AI* to have it explain it to you
//#0.2 Find 5 images for your theme and load them into the assets folder
let imageFiles = [
  //these images are the replacements of the original assignments
  { file: './assets/harry.jpeg', 
   description: 'Harry Kane - England' },
  { file: './assets/SR.jpeg', 
   description: 'Sergio Ramos - Spain' },
  { file: './assets/kylian.jpeg', 
   description: 'Kylian Mbappe - France' },
  { file: './assets/cristiano.jpeg', 
   description: 'Cristiano Ronaldo - Portugal' },
   { file: './assets/lionel.jpeg', 
   description: 'Lionel Messi - Argentina' },
];

//preload images for asynchronous web
//#1.1 enter the following code into *AI* to explain it to you
function preload() {
  for (let file of imageFiles){
    images.push(loadImage(file.file)); //load each image
  }
} //end function preload()

//initialize variables and setup program
function setup() {
  //update the title in the index.html file from Processing!
  // Update the title in the index.html file from Processing!
  let bannerDiv = select('#app-header');
  bannerDiv.html('Fifa World Cup<br><span style="font-size: 56px;">Nations and Icons</span>'); //this adds a subtext to my code so I can have two different parts of my titles 

  let canvas = createCanvas(450, 500);
  let canvasContainer = select("#canvasContainer");
  canvas.parent("canvasContainer");
  
  let controlsContainer = select("#controlsContainer"); //look in the index.html file
  background(255);
  
  //adding different divs for each type of interaction 
  let buttonsArea = select("#buttonsArea");
  let colorsContainer = select("#colorsContainer");
  let buttonsContainer = select("#buttonsContainer");
  let dropdownsContainer = select("#dropdownsContainer");
  let sizeContainer = select("#sizeContainer");
  
  //putting each into the button area
  colorsContainer.parent(controlsContainer);
  buttonsContainer.parent(controlsContainer);
  dropdownsContainer.parent(controlsContainer);
  sizeContainer.parent(controlsContainer);

  //create the first color picker
  colorPicker1 = createColorPicker("#074F87"); //#3.1 Change the default color
colorPicker1.parent(colorsContainer);
  
  //create the second color picker 
  colorPicker2 = createColorPicker("#4787A6"); 
colorPicker2.parent(colorsContainer); 

  //create the third color picker 
  colorPicker3 = createColorPicker("#C2EDFF"); 
colorPicker3.parent(colorsContainer); 
  
  currentColor = "#074F87"; //setting the original color to dark blue, in case no palette is chosen before you draw 
  
  //create a clear button
  clearButton = createButton("Clear").parent(buttonsContainer);
clearButton.mousePressed(clearCanvas); //assign a function

   let saveButton = createButton("Save").parent(buttonsContainer); //intitializing the save button for the bottom banner 
saveButton.mousePressed(saveCanvasImage);
  
  //implementing erase button 
  eraseButton = createButton("Erase"); //erase button 
eraseButton.parent(buttonsContainer); 
eraseButton.mousePressed(toggleErase);
  
  //implementing paint/drawing button 
  drawButton = createButton("Paint"); //draw button 
drawButton.parent(buttonsContainer); 
drawButton.mousePressed(toggleDraw);
  
  shapeSelector = createSelect().parent(dropdownsContainer);
  //add the dropdown options!
  shapeSelector.option("draw");
  shapeSelector.option("circle");
  shapeSelector.option("square");
  shapeSelector.option("triangle");
  shapeSelector.option("diamond"); //options to pick from when drawing 
  
  //create an image selector dropdown
  imageSelector = createSelect().parent(dropdownsContainer);
  //populate image selector (assuming you have an array of image names)
  //populate the selector with options using descriptions
  imageFiles.forEach((file, index) => {
    imageSelector.option(file.description, index.toString());
  });

  imageSelector.changed(onImageSelect); //event handler for selection

  //create a size slider
  sizeSlider = createSlider(1, 100, 5).parent(sizeContainer);
  
  //create a paragraph for slider value display
  sliderValueDisplay = createSpan("size: " + sizeSlider.value()).parent(sizeContainer);
  
  
  sliderValueDisplay.style("margin-left", "10px"); //add margin for spacing
  sliderValueDisplay.style("flex-shrink", "0"); //prevent the span from shrinking
  sliderValueDisplay.style("color", "#E2F6FF"); //changing color of the text

  //*** getting value from slider to label ***//
  sizeSlider.input(() => {
    sliderValueDisplay.html("size: " + sizeSlider.value());
  });
  
  //code for changing between each color picker 
  colorPicker1.mousePressed(() => {
    currentColor = colorPicker1.color();
  });
  colorPicker2.mousePressed(() => {
    currentColor = colorPicker2.color();
  });
  colorPicker3.mousePressed(() => {
    currentColor = colorPicker3.color();
  }); //event listeners for all color pickers 
  
} //end function setup()

function toggleDraw() { //to toggle between drawing and erasing 
    isErasing = false; 
    eraseButton.html("Erase"); 
} //end of toggleDraw function 

function draw() {
  
  if (isErasing && mouseIsPressed) {
        eraseShape(); //erase where mouse is dragged
    } else if (!isErasing && mouseIsPressed) {
        drawShape(); //draw where mouse is dragged
    } //this if statement allows me to switch between both erasing and drawing easily 
} //end function draw()

function drawShape() { //this will be utilized once again when I press the paint button 
  let size = sizeSlider.value(); 
  fill(currentColor);
  noStroke();
  switch (shapeSelector.value()) {
    case "draw":
      stroke(currentColor);
      strokeWeight(size);
      line(pmouseX, pmouseY, mouseX, mouseY);
      break;
    case "circle":
      ellipse(mouseX, mouseY, size, size);
      break;
    case "square":
      rect(mouseX, mouseY, size, size);
      break;
    case "triangle":
      triangle(
        mouseX, mouseY,
        mouseX + size, mouseY,
        mouseX + size / 2, mouseY - size
      );
      break;
    case "diamond":
      quad(
        mouseX, mouseY - size / 2,
        mouseX + size / 2, mouseY,
        mouseX, mouseY + size / 2,
        mouseX - size / 2, mouseY
      );
      break;
  }
} //end function drawShape()

//clear the canvas
function clearCanvas() {
  clear();
  background(255);
} //end function clearCanvas()

//function to handle image selection - this function is mapped to the control
function onImageSelect() {
  const selectedIndex = parseInt(imageSelector.value(), 10);
  selectedImage = images[selectedIndex];
  clearCanvas();
  //displaying the image at width, height below changes the image. 
  //build an algorithm to set the height or width in the resize function.
  image(selectedImage, 0, 0, width, height);
}//end function onImageSelect()

function saveCanvasImage() { //this function lets me save my images, will be downloaded to my computer  
  saveCanvas(canvas, 'my_drawing', 'png'); 
}

//all of this is for my erase feature...
function toggleErase() {
    isErasing = !isErasing; 
}

function eraseShape() {
    fill(255); //white eraser
    noStroke(); 
    let size = sizeSlider.value(); 
    switch (shapeSelector.value()) {
        case "draw":
            stroke(255);
            strokeWeight(size);
            line(pmouseX, pmouseY, mouseX, mouseY);
            break;
        case "circle":
            ellipse(mouseX, mouseY, size, size);
            break;
        case "square":
            rect(mouseX, mouseY, size, size);
            break;
        case "triangle":
            triangle(
                mouseX, mouseY,
                mouseX + size, mouseY,
                mouseX + size / 2, mouseY - size
            );
            break;
        case "diamond":
            quad(
                mouseX, mouseY - size / 2,
                mouseX + size / 2, mouseY,
                mouseX, mouseY + size / 2,
                mouseX - size / 2, mouseY
            );
            break;
    }
} //end of eraseShape function
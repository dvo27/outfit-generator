// intializing the arrays of shirts and pants names
let shirts_array = []
let pants_array = []

// handling when there is a directory uploaded then call handleFiles function
window.addEventListener('DOMContentLoaded', (event) => {
  const shirt_input = document.getElementById('shirt_input');
  const pants_input = document.getElementById('pants_input');

  if (shirt_input && pants_input) {
    shirt_input.addEventListener('change', () => handleFiles(shirts_array, 'shirt_input'), false)
    pants_input.addEventListener('change', () => handleFiles(pants_array, 'pants_input'), false)

  }
});

// iterates through the given directory and for each file in there, append each file's name to the given array
function handleFiles(array, inputId) {
  const fileList = document.getElementById(inputId).files;
  let invalidFiles = []

  for (const file of fileList) {
    if (['image/jpg', 'image/png', 'image/jpeg'].includes(file.type)) {
      array.push(file.name)
    } else {
      invalidFiles.push(file.name)
    }
  }

  if (invalidFiles.length > 0) {
    window.alert(`Directory contained the following invalid files: 
    \n(${invalidFiles})\n\nPlease upload a folder containing only .jpg, .jpeg, or .png`)
  }

};

// main script starts here:
let interval;

// global variable to store previously selected index
let previousShirtIndex = null;


// getting a random shirt from shirts_array
function getRandomShirt() {
  let randomIndex = Math.floor(Math.random() * shirts_array.length);  // generate a random index
  let selectedImage = shirts_array[randomIndex];  // get an image at the random index
  document.getElementById('image_shower1').src = `./shirts/${selectedImage}`;  // display image
}


// global variable to store previously selected index
let previousPantIndex = null;


// getting a random pant from pants_array
function getRandomPant() {
  let randomIndex = Math.floor(Math.random() * pants_array.length);  // generate a random index
  let selectedImage = pants_array[randomIndex];  // get an image at the random index
  document.getElementById('image_shower2').src = `./pants/${selectedImage}`;  // display image
}


function mousehold1() {  // on click-hold of shirts, go through selection of random shirts
  getRandomShirt()
  interval = setInterval(getRandomShirt, 300)
}


function mousehold2() {  // on click-hold of pants, go through selection of random pants
  getRandomPant()
  interval = setInterval(getRandomPant, 300)
}


function mouseholddone() {  // on release of pants or shirts end scrolling thru selection
  clearInterval(interval)
}


var action = 1;
function viewSomething() {
  if (action == 1) {
    getRandomShirt();
    getRandomPant();
    action = 2;
  } else {
    mouseholddone();
    action = 1;
  }
}

function openingMessage(){
  window.alert('After adding your own shirt and pants folders to the project files, please select them individually below to get started!')
}



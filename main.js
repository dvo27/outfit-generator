let shirts_array = []

let pants_array = [
  'pants1.png',  'pants10.png',
  'pants11.png', 'pants12.png',
  'pants13.png', 'pants2.png',
  'pants3.png',  'pants4.png',
  'pants5.png',  'pants6.png',
  'pants7.png',  'pants8.png',
  'pants9.png'
]

window.addEventListener('DOMContentLoaded', (event) => {
  const file_input = document.getElementById('shirt_input');
  if (file_input) {
    file_input.addEventListener('change', handleFiles, false);
  }
});

function handleFiles() {
  const fileList = this.files

  for (const file of fileList) {
    shirts_array.append(file.name)
  }

  console.log(shirts_array)

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



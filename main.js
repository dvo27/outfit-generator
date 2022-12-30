shirts_array = [
  'shirt1.png',
  'shirt2.png',
  'shirt3.png',
  'shirt4.png',
  'shirt5.png',
  'shirt6.png',
  'shirt7.png',
  'shirt8.png'
]

pants_array = [
  'pants1.png',
  'pants2.png',
  'pants3.png',
  'pants4.png',
  'pants5.png',
  'pants6.png',
  'pants7.png',
  'pants8.png',
  'pants9.png',
  'pants10.png',
  'pants11.png',
  'pants12.png',
  'pants13.png'
]


let interval;

// // getting a random shirt from shirts_array
// function getRandomShirt() {
//   random_index = Math.floor(Math.random() * shirts_array.length);  // get random index
//   selected_image = shirts_array[random_index]  // get an image at the random index
//   document.getElementById('image_shower1').src = `./shirts/${selected_image}`  // display image
//   console.log(random_index)
// }


// // getting a random pant from pants_array
// function getRandomPant() {
//   random_index = Math.floor(Math.random() * pants_array.length);  // get random index
//   selected_image = pants_array[random_index]  // get an image at the random index
//   document.getElementById('image_shower2').src = `./pants/${selected_image}` // display image
//   console.log(random_index)
// }


// global variable to store previously selected index
let previousShirtIndex = null;

// getting a random shirt from shirts_array
function getRandomShirt() {
  let randomIndex = Math.floor(Math.random() * shirts_array.length);  // generate a random index

  while (randomIndex === previousShirtIndex) {  // keep generating a new index until it is different from the previously selected index
    randomIndex = Math.floor(Math.random() * shirts_array.length);
  }

  previousShirtIndex = randomIndex;  // update the previously selected index
  let selectedImage = shirts_array[randomIndex];  // get an image at the random index
  document.getElementById('image_shower1').src = `./shirts/${selectedImage}`;  // display image
  console.log(randomIndex);
}

// global variable to store previously selected index
let previousPantIndex = null;

// getting a random pant from pants_array
function getRandomPant() {
  let randomIndex = Math.floor(Math.random() * pants_array.length);  // generate a random index

  while (randomIndex === previousPantIndex) {  // keep generating a new index until it is different from the previously selected index
    randomIndex = Math.floor(Math.random() * pants_array.length);
  }
  
  previousPantIndex = randomIndex;  // update the previously selected index
  let selectedImage = pants_array[randomIndex];  // get an image at the random index
  document.getElementById('image_shower2').src = `./pants/${selectedImage}`; // display image
  console.log(randomIndex);
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

$("input").on("click", viewSomething);

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
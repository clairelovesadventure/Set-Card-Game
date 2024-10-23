// Constants for game attributes
const ATTRIBUTES = {
  style: ["solid", "striped", "outline"],
  color: ["red", "green", "purple"],
  shape: ["diamond", "oval", "squiggle"],
  count: [1, 2, 3]
};

// Global variables
let timer;
let timeRemaining;
let setsFound = 0;

// Function to toggle between menu and game views
function toggleViews() {
  document.getElementById("menu-view").classList.toggle("hidden");
  document.getElementById("game-view").classList.toggle("hidden");
}

// Function to generate random attributes for a card
function generateRandomAttributes(isEasy) {
  let attributes = {};
  attributes.style = isEasy ? "solid" : randomChoice(ATTRIBUTES.style);
  attributes.color = randomChoice(ATTRIBUTES.color);
  attributes.shape = randomChoice(ATTRIBUTES.shape);
  attributes.count = randomChoice(ATTRIBUTES.count);
  return attributes;
}

// Helper function to get a random choice from an array
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to generate a unique card element
function generateUniqueCard(isEasy) {
  const cardAttributes = generateRandomAttributes(isEasy);
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  for (let i = 0; i < cardAttributes.count; i++) {
  const img = document.createElement("img");
  img.src = `img/${cardAttributes.style}-${cardAttributes.shape}-${cardAttributes.color}.png`;
  cardDiv.appendChild(img);
  }

  cardDiv.addEventListener("click", () => cardSelected(cardDiv));
  return cardDiv;
}

// Function to start the game timer
function startTimer() {
  const selectedTime = parseInt(document.getElementById("timing-options").value);
  timeRemaining = selectedTime * 60; // Convert minutes to seconds
  updateTimerDisplay();

  timer = setInterval(advanceTimer, 1000); // Update every second
}

// Function to advance the timer each second
function advanceTimer() {
  if (timeRemaining <= 0) {
  clearInterval(timer);
  alert("Time's up!");
  toggleViews();
  return;
  }

  timeRemaining--;
  updateTimerDisplay();
}

// Function to update the timer display on the webpage
function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  document.getElementById("time").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to handle card selection logic
function cardSelected(cardDiv) {
  cardDiv.classList.toggle("selected");

  const selectedCards = document.querySelectorAll(".card.selected");

  if (selectedCards.length === 3) {
  if (isSet(selectedCards)) {
    setsFound++;
    document.getElementById("sets-found").textContent = setsFound;
    selectedCards.forEach(card => card.remove());
  }

  selectedCards.forEach(card => card.classList.remove("selected"));

  if (document.querySelectorAll(".card").length < 12) {
    populateBoard();
  }
  }
}

// Function to check if three cards form a valid set
function isSet(cards) {
   // Implement logic to check if the cards form a valid set based on game rules
   // This is a placeholder function and needs actual logic implementation
   return true;
}

// Function to populate the board with cards
function populateBoard() {
   const isEasy = document.getElementById("difficulty-options").value === "easy";
   const board = document.getElementById("board");

   while (board.children.length < 12) { // Ensure there are always at least 12 cards on the board
   board.appendChild(generateUniqueCard(isEasy));
   }
}

// Event listeners for buttons
document.getElementById("start-btn").addEventListener("click", () => {
   toggleViews();
   startTimer();
   populateBoard();
});

document.getElementById("refresh-btn").addEventListener("click", populateBoard);

document.getElementById("back-btn").addEventListener("click", () => {
   clearInterval(timer);
   toggleViews();
});

// Initialize game setup on page load
window.onload = () => {
   toggleViews(); // Start with menu view visible
};

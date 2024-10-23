'use strict'; // Use the global form of 'use strict'

// Constants for magic numbers
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;
const TEN = 10;
const THREE_CARDS = 3;
const MIN_CARDS_ON_BOARD = 12;

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

/**
 * Toggles between menu and game views.
 */
function toggleViews() {
  document.getElementById("menu-view").classList.toggle("hidden");
  document.getElementById("game-view").classList.toggle("hidden");
}

/**
 * Generates random attributes for a card.
 * @param {boolean} isEasy - Whether the game is in easy mode.
 * @returns {Object} The generated attributes.
 */
function generateRandomAttributes(isEasy) {
  let attributes = {};
  attributes.style = isEasy ? "solid" : randomChoice(ATTRIBUTES.style);
  attributes.color = randomChoice(ATTRIBUTES.color);
  attributes.shape = randomChoice(ATTRIBUTES.shape);
  attributes.count = randomChoice(ATTRIBUTES.count);
  return attributes;
}

/**
 * Helper function to get a random choice from an array.
 * @param {Array} array - The array to choose from.
 * @returns {*} A random element from the array.
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a unique card element.
 * @param {boolean} isEasy - Whether the game is in easy mode.
 * @returns {HTMLElement} The card element.
 */
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

/**
 * Starts the game timer.
 */
function startTimer() {
  const selectedTime = parseInt(document.getElementById("timing-options").value, 10);
  timeRemaining = selectedTime * SECONDS_IN_MINUTE; // Convert minutes to seconds
  updateTimerDisplay();

  timer = setInterval(advanceTimer, MILLISECONDS_IN_SECOND); // Update every second
}

/**
 * Advances the timer each second.
 */
function advanceTimer() {
  if (timeRemaining <= 0) {
    clearInterval(timer);
    console.warn("Time's up!"); // Replace alert with console warning
    toggleViews();
    return;
  }

  timeRemaining--;
  updateTimerDisplay();
}

/**
 * Updates the timer display on the webpage.
 */
function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / SECONDS_IN_MINUTE);
  const seconds = timeRemaining % SECONDS_IN_MINUTE;

  document.getElementById("time").textContent =
    `${minutes}:${seconds < TEN ? '0' : ''}${seconds}`;
}

/**
 * Handles card selection logic.
 * @param {HTMLElement} cardDiv - The selected card element.
 */
function cardSelected(cardDiv) {
  cardDiv.classList.toggle("selected");

  const selectedCards = document.querySelectorAll(".card.selected");

  if (selectedCards.length === THREE_CARDS) {
    if (isSet(selectedCards)) {
      setsFound++;
      document.getElementById("sets-found").textContent = setsFound;
      selectedCards.forEach(card => card.remove());
    }

    selectedCards.forEach(card => card.classList.remove("selected"));

    if (document.querySelectorAll(".card").length < MIN_CARDS_ON_BOARD) {
      populateBoard();
    }
  }
}

/**
 * Checks if three cards form a valid set.
 * This function needs actual logic implementation.
 * @returns {boolean} True if valid set, otherwise false.
 */
function isSet(cards) {
   /*
    * Implement logic to check if the cards form a valid set based on game rules.
    * This is a placeholder function and needs actual logic implementation.
    */
   return true;
}

/**
 * Populates the board with cards.
 */
function populateBoard() {
  const isEasy = document.getElementById("difficulty-options").value === "easy";

  const board = document.getElementById("board");

 while (board.children.length < MIN_CARDS_ON_BOARD) {
   // Ensure there are always at least MIN_CARDS_ON_BOARD cards on the board
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

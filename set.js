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

// Module-global variables
let timerId;
let remainingSeconds;

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
    img.alt = `${cardAttributes.style}-${cardAttributes.shape}-${cardAttributes.color}-${cardAttributes.count}`;
    cardDiv.appendChild(img);
  }

  cardDiv.id = `${cardAttributes.style}-${cardAttributes.shape}-${cardAttributes.color}-${cardAttributes.count}`;
  cardDiv.addEventListener("click", () => cardSelected(cardDiv));

  return cardDiv;
}

/**
 * Starts the game timer.
 */
function startTimer() {
  const selectedTime = parseInt(document.getElementById("timing-options").value, TEN);
  remainingSeconds = selectedTime * SECONDS_IN_MINUTE; // Convert minutes to seconds
  updateTimerDisplay();

  timerId = setInterval(advanceTimer, MILLISECONDS_IN_SECOND); // Update every second
}

/**
 * Advances the timer each second.
 */
function advanceTimer() {
  if (remainingSeconds <= 0) {
    clearInterval(timerId);
    console.warn("Time's up!"); // Replace alert with console warning
    disableBoard();
    return;
  }

  remainingSeconds--;
  updateTimerDisplay();
}

/**
 * Updates the timer display on the webpage.
 */
function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / SECONDS_IN_MINUTE);
  const seconds = remainingSeconds % SECONDS_IN_MINUTE;

  document.getElementById("time").textContent =
    `${minutes}:${seconds < TEN ? '0' : ''}${seconds}`;
}

/**
 * Handles card selection logic.
 * @param {HTMLElement} cardDiv - The selected card element.
 */
function cardSelected(cardDiv) {
  if (remainingSeconds <= 0) return; // Prevent selection if time is up

  cardDiv.classList.toggle("selected");

  const selectedCards = document.querySelectorAll(".card.selected");

  if (selectedCards.length === THREE_CARDS) {
    if (isASet(selectedCards)) {
      handleValidSet(selectedCards);
    } else {
      handleInvalidSet(selectedCards);
    }
    selectedCards.forEach(card => card.classList.remove("selected"));

    if (document.querySelectorAll(".card").length < MIN_CARDS_ON_BOARD) {
      populateBoard();
    }

 }
}

/**
* Handles a valid set of cards being selected.
* @param {NodeList} selectedCards - The selected cards forming a valid set.
*/
function handleValidSet(selectedCards) {
   incrementSetsFound();
   displayMessage(selectedCards, "SET!");
   setTimeout(() => replaceCards(selectedCards), MILLISECONDS_IN_SECOND);
 }

/**
* Handles an invalid set of cards being selected.
* @param {NodeList} selectedCards - The selected cards not forming a valid set.
*/
function handleInvalidSet(selectedCards) {
   displayMessage(selectedCards, "Not a Set");
   setTimeout(() => removeMessages(selectedCards), MILLISECONDS_IN_SECOND);
 }

/**
* Displays a message on the selected cards and hides images temporarily.
* @param {NodeList} cards - The cards to display the message on.
* @param {string} message - The message to display ("SET!" or "Not a Set").
*/
function displayMessage(cards, message) {
   cards.forEach(card => {
     card.classList.add("hide-imgs");
     const p = document.createElement("p");
     p.textContent = message;
     card.appendChild(p);
   });
 }

/**
* Removes messages from cards and unhides images.
* @param {NodeList} cards - The cards to remove messages from.
*/
function removeMessages(cards) {
   cards.forEach(card => {
     card.classList.remove("hide-imgs");
     const p = card.querySelector("p");
     if (p) p.remove();
   });
 }

/**
* Disables the board when time runs out or game ends.
*/
function disableBoard() {
   const cards = document.querySelectorAll(".card");
   cards.forEach(card => {
     card.removeEventListener("click", () => cardSelected(card));
     card.classList.remove("selected");
   });

   document.getElementById("refresh-btn").disabled = true;
 }

/**
* Increments the count of sets found and updates the display.
*/
function incrementSetsFound() {
   const setsFoundElement = document.getElementById("sets-found");
   let setsFoundCount = parseInt(setsFoundElement.textContent, TEN);
   setsFoundCount++;
   setsFoundElement.textContent = setsFoundCount;
 }

/**
* Replaces selected cards with new unique cards on the board.
* @param {NodeList} selectedCards - The selected cards to be replaced.
*/
function replaceCards(selectedCards) {
   const isEasy = document.getElementById("difficulty-options").value === "easy";

   selectedCards.forEach(card => {
     const newCard = generateUniqueCard(isEasy);
     removeMessages([newCard]);
     card.replaceWith(newCard);
   });
 }

/**
* Populates the board with cards ensuring minimum required are present.
*/
function populateBoard() {
   const isEasy = document.getElementById("difficulty-options").value === "easy";
   const board = document.getElementById("board");

   while (board.children.length < MIN_CARDS_ON_BOARD) {
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
 clearInterval(timerId);
 toggleViews();
});

// Initialize game setup on page load
window.onload = () => {
 toggleViews(); // Start with menu view visible
};

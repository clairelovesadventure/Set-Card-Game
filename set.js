"use strict";

/**
 * Main IIFE to encapsulate the game logic.
 */
(function() {
  // Required module globals
  let timerId;
  let remainingSeconds;

  // Constants for attributes
  const STYLES = ["solid", "outline", "striped"];
  const COLORS = ["green", "purple", "red"];
  const SHAPES = ["diamond", "oval", "squiggle"];
  const COUNTS = [1, 2, 3];
  const MESSAGE_DURATION = 1000; // Duration to display messages
  const EASY_CARD_COUNT = 9; // Number of cards for easy mode
  const HARD_CARD_COUNT = 12; // Number of cards for hard mode

  window.addEventListener("load", init);

  /**
   * Initializes the game by setting up event listeners.
   */
  function init() {
    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("back-btn").addEventListener("click", backToMenu);
    document.getElementById("refresh-btn").addEventListener("click", refreshBoard);
  }

  /**
   * Toggles the visibility of menu and game views.
   */
  function toggleViews() {
    document.getElementById("menu-view").classList.toggle("hidden");
    document.getElementById("game-view").classList.toggle("hidden");
  }

  /**
   * Generates random attributes for a card.
   * @param {boolean} isEasy - Indicates if the game is in easy mode.
   * @returns {Array} The attributes of the card.
   */
  function generateRandomAttributes(isEasy) {
    let style = isEasy ? "solid" : STYLES[Math.floor(Math.random() * STYLES.length)];
    let shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    let color = COLORS[Math.floor(Math.random() * COLORS.length)];
    let count = COUNTS[Math.floor(Math.random() * COUNTS.length)];
    return [style, shape, color, count];
  }

  /**
   * Generates a unique card element.
   * @param {boolean} isEasy - Indicates if the game is in easy mode.
   * @returns {HTMLElement} The card element.
   */
  function generateUniqueCard(isEasy) {
    let attributes;
    let id;
    do {
      attributes = generateRandomAttributes(isEasy);
      id = attributes.join("-");
    } while (document.getElementById(id));

    let card = document.createElement("div");
    card.classList.add("card");
    card.id = id;

    for (let i = 0; i < attributes[3]; i++) {
      let img = document.createElement("img");
      img.src = `img/${attributes[0]}-${attributes[1]}-${attributes[2]}.png`;
      img.alt = id;
      card.appendChild(img);
    }

    card.addEventListener("click", cardSelected);
    return card;
  }

  /**
   * Starts the game by toggling views and setting up the board.
   */
  function startGame() {
    toggleViews();
    startTimer();
    setupBoard();
  }

  /**
   * Starts the timer for the game.
   */
  function startTimer() {
    remainingSeconds = parseInt(document.querySelector("#menu-view select").value);
    updateTimerDisplay();

    if (timerId) clearInterval(timerId);

    timerId = setInterval(advanceTimer, 1000);
  }

  /**
   * Advances the timer by one second and updates the display.
   */
  function advanceTimer() {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateTimerDisplay();
      if (remainingSeconds === 0) {
        clearInterval(timerId);
        endGame();
      }
    }
  }

  /**
   * Updates the timer display in the UI.
   */
  function updateTimerDisplay() {
    let minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    let seconds = String(remainingSeconds % 60).padStart(2, '0');
    document.getElementById("time").textContent = `${minutes}:${seconds}`;
  }

  /**
   * Sets up the game board with cards based on the selected difficulty.
   */
  function setupBoard() {
    let board = document.getElementById("board");
    board.innerHTML = "";

    let difficulty = document.querySelector('input[name="diff"]:checked').value;
    let numCards = difficulty === "easy" ? EASY_CARD_COUNT : HARD_CARD_COUNT;

    for (let i = 0; i < numCards; i++) {
      board.appendChild(generateUniqueCard(difficulty === "easy"));
    }
  }

  /**
   * Handles card selection and checking for sets.
   */
  function cardSelected() {
    const card = this;

    // Toggle the selected class on the clicked card
    card.classList.toggle("selected");

    let selectedCards = Array.from(document.querySelectorAll(".card.selected"));

    if (selectedCards.length === 3) {
      // Immediately remove the .selected class before showing messages
      clearSelection(selectedCards);

      const isSet = isASet(selectedCards);
      if (isSet) {
        replaceCards(selectedCards);
        incrementSetCount();
        displayMessage(selectedCards, "SET!");
      } else {
        displayMessage(selectedCards, "Not a Set");
      }
    }
  }

  /**
   * Displays a message on the selected cards.
   * @param {Array} cards - The cards to display the message on.
   * @param {string} message - The message to display.
   */
  function displayMessage(cards, message) {
    cards.forEach(card => {
      card.classList.add("hide-imgs");
      let msgElem = document.createElement("p");
      msgElem.textContent = message;
      card.appendChild(msgElem);

      // Remove the message after 1 second and restore images
      setTimeout(() => {
        msgElem.remove();
        card.classList.remove("hide-imgs");
      }, MESSAGE_DURATION);
    });
  }

  /**
   * Clears the selection from the given cards.
   * @param {Array} cards - The cards to clear selection from.
   */
  function clearSelection(cards) {
    cards.forEach(card => {
      card.classList.remove("selected");
      card.querySelectorAll("p").forEach(message => message.remove());
    });
  }

  /**
   * Replaces the selected cards with new unique cards.
   * @param {Array} cards - The cards to be replaced.
   */
  function replaceCards(cards) {
    cards.forEach(card => {
      let newCard = generateUniqueCard(document.querySelector('input[name="diff"]:checked').value === "easy");
      newCard.classList.add("hide-imgs");
      card.replaceWith(newCard);

      // Show "SET!" message on the new card
      let msgElem = document.createElement("p");
      msgElem.textContent = "SET!";
      newCard.appendChild(msgElem);

      setTimeout(() => {
        msgElem.remove();
        newCard.classList.remove("hide-imgs");
      }, MESSAGE_DURATION);
    });
  }

  /**
   * Increments the count of sets found.
   */
  function incrementSetCount() {
    let setCountElem = document.getElementById("set-count");
    setCountElem.textContent = parseInt(setCountElem.textContent) + 1;
  }

  /**
   * Refreshes the game board by re-initializing it.
   */
  function refreshBoard() {
    setupBoard();
  }

  /**
   * Ends the game by disabling interactions and cleaning up.
   */
  function endGame() {
    document.querySelectorAll(".card").forEach(card => card.removeEventListener("click", cardSelected));
    const refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) refreshBtn.disabled = true;
    clearInterval(timerId);
    clearSelection(Array.from(document.querySelectorAll(".card")));
  }

  /**
   * Returns to the main menu and resets game state.
   */
  function backToMenu() {
    toggleViews();
    clearInterval(timerId);
    document.getElementById("set-count").textContent = "0";
    document.getElementById("refresh-btn").disabled = false;
  }

  /**
   * Checks if the selected cards form a valid set.
   * @param {Array} selected - The selected cards.
   * @returns {boolean} True if the selected cards form a set, false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }

    for (let i = 0; i < attributes[0].length; i++) {
      let diff =
        attributes[0][i] !== attributes[1][i] &&
        attributes[1][i] !== attributes[2][i] &&
        attributes[0][i] !== attributes[2][i];
      let same =
        attributes[0][i] === attributes[1][i] &&
        attributes[1][i] === attributes[2][i];
      if (!(same || diff)) return false;
    }
    return true;
  }
})();

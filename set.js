"use strict";

(function() {
  // Required module globals
  let timerId;
  let remainingSeconds;

  // Constants for attributes
  const STYLES = ["solid", "outline", "striped"];
  const COLORS = ["green", "purple", "red"];
  const SHAPES = ["diamond", "oval", "squiggle"];
  const COUNTS = [1, 2, 3];

  window.addEventListener("load", init);

  function init() {
    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("back-btn").addEventListener("click", backToMenu);
    document.getElementById("refresh-btn").addEventListener("click", refreshBoard);
  }

  function toggleViews() {
    document.getElementById("menu-view").classList.toggle("hidden");
    document.getElementById("game-view").classList.toggle("hidden");
  }

  function generateRandomAttributes(isEasy) {
    let style = isEasy ? "solid" : STYLES[Math.floor(Math.random() * STYLES.length)];
    let shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    let color = COLORS[Math.floor(Math.random() * COLORS.length)];
    let count = COUNTS[Math.floor(Math.random() * COUNTS.length)];
    return [style, shape, color, count];
  }

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

  function startGame() {
    toggleViews();
    startTimer();
    setupBoard();
  }

  function startTimer() {
    remainingSeconds = parseInt(document.querySelector("#menu-view select").value);
    updateTimerDisplay();

    if (timerId) clearInterval(timerId);

    timerId = setInterval(advanceTimer, 1000);
  }

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

  function updateTimerDisplay() {
    let minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    let seconds = String(remainingSeconds % 60).padStart(2, '0');
    document.getElementById("time").textContent = `${minutes}:${seconds}`;
  }

  function setupBoard() {
    let board = document.getElementById("board");
    board.innerHTML = "";

    let difficulty = document.querySelector('input[name="diff"]:checked').value;
    let numCards = difficulty === "easy" ? 9 : 12;

    for (let i = 0; i < numCards; i++) {
      board.appendChild(generateUniqueCard(difficulty === "easy"));
    }
  }

  function cardSelected(event) {
    const card = event.currentTarget;

    // Toggle the selected class on the clicked card
    card.classList.toggle("selected");

    let selectedCards = document.querySelectorAll(".card.selected");

    if (selectedCards.length === 3) {
      // Immediately remove the .selected class before showing messages
      clearSelection(selectedCards);

      const isSet = isASet(selectedCards);
      if (isSet) {
        replaceCards(selectedCards);
        incrementSetCount();
        selectedCards.forEach(card => {
          displayMessage(card, "SET!");
        });
      } else {
        displayMessage(selectedCards, "Not a Set");
      }
    }
  }

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
      }, 1000);
    });
  }

  function clearSelection(cards) {
    cards.forEach(card => {
      card.classList.remove("selected");
      card.querySelectorAll("p").forEach(p => p.remove());
    });
  }

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
      }, 1000);
    });
  }

  function incrementSetCount() {
    let setCountElem = document.getElementById("set-count");
    setCountElem.textContent = parseInt(setCountElem.textContent) + 1;
  }

  function refreshBoard() {
    setupBoard();
  }

  function endGame() {
    document.querySelectorAll(".card").forEach(card => card.removeEventListener("click", cardSelected));
    const refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) refreshBtn.disabled = true;
    clearInterval(timerId);
    clearSelection(document.querySelectorAll(".card"));
    console.log('Game ended');
  }

  function backToMenu() {
    toggleViews();
    clearInterval(timerId);
    document.getElementById("set-count").textContent = "0";
    document.getElementById("refresh-btn").disabled = false;
  }

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

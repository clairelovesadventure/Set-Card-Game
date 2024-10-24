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
	if (!event.currentTarget) {
		console.warn("Event currentTarget is undefined");
		return;
	  }
	event.currentTarget.classList.toggle("selected");
    let selectedCards = document.querySelectorAll(".card.selected");

    if (selectedCards.length < 3) {
      event.currentTarget.classList.toggle("selected");
      selectedCards = document.querySelectorAll(".card.selected");

	  if (selectedCards.length === 3) {
		const isSet = isASet(selectedCards); // Call immediately when three cards are selected
		if (isSet) {
		  displayMessage(selectedCards, "SET!");
		  replaceCards(selectedCards);
		  incrementSetCount();
		} else {
		  displayMessage(selectedCards, "Not a Set");
		}
	  }
	  clearSelection(selectedCards); // Ensure this is called after checking for a set
    }
  }

  function displayMessage(cards, message) {
	cards.forEach(card => {
	  card.classList.add("hide-imgs");
	  let msgElem = document.createElement("p");
	  msgElem.textContent = message;
	  card.appendChild(msgElem);
	  setTimeout(() => {
		msgElem.remove();
		clearSelection(cards); // Move clearSelection here for immediate feedback after message disappears
	  }, 1000);
	});
  }

  function clearSelection(cards) {
	setTimeout(() => { // Ensure immediate removal after message display delay
	  cards.forEach(card => {
		card.classList.remove("selected", "hide-imgs");
		card.querySelectorAll("p").forEach(p => p.remove());
	  });
	}, 1000); // Match this delay with message display duration if needed
  }

  function replaceCards(cards) {
	cards.forEach(card => {
	  let newCard = generateUniqueCard(document.querySelector('input[name="diff"]:checked').value === "easy");
	  card.replaceWith(newCard); // Ensure replacement happens immediately and in order
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
    // Disable further interactions and refresh button
    document.querySelectorAll(".card").forEach(card => card.removeEventListener("click", cardSelected));

	// Disable the refresh button
	const refreshBtn = document.getElementById("refresh-btn");
	if (refreshBtn) refreshBtn.disabled = true;

	// Stop timer
	clearInterval(timerId);

	// Remove selected class from all cards
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
// Provided isASet function from spec
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

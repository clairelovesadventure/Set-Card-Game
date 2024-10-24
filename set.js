"use strict";

(function() {
  document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-btn");
    const backButton = document.getElementById("back-btn");
    const refreshButton = document.getElementById("refresh-btn");
    const menuView = document.getElementById("menu-view");
    const gameView = document.getElementById("game-view");
    const setCountDisplay = document.getElementById("set-count");
    const timeDisplay = document.getElementById("time");

    let timer;
    let setsFound = 0;

    startButton.addEventListener("click", startGame);
    backButton.addEventListener("click", goBackToMenu);
    refreshButton.addEventListener("click", refreshBoard);

    function startGame() {
      menuView.classList.add("hidden");
      gameView.classList.remove("hidden");
      setsFound = 0;
      setCountDisplay.textContent = setsFound;
      startTimer();
      initializeBoard();
    }

    function goBackToMenu() {
      clearInterval(timer);
      gameView.classList.add("hidden");
      menuView.classList.remove("hidden");
    }

    function refreshBoard() {
      initializeBoard();
    }

    function initializeBoard() {
      const board = document.getElementById("board");
      board.innerHTML = "";
      for (let i = 0; i < 12; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = `Card ${i + 1}`;
        card.addEventListener("click", () => selectCard(card));
        board.appendChild(card);
      }
    }

    function selectCard(card) {
      card.classList.toggle("selected");
      if (checkForSet()) {
        setsFound++;
        setCountDisplay.textContent = setsFound;
        refreshBoard();
      }
    }

    function checkForSet() {
      return false;
    }

    function startTimer() {
      let timeLeft = parseInt(document.querySelector("select").value);
      updateTimeDisplay(timeLeft);

      timer = setInterval(() => {
        timeLeft--;
        updateTimeDisplay(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timer);
          alert(`Time's up! You found ${setsFound} sets.`);
          goBackToMenu();
        }
      }, 1000);
    }

    function updateTimeDisplay(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      timeDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  });
})();

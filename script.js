document.addEventListener("DOMContentLoaded", () => {

const clickSound = new Audio("click.mp3");
clickSound.volume = 0.5;

let score = 0;
let hits = 0;
let miss = 0;
let timeLeft = 30;
let gameRunning = false;
let paused = false;
let difficulty = "easy";

let spawnTimeout;
let lifeTimeout;
let gameTimer;

const settings = {
  easy:   { size: 60, time: 1200, cooldown: 800,  points: 100 },
  medium: { size: 50, time: 900,  cooldown: 500,  points: 150 },
  hard:   { size: 40, time: 600,  cooldown: 300,  points: 200 }
};

window.showDifficulty = function() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("difficulty").classList.remove("hidden");
}

window.showScoreboard = function() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("scoreboard").classList.remove("hidden");

  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  let list = document.getElementById("scoreList");

  list.innerHTML = "";
  scores.sort((a, b) => b - a);

  scores.forEach((s, i) => {
    let li = document.createElement("li");
    li.textContent = `#${i + 1} - ${s}`;
    list.appendChild(li);
  });
}

window.goMenu = function() {
  document.getElementById("scoreboard").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

window.startGame = function(diff) {
  difficulty = diff;

  document.getElementById("difficulty").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  score = 0;
  hits = 0;
  miss = 0;
  timeLeft = 30;
  gameRunning = true;
  paused = false;

  // Miss on misclick - set once here, not inside spawnCircle
  document.getElementById("game").onclick = (e) => {
    if (!e.target.classList.contains("circle") && gameRunning && !paused) {
      miss++;
      updateUI();
    }
  };

  updateUI();
  document.getElementById("time").textContent = timeLeft;

  gameLoop();
  startTimer();
}

function gameLoop() {
  if (!gameRunning || paused) return;
  spawnCircle();
}

function spawnCircle() {
  const game = document.getElementById("game");

  const oldCircle = game.querySelector(".circle");
  if (oldCircle) oldCircle.remove();

  const circle = document.createElement("div");
  circle.classList.add("circle");

  let size = settings[difficulty].size;
  circle.style.width = size + "px";
  circle.style.height = size + "px";

  // Spawn within visible game area, below HUD (~60px)
  let x = Math.random() * (window.innerWidth - size);
  let y = 60 + Math.random() * (window.innerHeight - size - 60);

  circle.style.left = x + "px";
  circle.style.top = y + "px";

  let clicked = false;

  circle.onclick = (e) => {
    e.stopPropagation();

    if (!clicked) {
      clicked = true;
      hits++;

      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});

      score += settings[difficulty].points;
      updateUI();

      circle.remove();
      clearTimeout(lifeTimeout);

      spawnTimeout = setTimeout(() => gameLoop(), settings[difficulty].cooldown);
    }
  };

  game.appendChild(circle);

  lifeTimeout = setTimeout(() => {
    if (!clicked) {
      miss++;
      updateUI();
      circle.remove();
    }

    spawnTimeout = setTimeout(() => gameLoop(), settings[difficulty].cooldown);

  }, settings[difficulty].time);
}

function startTimer() {
  gameTimer = setInterval(() => {
    if (!paused) {
      timeLeft--;
      document.getElementById("time").textContent = timeLeft;

      if (timeLeft <= 0) endGame();
    }
  }, 1000);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && gameRunning) {
    paused = !paused;
    document.getElementById("pauseMenu").classList.toggle("hidden");

    if (!paused) gameLoop();
  }
});

window.resumeGame = function() {
  paused = false;
  document.getElementById("pauseMenu").classList.add("hidden");
  gameLoop();
}

window.quitGame = function() {
  location.reload();
}

function saveScore(s) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(s);
  localStorage.setItem("scores", JSON.stringify(scores));
}

function endGame() {
  gameRunning = false;

  clearInterval(gameTimer);
  clearTimeout(spawnTimeout);
  clearTimeout(lifeTimeout);

  saveScore(score);

  alert("Time's up! Score: " + score);
  location.reload();
}

function updateUI() {
  const scoreEl = document.getElementById("score");
  const hitsEl  = document.getElementById("hits");
  const missEl  = document.getElementById("miss");
  const accEl   = document.getElementById("accuracy");

  if (scoreEl) scoreEl.textContent = score;
  if (hitsEl)  hitsEl.textContent  = hits;
  if (missEl)  missEl.textContent  = miss;

  let total = hits + miss;
  let acc = total === 0 ? 0 : Math.round((hits / total) * 100);

  if (accEl) accEl.textContent = acc + "%";
}

});
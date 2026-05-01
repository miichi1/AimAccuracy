let score = 0;
let miss = 0;
let timeLeft = 30;
let gameRunning = false;
let paused = false;
let difficulty = "easy";

let circleTimeout;
let gameTimer;

// difficulty settings
const settings = {
  easy:   { size: 60, time: 1200, points: 100 },
  medium: { size: 50, time: 900,  points: 150 },
  hard:   { size: 40, time: 600,  points: 200 }
};

function showDifficulty() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("difficulty").classList.remove("hidden");
}

function startGame(diff) {
  difficulty = diff;

  document.getElementById("difficulty").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  score = 0;
  miss = 0;
  timeLeft = 30;
  gameRunning = true;

  updateUI();

  gameLoop();
  startTimer();
}

function gameLoop() {
  if (!gameRunning || paused) return;

  spawnCircle();

  circleTimeout = setTimeout(gameLoop, settings[difficulty].time);
}

function spawnCircle() {
  const game = document.getElementById("game");
  const oldCircle = document.querySelector(".circle");
if (oldCircle) oldCircle.remove();

  const circle = document.createElement("div");
  circle.classList.add("circle");

  let size = settings[difficulty].size;
  circle.style.width = size + "px";
  circle.style.height = size + "px";

  let x = Math.random() * (window.innerWidth - size);
  let y = Math.random() * (window.innerHeight - size);

  circle.style.left = x + "px";
  circle.style.top = y + "px";

  let clicked = false;

  circle.onclick = () => {
    if (!clicked) {
      score += settings[difficulty].points;
      clicked = true;
      updateUI();
    }
  };

  game.appendChild(circle);

  // disappear
  setTimeout(() => {
    if (!clicked) miss++;
    updateUI();
    circle.remove();
  }, settings[difficulty].time);
}

// miss click
document.getElementById("game").addEventListener("click", (e) => {
  if (!gameRunning || paused) return;
  if (!e.target.classList.contains("circle")) {
    miss++;
    updateUI();
  }
});

// timer
function startTimer() {
  gameTimer = setInterval(() => {
    if (!paused) {
      timeLeft--;
      document.getElementById("time").textContent = timeLeft;

      if (timeLeft <= 0) endGame();
    }
  }, 1000);
}

// pause with ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && gameRunning) {
    paused = !paused;

    document.getElementById("pauseMenu").classList.toggle("hidden");

    if (!paused) gameLoop();
  }
});

function resumeGame() {
  paused = false;
  document.getElementById("pauseMenu").classList.add("hidden");
  gameLoop();
}

function quitGame() {
  location.reload();
}

function endGame() {
  gameRunning = false;
  clearInterval(gameTimer);
  clearTimeout(circleTimeout);

  saveScore(score);

  alert("Time's up! Score: " + score);
  location.reload();
}

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("miss").textContent = miss;

  let total = score + miss;
  let acc = total === 0 ? 0 : Math.round((score / total) * 100);

  document.getElementById("accuracy").textContent = acc + "%";
}

// save scoreboard
function saveScore(s) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(s);
  localStorage.setItem("scores", JSON.stringify(scores));
}
function showScoreboard() {
  alert("Scoreboard not implemented yet");
}
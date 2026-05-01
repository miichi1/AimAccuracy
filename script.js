const clickSound = new Audio("click.mp3");
clickSound.volume = 0.5;

let score = 0;
let miss = 0;
let timeLeft = 30;
let gameRunning = false;
let paused = false;
let difficulty = "easy";

let circleTimeout;
let gameTimer;

const settings = {
  easy:   { size: 60, time: 1200, cooldown: 800, points: 100 },
  medium: { size: 50, time: 900,  cooldown: 500, points: 150 },
  hard:   { size: 40, time: 600,  cooldown: 300, points: 200 }
};

function showDifficulty() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("difficulty").classList.remove("hidden");
}

function showScoreboard() {
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

function goMenu() {
  document.getElementById("scoreboard").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function startGame(diff) {
  difficulty = diff;

  document.getElementById("difficulty").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  score = 0;
  miss = 0;
  timeLeft = 30;
  gameRunning = true;
  paused = false;

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

  circle.onclick = (e) => {
    e.stopPropagation();

    if (!clicked) {
      clicked = true;

      // SOUND
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});

      score += settings[difficulty].points;
      updateUI();

      circle.remove();

      clearTimeout(circleTimeout);
      circleTimeout = setTimeout(gameLoop, settings[difficulty].cooldown);
    }
  };

  game.appendChild(circle);

  circleTimeout = setTimeout(() => {
    if (!clicked) {
      miss++;
      updateUI();
      circle.remove();
      circleTimeout = setTimeout(gameLoop, settings[difficulty].cooldown);
    }
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

function startTimer() {
  gameTimer = setInterval(() => {
    if (!paused) {
      timeLeft--;
      document.getElementById("time").textContent = timeLeft;

      if (timeLeft <= 0) endGame();
    }
  }, 1000);
}

// ESC pause
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

function saveScore(s) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(s);
  localStorage.setItem("scores", JSON.stringify(scores));
}
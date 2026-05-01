let score = 0;
let miss = 0;
let gameRunning = false;

function startGame() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  score = 0;
  miss = 0;
  gameRunning = true;

  updateUI();
  spawnCircle();
}

function spawnCircle() {
  if (!gameRunning) return;

  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";

  const circle = document.createElement("div");
  circle.classList.add("circle");

  let x = Math.random() * (gameArea.clientWidth - 50);
  let y = Math.random() * (gameArea.clientHeight - 50);

  circle.style.left = x + "px";
  circle.style.top = y + "px";

  circle.onclick = () => {
    score++;
    updateUI();
    spawnCircle();
  };

  gameArea.appendChild(circle);
}

// detect miss click
document.getElementById("gameArea").addEventListener("click", function(e) {
  if (e.target.classList.contains("circle")) return;

  miss++;
  updateUI();
});

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("miss").textContent = miss;

  let total = score + miss;
  let acc = total === 0 ? 0 : Math.round((score / total) * 100);

  document.getElementById("accuracy").textContent = acc + "%";
}

function endGame() {
  gameRunning = false;

  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(score);
  localStorage.setItem("scores", JSON.stringify(scores));
}

function showScoreboard() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("scoreboard").classList.remove("hidden");

  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  let list = document.getElementById("scoreList");

  list.innerHTML = "";

  scores.forEach(s => {
    let li = document.createElement("li");
    li.textContent = "Score: " + s;
    list.appendChild(li);
  });
}

function goMenu() {
  document.getElementById("scoreboard").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}
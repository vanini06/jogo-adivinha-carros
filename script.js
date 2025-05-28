const cars = [
  { image: "civic.jpg", model: "Civic", level: 1 },
  { image: "gol.jpg", model: "Gol", level: 1 },
  { image: "celta.jpg", model: "Celta", level: 1 },
  { image: "fusca.jpg", model: "Fusca", level: 1 },
  { image: "polo.jpg", model: "Polo", level: 1 },
  { image: "fiesta.jpg", model: "Fiesta", level: 1 },
  { image: "kwid.jpg", model: "Kwid", level: 1 },
  { image: "corsa.jpg", model: "Corsa", level: 1 },
  { image: "golf.jpg", model: "Golf", level: 1 },
  { image: "focus.jpg", model: "Focus", level: 1 },
  { image: "uno.jpg", model: "Uno", level: 1 },
  { image: "onix.jpg", model: "Onix", level: 1 },
  { image: "sandero.jpg", model: "Sandero", level: 1 },
  { image: "prisma.jpg", model: "Prisma", level: 1 },
  { image: "camaro.jpg", model: "Camaro", level: 1 },
  { image: "voyage.jpg", model: "Voyage", level: 1 },
  { image: "bravo.jpg", model: "Bravo", level: 2 },
  { image: "208.jpg", model: "208", level: 2 },
  { image: "sentra.jpg", model: "Sentra", level: 2 },
  { image: "etios.jpg", model: "Etios", level: 2 },
];

let shuffledCarsByLevel = {};
let currentIndex = 0;
let score = 0;
let timeLeft = 60;
let level = 1;
let timer;
let answered = false;
let selectedOptionIndex = 0;

// DOM Elements
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const finalMessage = document.getElementById("final-message");
const finalScore = document.getElementById("final-score");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const menuBtnGame = document.querySelector("#game-screen #menu-btn");
const menuBtnEnd = document.querySelector("#end-screen #menu-btn");

const img = document.getElementById("car-image");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");
const optionsDiv = document.getElementById("options");

const playerNameInput = document.getElementById("player-name");
const saveScoreBtn = document.getElementById("save-score-btn");
const rankingList = document.getElementById("ranking-list");

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "");
}

function validatePlayerName(name) {
  const bannedWords = [/* lista de palavras proibidas */];
  const maxLength = 15;
  const sanitized = normalizeText(name);
  if (sanitized.length === 0 || sanitized.length > maxLength) return false;
  for (const word of bannedWords) {
    if (sanitized.includes(word)) return false;
  }
  return name.trim();
}

startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextCar);
restartBtn.addEventListener("click", restartGame);
menuBtnGame.addEventListener("click", returnToMenu);
menuBtnEnd.addEventListener("click", returnToMenu);

saveScoreBtn.addEventListener("click", () => {
  const rawName = playerNameInput.value.trim();
  const validName = validatePlayerName(rawName);
  if (!validName) {
    alert("Nome inválido ou não permitido!");
    return;
  }
  saveScore(validName, score);
  mostrarRanking();
  saveScoreBtn.disabled = true;
  playerNameInput.disabled = true;
});

function startGame() {
  currentIndex = 0;
  score = 0;
  level = 1;
  timeLeft = 60;
  answered = false;

  // Embaralha os carros por nível
  shuffledCarsByLevel = {};
  const levels = [...new Set(cars.map(c => c.level))];
  for (const lvl of levels) {
    shuffledCarsByLevel[lvl] = [...cars.filter(c => c.level === lvl)];
    shuffleArray(shuffledCarsByLevel[lvl]);
  }

  scoreDisplay.textContent = `Pontuação: ${score}`;
  levelDisplay.textContent = `Fase: ${level}`;
  timerDisplay.textContent = `⏱️ Tempo: ${timeLeft}s`;
  feedback.textContent = "";

  startScreen.classList.remove("active");
  endScreen.classList.remove("active");
  gameScreen.classList.add("active");

  nextBtn.disabled = true;
  nextBtn.style.display = "inline-block";

  startTimer();
  updateCar();
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱️ Tempo: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame("⏳ Tempo esgotado!");
    }
  }, 1000);
}

function updateCar() {
  const carsByLevel = shuffledCarsByLevel[level];
  if (!carsByLevel || carsByLevel.length === 0) {
    endGame("🚫 Sem carros neste nível.");
    return;
  }

  if (currentIndex >= carsByLevel.length) {
    nextLevel();
    return;
  }

  const currentCar = carsByLevel[currentIndex];
  img.src = currentCar.image;
  img.alt = currentCar.model;
  img.style.display = "block";
  feedback.textContent = "";
  answered = false;

  generateOptions(currentCar.model);
  nextBtn.disabled = true;
  selectedOptionIndex = 0;
  updateOptionHighlight();
}

function generateOptions(correctModel) {
  const popularModels = [
    "Civic", "Gol", "Celta", "Fusca", "Polo", "Fiesta",
    "Corsa", "Kwid", "Uno", "Palio", "Siena", "Prisma",
    "Logan", "Sandero", "HB20", "Onix", "Fox", "Voyage",
    "Up", "Etios", "Classic", "Clio", "Agile", "Bravo",
    "207", "208", "Monza", "Uno", "Prisma", "Sandero",
    "Onix",
  ];

  const wrongModels = popularModels.filter(m => m !== correctModel);
  shuffleArray(wrongModels);
  const options = [correctModel, ...wrongModels.slice(0, 3)];
  shuffleArray(options);

  optionsDiv.innerHTML = "";
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, correctModel);
    optionsDiv.appendChild(btn);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkAnswer(selected, correct) {
  if (answered) return;
  answered = true;

  if (selected === correct) {
    feedback.textContent = "✅ Acertou!";
    feedback.style.color = "#00ff88";
    score++;
    scoreDisplay.textContent = `Pontuação: ${score}`;
  } else {
    feedback.textContent = `❌ Errado! Era: ${correct}`;
    feedback.style.color = "#ff5555";
  }
  nextBtn.disabled = false;
}

function nextCar() {
  currentIndex++;
  updateCar();
}

function nextLevel() {
  level++;
  currentIndex = 0;
  const nextCars = shuffledCarsByLevel[level];
  if (!nextCars || level > 3) {
    endGame("🏁 Você concluiu todas as fases!");
  } else {
    levelDisplay.textContent = `Fase: ${level}`;
    timeLeft = 60;
    startTimer();
    updateCar();
  }
}

function endGame(message) {
  clearInterval(timer);
  feedback.textContent = "";
  img.style.display = "none";
  optionsDiv.innerHTML = "";
  nextBtn.style.display = "none";

  finalMessage.textContent = message;
  finalScore.textContent = `🔝 Pontuação final: ${score}`;

  playerNameInput.value = "";
  playerNameInput.disabled = false;
  saveScoreBtn.disabled = false;

  gameScreen.classList.remove("active");
  endScreen.classList.add("active");

  mostrarRanking();
}

function restartGame() {
  nextBtn.style.display = "inline-block";
  startScreen.classList.add("active");
  gameScreen.classList.remove("active");
  endScreen.classList.remove("active");
}

function returnToMenu() {
  clearInterval(timer);
  startScreen.classList.add("active");
  gameScreen.classList.remove("active");
  endScreen.classList.remove("active");
  img.style.display = "none";
  optionsDiv.innerHTML = "";
  feedback.textContent = "";
  nextBtn.disabled = true;
  nextBtn.style.display = "inline-block";
}

function updateOptionHighlight() {
  const buttons = optionsDiv.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    if (i === selectedOptionIndex) {
      btn.style.backgroundColor = "#27ae60";
      btn.style.outline = "2px solid #fff";
    } else {
      btn.style.backgroundColor = "#2ecc71";
      btn.style.outline = "none";
    }
  });
}

document.addEventListener("keydown", (event) => {
  const buttons = optionsDiv.querySelectorAll("button");
  if (event.key === "Escape") returnToMenu();
  if (event.key === "Enter") {
    if (startScreen.classList.contains("active")) return startGame();
    if (endScreen.classList.contains("active")) return restartGame();
    if (gameScreen.classList.contains("active") && answered && !nextBtn.disabled) return nextCar();
    if (gameScreen.classList.contains("active") && !answered) return buttons[selectedOptionIndex].click();
  }
  if (["ArrowUp", "ArrowDown"].includes(event.key)) {
    if (gameScreen.classList.contains("active") && !answered) {
      if (event.key === "ArrowUp") selectedOptionIndex = (selectedOptionIndex - 1 + buttons.length) % buttons.length;
      if (event.key === "ArrowDown") selectedOptionIndex = (selectedOptionIndex + 1) % buttons.length;
      updateOptionHighlight();
    }
  }
});

function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem("carGuessScores")) || [];
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("carGuessScores", JSON.stringify(scores));
}

function mostrarRanking() {
  const scores = JSON.parse(localStorage.getItem("carGuessScores")) || [];
  rankingList.innerHTML = "";
  if (scores.length === 0) {
    rankingList.innerHTML = "<li>Nenhuma pontuação salva.</li>";
    return;
  }
  scores.slice(0, 5).forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}º - ${entry.name}: ${entry.score} pontos`;
    rankingList.appendChild(li);
  });
}

// Começa com tela inicial
restartGame();

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Exemplo: usar a função para fazer algo exclusivo para iOS
if (isIOS()) {
  console.log("Usuário está em iOS");
  // aqui você pode fazer algo específico para iOS, se precisar
}

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
  { image: "bravo.jpg", model: "Bravo", level: 2 },
  { image: "208.jpg", model: "208", level: 2 },
  { image: "sentra.jpg", model: "Sentra", level: 2 },
  { image: "etios.jpg", model: "Etios", level: 2 },
 //{ image: "level3/koenigsegg.jpg", model: "Koenigsegg", level: 3 },

];

let currentIndex = 0;
let score = 0;
let timeLeft = 120;
let level = 1;
let timer;
let answered = false;
let selectedOptionIndex = 0;

// Elementos DOM
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const finalMessage = document.getElementById("final-message");
const finalScore = document.getElementById("final-score");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const img = document.getElementById("car-image");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");
const optionsDiv = document.getElementById("options");

// Eventos
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextCar);
restartBtn.addEventListener("click", restartGame);

function startGame() {
  currentIndex = 0;
  score = 0;
  level = 1;
  timeLeft = 120;
  answered = false;

  scoreDisplay.textContent = `Pontuação: ${score}`;
  levelDisplay.textContent = `level: ${level}`;
  timerDisplay.textContent = `⏱️ Tempo: ${timeLeft}s`;
  feedback.textContent = "";

  startScreen.classList.remove("active");
  endScreen.classList.remove("active");
  gameScreen.classList.add("active");

  nextBtn.disabled = true;

  startTimer();
  updateCar();
}

function startTimer() {
  clearInterval(timer);
  timerDisplay.textContent = `⏱️ Tempo: ${timeLeft}s`;

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
  const carsByLevel = cars.filter(car => car.level === level);
  if (currentIndex >= carsByLevel.length) {
    nextLevel();
    return;
  }

  const currentCar = carsByLevel[currentIndex];
  img.src = currentCar.image;
  img.style.display = "block";
  feedback.textContent = "";
  answered = false;

  generateOptions(currentCar.model);
  nextBtn.disabled = true;
  selectedOptionIndex = 0;
  updateOptionHighlight();
}

function generateOptions(correctModel) {
  // Lista de nomes populares mais comuns
  const popularModels = [
   "Civic", "Gol", "Celta", "Fusca", "Polo", "Fiesta",
   "Corsa", "Kwid", "Uno", "Palio", "Siena", "Prisma",
   "Logan", "Sandero", "HB20", "Onix", "Fox", "Voyage",
   "Up", "Etios", "Classic", "Clio", "Agile", "Bravo",
   "207", "208", "Monza"
  ];

  // Tira o modelo correto dessa lista
  const wrongModels = popularModels.filter(model => model !== correctModel);

  // Embaralha os errados
  shuffleArray(wrongModels);

  // Monta o array final com o certo + 3 errados
  const options = [correctModel, ...wrongModels.slice(0, 3)];

  // Embaralha tudo de novo para mudar a ordem
  shuffleArray(options);

  // Cria os botões
  optionsDiv.innerHTML = "";
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, correctModel);
    optionsDiv.appendChild(btn);
  });
}

function shuffleArray(array) {
  // Algoritmo de Fisher-Yates (já eficiente)
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
  if (level > 3) {
    endGame("🏁 Você concluiu todas as levels!");
  } else {
    levelDisplay.textContent = `level: ${level}`;
    timeLeft = 120;
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

  gameScreen.classList.remove("active");
  endScreen.classList.add("active");
}

function restartGame() {
  nextBtn.style.display = "inline-block";
  startScreen.classList.add("active");
  gameScreen.classList.remove("active");
  endScreen.classList.remove("active");
}

function updateOptionHighlight() {
  const buttons = optionsDiv.querySelectorAll("button");
  buttons.forEach((btn, index) => {
    if (index === selectedOptionIndex) {
      btn.style.backgroundColor = "#27ae60";
      btn.style.outline = "2px solid #fff";
    } else {
      btn.style.backgroundColor = "#2ecc71";
      btn.style.outline = "none";
    }
  });
}

// Embaralha um array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.addEventListener("keydown", (event) => {
  const buttons = optionsDiv.querySelectorAll("button");

  if (event.key === "Enter") {
    if (startScreen.classList.contains("active")) {
      startGame();
      return;
    }

    if (endScreen.classList.contains("active")) {
      restartGame();
      return;
    }

    if (gameScreen.classList.contains("active") && answered && !nextBtn.disabled) {
      nextCar();
      return;
    }

    if (gameScreen.classList.contains("active") && !answered && buttons.length > 0) {
      buttons[selectedOptionIndex].click();
      return;
    }
  }

  if (gameScreen.classList.contains("active") && buttons.length > 0 && !answered) {
    if (event.key === "ArrowDown") {
      selectedOptionIndex = (selectedOptionIndex + 1) % buttons.length;
      updateOptionHighlight();
    } else if (event.key === "ArrowUp") {
      selectedOptionIndex = (selectedOptionIndex - 1 + buttons.length) % buttons.length;
      updateOptionHighlight();
    } else if (event.key === " ") {
      buttons[selectedOptionIndex].click();
    }
  }
});



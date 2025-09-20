let startScreen = document.getElementById("startScreen");

//! create board & bird
let board = document.getElementById("board"); 
let bird = document.createElement("div");
bird.className = "bird";
board.appendChild(bird);

//!sounds
let jump=new Audio("./sounds/wing.mp3")
let background=new Audio("./sounds/background.mp3")
let die=new Audio("./sounds/die.mp3")
let point= new Audio("./sounds/point.mp3")

background.volume=0.4;
background.loop=true;
//! score
let score = 0;
let scoreDisplay = document.createElement("div");
scoreDisplay.id = "score";
scoreDisplay.textContent = "Score: " + score;
board.appendChild(scoreDisplay);

//! restart button
let restartBtn = document.createElement("button");
restartBtn.id = "restartBtn";
restartBtn.textContent = " oops ! game over  click to Restart";
restartBtn.style.display = "none";   // ✅ hide initially
board.appendChild(restartBtn);
background.play()

//! bird position
let birdTop = 200;   
let gravity = 2;     
let gameOver = false;


// Pause intervals initially
// let gravityInterval;
// let pipeGenerator;

//! start game
function startGame() {
  // Start background music
  background.play();

  // Start gravity and pipe generation
  gravityInterval = setInterval(applyGravity, 20);
  pipeGenerator = setInterval(createPipe, 2000);

  // Hide start screen
  startScreen.style.display = "none";
}

// Listen for click on start screen
startScreen.addEventListener("click", startGame);



//! gravity loop
// let gravityInterval = setInterval(applyGravity, 20);

function applyGravity() {
  if (gameOver) return;
  birdTop += gravity;                
  bird.style.top = birdTop + "px";   
  
  // check ground/top hit
  if (birdTop >= 470 || birdTop <= 0) {
    endGame();
  }
}

//! jump
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameOver) {
    birdTop -= 40; 
    if (birdTop < 0) birdTop = 0;
    bird.style.top = birdTop + "px";
    jump.play()
  }
});

//! pipes

function createPipe() {
  if (gameOver) return;

  let pipeGap = 40; 
  let pipeHeight = Math.floor(Math.random() * 200) + 50;

  let topPipe = document.createElement("div");
  topPipe.className = "pipe";
  topPipe.style.height = pipeHeight + "px";
  topPipe.style.left = "400px";
  topPipe.style.top = "0px";

  let bottomPipe = document.createElement("div");
  bottomPipe.className = "pipe";
  bottomPipe.style.height = (500 - pipeHeight - pipeGap) + "px";
  bottomPipe.style.left = "400px";
  bottomPipe.style.bottom = "0px";

  board.appendChild(topPipe);
  board.appendChild(bottomPipe);

  let passed = false; // track if bird passed the pipe

  let pipeInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(pipeInterval);
      return;
    }

    let topX = parseInt(topPipe.style.left);
    let bottomX = parseInt(bottomPipe.style.left);

    if (topX <= -60) { 
      if (board.contains(topPipe)) board.removeChild(topPipe);
      if (board.contains(bottomPipe)) board.removeChild(bottomPipe);
      clearInterval(pipeInterval);
    } else {
      topPipe.style.left = (topX - 2) + "px";
      bottomPipe.style.left = (bottomX - 2) + "px";

      // check collision
      let birdRect = bird.getBoundingClientRect();
      let topRect = topPipe.getBoundingClientRect();
      let bottomRect = bottomPipe.getBoundingClientRect();

      if (isCollide(birdRect, topRect) || isCollide(birdRect, bottomRect)) {
        endGame();
      }

      // ✅ increase score when pipe passes bird
      if (!passed && topX + 60 < bird.offsetLeft) {
        score++;
        scoreDisplay.textContent = "Score: " + score;
        passed = true;
        point.play()
      }
    }
  }, 20);
  
}

//! collision check
function isCollide(rect1, rect2) {
  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}

//! end game
function endGame() {
  gameOver = true;
  restartBtn.style.display = "block"; // show restart button
  background.pause()
  die.play()
}

//! restart function
restartBtn.addEventListener("click", () => {
  // reset
  birdTop = 200;
  bird.style.top = birdTop + "px";

  // remove pipes
  let pipes = document.querySelectorAll(".pipe");
  pipes.forEach(pipe => board.removeChild(pipe));

  // reset score
  score = 0;
  scoreDisplay.textContent = "Score: " + score;

  gameOver = false;
  restartBtn.style.display = "none"; // hide button
  background.play()
});



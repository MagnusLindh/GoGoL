//GAME RULES:
//1. Birth Rule: If has 3 neighbors cells alive, create a new cell;
//2. Death Rule: A cell dies if has >=1 or <=4 neighbors;
//3. Survival Rule: A cell survives only if has 2 or 3 neighbors alive.

//BONUS RULE:
//4. Genetics Rule: The genetic setup of a cell is the mean of its neighbours genes.

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#board");
  const ctx = canvas.getContext("2d");

  const GRID_WIDTH = 600;
  const GRID_HEIGHT = 600;
  const RES = 5;
  const COL = GRID_WIDTH / RES;
  const ROW = GRID_HEIGHT / RES;

  canvas.width = GRID_WIDTH;
  canvas.height = GRID_HEIGHT;

  const MAX_SPEED = RES;
  const MAX_SCORE = 150;
  const MIN_SCORE = 25;
  const START_SCORE = 50;

  var score = START_SCORE;
  var player = new component(score, "#ffb000", 10, 120);

  // Detect arrow buttons
  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 37:
        moveleft();
        break;
      case 38:
        moveup();
        break;
      case 39:
        moveright();
        break;
      case 40:
        movedown();
        break;
      case 82:
        location.reload();
        break;
    }
  };

  // Detect collisions and update score and player size
  function collisions() {
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        const currentCell = grid[col][row];
        if (currentCell>0){
          let x = col*RES + RES/2;
          let y = row*RES + RES/2;       
          if (x > player.x && x < player.x+player.width && y > player.y && y < player.y+player.height){
            if (currentCell<0.5){
              score++;
            } else {
              score--;
            }
            player.width = Math.sqrt(score);
            player.height = Math.sqrt(score);
            grid[col][row]=0;
          }
        }
      }
    }
  }

  // constructor for the player
  function component(score, color, x, y) {
    this.width = Math.sqrt(score);
    this.height = Math.sqrt(score);
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;    
    this.update = function() {
        //ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
      this.x = Math.max(0, Math.min(this.x + this.speedX, GRID_WIDTH - this.width));
      this.y = Math.max(0, Math.min(this.y + this.speedY, GRID_HEIGHT - this.height));
    }    
  }

  //Making a grid and filling with 0 or 1
  function createGrid(cols, rows) {
    return new Array(cols)
      .fill(null)
      .map(() =>
        //new Array(rows).fill(null).map(() => Math.round(Math.random()))
        new Array(rows).fill(null).map(() => Math.random()*Math.round(Math.random()))
      );
  }

  //Generate nex generation
  function nextGen(grid) {
    const nextGen = grid.map((arr) => [...arr]); //make a copy of grid with spread operator

    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        const currentCell = grid[col][row];
        let sumNeighbors = 0; //to verify the total of neighbors
        let sumColors = 0;

        //Verifying the 8 neigbours of current cell
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) {
              continue; // because this is the current cell's position
            }

            const x = col + i;
            const y = row + j;

            if (x >= 0 && y >= 0 && x < COL && y < ROW) {
              const currentNeighbor = grid[col + i][row + j];
              sumNeighbors += (currentNeighbor>0);
              sumColors += currentNeighbor;
            }
          }
        }

        //Aplying rules
        if (currentCell === 0 && sumNeighbors === 3) {
          nextGen[col][row] = sumColors/sumNeighbors; //the mean color
        } else if (
          currentCell > 0 &&
          (sumNeighbors < 2 || sumNeighbors > 3)
        ) {
          nextGen[col][row] = 0;
        }
      }
    }
    return nextGen;
  }

  //Draw cells on canvas
  function drawGrid(grid, cols, rows, resolution) {
    ctx.clearRect(0, 0, cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cell = grid[i][j];
        if (cell==0){
          ctx.fillStyle = "#000000";
        } else {
          ctx.fillStyle = cell < 0.5 ? "#648FFF" : "#DC267F";
        }
        ctx.fillRect(i * resolution, j * resolution, resolution, resolution);
      }
    }
  }

  // Draw score bar on screen
  function drawScore(){
    if (score>START_SCORE){
      ctx.fillStyle = "#785EF0";
    } else {
      ctx.fillStyle = "#FE6100";
    }
    ctx.fillRect(0,0,(score-MIN_SCORE)*GRID_WIDTH/(MAX_SCORE-MIN_SCORE),10);
  }
  function drawText(){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    ctx.fillText("GoGoL by Magnus Lindh          arrow keys to steer, r to restart", 20, GRID_HEIGHT-20);
  }

  // Win and loose conditions
  function gameOver(){
    if (score<MIN_SCORE){
      alert("You loose!");
      location.reload();
    }

    if (score>MAX_SCORE){
      alert("You win!");
      location.reload();
    }
  }

  function moveup() {
    if (player.speedY>-MAX_SPEED){
      player.speedY -= 1;
    } 
  }

  function movedown() {
    if (player.speedY<MAX_SPEED){
      player.speedY += 1; 
    }
  }

  function moveleft() {
    if (player.speedX>-MAX_SPEED){
      player.speedX -= 1; 
    }
  }

  function moveright() {
    if (player.speedX<MAX_SPEED){
      player.speedX += 1; 
    }
  }

  function TuneGenerator() {    
    
    const notesGenerator = new NotesGenerator();

    setInterval(function() {
        notesGenerator.playNote(3);
    }, 800);
 
    setInterval(function() {
        notesGenerator.playNote(0);
    }, 4200);
}

  function NotesGenerator() {

    const context = new AudioContext();

    // Choose the importance of each note. Notes with a 0 probability won't be played
    const nextNote = distribution( {131:2, 139:0, 147:1, 156:0, 165:2, 175:1, 185:0, 196:2, 208:0, 220:1, 233:0, 247:1,
                                 262:2, 277:0, 294:1, 311:0, 330:2, 349:1, 370:0, 392:2, 415:0, 440:1, 466:0, 496:1} )

    // The factor determines the octave
    // Choose the importance of each factor
    const nextFac = distribution( {'-1':2,'0':2, '1':2, '2':1, '3':0 } );

    this.playNote = function(maxFactor) {
        const oscillator = context.createOscillator();

        const waveForm = Math.random() > 0.5 ? "sine" : "triangle";
        oscillator.type = waveForm;        

        let fac = parseInt(nextFac());
        while(fac > maxFactor)
            fac = parseInt(nextFac());

        oscillator.frequency.value = parseInt(nextNote()) * Math.pow(2, fac );

        const gainNode = context.createGain();
        gainNode.gain.value = .2;
        
        // generate sound
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(0);
        
        const duration = getRandomInt(2, 6);

        gainNode.gain.linearRampToValueAtTime(0.0001, context.currentTime + duration);
        oscillator.stop(context.currentTime + duration);
    }

    /**
     * takes an object that maps his keys to probabilities (or counts)
     * returns a function that returns one of the keys with that discrete distribution
     */
    function distribution(obj) {
        const o = normalizedObj(obj);

        return function() {
            let count = 0;
            const rand = Math.random();
            
            for(let key in o) {
                count += o[key];
                
                if(rand < count)
                    return key;
            }
        }
    }

    /**
     * takes an object that maps his keys to probabilities (or counts) and normalize each probability
     */
    function normalizedObj(obj) {
        var normalizedObj = {};
        var sum = 0;

        for(key in obj)
            sum += obj[key];

        for(key in obj)
            normalizedObj[key] = obj[key] / sum;

        return normalizedObj;
    }

    function getRandomInt(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
  }

  // The game loop
  function update() {
    grid = nextGen(grid);
    drawGrid(grid, COL, ROW, RES);
    drawScore();
    drawText();
    gameOver();
    player.newPos();    
    player.update();
    collisions();
    setTimeout(function()
    {
      requestAnimationFrame(update)
    }, 100);
  }

  let grid = createGrid(COL, ROW);
  requestAnimationFrame(update); //start game loop
  TuneGenerator();
});

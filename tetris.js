const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

let gameOver = false;

let gameInterval = null;

let played = false;

let isLock = false;
ctx.scale(BLOCK_SIZE,BLOCK_SIZE);

overlay = document.querySelector('.overlay');
nameBox = document.getElementById("playerName");
submitScoreBtn = document.getElementById("submitScoreBtn");
let currentShapeArray = [];

const SHAPES = {
    T:[
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    L:[
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    J:[
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    I:[
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ],
    Z:[
        [1,1,0],
        [0,1,0],
        [0,1,1]
    ],
    S:[
        [0,1,1],
        [0,1,0],
        [1,1,0]
    ]
}


async function  submitScore(){


    const playerName = nameBox.value.trim();

    const playerScore = {
        userSignature: playerName || "Anonymous",
        score: score

    };
    try{
        const response = await fetch("https://api.kulikovskii.me/api/scores",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(playerScore)
        });
        if(response.ok){
            const savedScore = await response.json();

            console.log("Saved: ",savedScore);

        } else {
            
        }}
        catch(error){
            console.error("Error",error);
            
        }

}

//create the board 2d array
let board = [];
function createEmptyBoard(){
    for (let r = 0; r <ROWS;r++){
    board[r] = [];
    for(let c = 0; c < COLS; c++){
        board[r][c] = 0;
    }
}

}
createEmptyBoard();

let currentShapeMatrix;

//generate a block
function generateShape(){
    const keys = Object.keys(SHAPES);
    const randomKey = keys[Math.floor(Math.random()*keys.length)];
    const shapeMatrix = SHAPES[randomKey];
    currentShapeMatrix = shapeMatrix.map(row => row.slice());


    currentShapeArray =[];

    let location = Math.floor(COLS/2) - Math.floor(shapeMatrix[0].length /2);


    fillArrayFromMatrix(shapeMatrix,currentShapeArray,location,0);


}


function  fillArrayFromMatrix(matrix,array,col,row){
    for( let r = 0; r < matrix.length;r++){
        for(let c = 0; c < matrix[r].length; c++){
            if(matrix[r][c] ==1){
                let  block = {row:r +row,col:c + col,color:"#606060"};
                array.push(block);
            }
        }

    }

}


function flip90(){
    let flippedMatrix = currentShapeMatrix[0].map((val, index) =>
        currentShapeMatrix.map(row => row[index]).reverse());



    let flippedShapeArray = [];

    fillArrayFromMatrix(flippedMatrix,flippedShapeArray,currentShapeArray[0].col -1,currentShapeArray[0].row - 1);

    if(checkMove(flippedShapeArray,0,0)){
        currentShapeMatrix = flippedMatrix;
        currentShapeArray = flippedShapeArray;
    }

}

let score = 0;
const ScoreBoard = document.getElementById("score");




function drawBlock(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,1,1);

    ctx.strokeStyle = "#555"; // lighter grey
    ctx.lineWidth = 0.05;     // make the lines thinner
    ctx.strokeRect(x, y, 1, 1);

}

//renders the board
function drawBoard(){
    for(let r = 0; r<ROWS; r++){
        for (let c =0; c<COLS;c++){
            let cell = board[r][c];
            drawBlock(c,r,cell ? cell: "#e3e3e3");//whiteout color
        }
    }
    for(let block of currentShapeArray){
        drawBlock(block.col, block.row, block.color);

    }
}

function checkMove(shapeArray,x,y){
    for(let block of shapeArray){
        let newRow = block.row + y;
        let newCol = block.col +x;

        if(newCol < 0 || newCol >= COLS){
            return false;
        }
        if(newRow >= ROWS){
            return false;
        }
        if(newRow >= 0 && board[newRow][newCol] !==0){
            return false;
        }

    }
    return true;
}



//assume row is full until proven otherwise
function clearFullRows() {
    let rowsCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        let isFull = true;
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 0) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            board.splice(r, 1);
            // Add a new empty row to top
            board.unshift(new Array(COLS).fill(0));

            r++;
            rowsCleared ++;
        }

    }
    score += rowsCleared === 1 ? 40:
        rowsCleared === 2 ? 100:
            rowsCleared === 3? 300:
                rowsCleared === 4? 1200 : 0;
    updateScore();
}

function updateScore(){
    ScoreBoard.textContent = "Score: "+ score.toString();
    if(gameOver){
        ScoreBoard.textContent = "Press to Restart";
        overlay.textContent = "Game Over Score:" + score.toString();
        played = true;
        overlay.style.display = "flex";
        nameBox.style.display = "flex";
        submitScoreBtn.style.display = "flex";
        clearInterval(gameInterval);
        
        gameInterval = null;
    }

}
function moveShape(moveAllowed,x,y){
    if(!moveAllowed){
        for(let block of currentShapeArray){
            board[block.row][block.col] = "#282828";
        }
        currentShapeArray = [];
        clearFullRows();
        return;


    }
    for (let i = 0;i < currentShapeArray.length;i++){
        let {row,col, color } = currentShapeArray[i];
        currentShapeArray[i] = {row:row+y, col:col +x,color}
    }



}

//game update loop
function update(){
    if(currentShapeArray.length> 0){
        if(checkMove(currentShapeArray,0,1)){
            moveShape(true,0,1);
        }
        else{
            moveShape(false,0,0);
        }
    }
    else{
        if(!gameOver){
            generateShape()}

        if(!checkMove(currentShapeArray,0,1)){
            gameOver = true;
            
            
        }
        
    }
}

function handleKeyDown(event){
    if(currentShapeArray.length === 0)return;

    if(event.key == "w" || event.key == "W"){
        flip90();
    }


    if (event.key =="a" || event.key == "A"){
        if (checkMove(currentShapeArray,-1,0)){
            moveShape(true,-1,0);
        }

    }
    if (event.key =="d" || event.key == "D"){
        if(checkMove(currentShapeArray,1,0)){
            moveShape(true,1,0);

        }

    }
    if (event.key =="s" || event.key =="S"){
        if(checkMove(currentShapeArray,0,1)){
            moveShape(true,0,1);
        }
    }
    if(event.key =="r" || event.key =="R"){
        startGame();
    }



}

document.getElementById("leftBtn").addEventListener("click", () => {
  if (checkMove(currentShapeArray, -1, 0)) {
    moveShape(true, -1, 0);
  }
});

document.getElementById("rightBtn").addEventListener("click", () => {
  if (checkMove(currentShapeArray, 1, 0)) {
    moveShape(true, 1, 0);
  }
});

document.getElementById("spinBtn").addEventListener("click", () => {
  flip90();
});




document.addEventListener("keydown",handleKeyDown);


function startGame(){
    if(gameInterval == null){
        if(played){
            
        }
        gameOver = false;
        score = 0;
        createEmptyBoard();
        currentShapeArray = [];
        updateScore();
        generateShape();
        overlay.style.display = "none";
        nameBox.style.display = "none";
        submitScoreBtn.style.display = "none";  
        
        
        
        gameInterval = setInterval(gameLoop,350);
    }
}

function gameLoop(){
    update();
    if(gameOver){
        drawBoard();
        
        return;
    }
    drawBoard();
}

document.getElementById("submitScoreBtn").addEventListener("click",()=>{
    submitScore();
})

//sets the interval in at which update loop runs(how often blocks move one row down)
document.getElementById("score").addEventListener("click",()=>{
    startGame();
})




const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

let isLock = false;
ctx.scale(BLOCK_SIZE,BLOCK_SIZE);


let currentShapeArray = [];

const SHAPES = {
    T:[
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    L:[
        [1,0,0],
        [1,0,0],
        [1,1,0]
    ],
    I:[
        [1,0,0],
        [1,0,0],
        [1,0,0]
    ],
    Z:[
        [1,1,0],
        [0,1,0],
        [0,1,1]
    ]
}


//create the board 2d array
let board = [];
for (let r = 0; r <ROWS;r++){
    board[r] = [];
    for(let c = 0; c < COLS; c++){
        board[r][c] = 0;
    }
}

let currentShapeMatrix;

//generate a block
function generateShape(){
    const keys = Object.keys(SHAPES);
    const randomKey = keys[Math.floor(Math.random()*keys.length)];
    const shapeMatrix = SHAPES[randomKey];
    currentShapeMatrix = shapeMatrix.map(row => row.slice());

    //let location = 3;
    //let shapeXSize = 3;
    //Math.floor(Math.random()*3);
    currentShapeArray =[];

    let location = Math.floor(COLS/2) - Math.floor(shapeMatrix[0].length /2);


    fillArrayFromMatrix(shapeMatrix,currentShapeArray,location,0);


}


function  fillArrayFromMatrix(matrix,array,col,row){
    for( let r = 0; r < matrix.length;r++){
        for(let c = 0; c < matrix[r].length; c++){
            if(matrix[r][c] ==1){
                let  block = {row:r +row,col:c + col,color:"red"};
                array.push(block);
            }
        }

    }

}


function flip90(){
    let flippedMatrix = currentShapeMatrix[0].map((val, index) =>
        currentShapeMatrix.map(row => row[index]).reverse());



    let flippedShapeArray = [];
    fillArrayFromMatrix(flippedMatrix,flippedShapeArray,currentShapeArray[0].col-1,currentShapeArray[0].row -1);

    if(checkMove(flippedShapeArray,0,0)){
        currentShapeMatrix = flippedMatrix;
        currentShapeArray = flippedShapeArray;
    }

}
// function generateBlock(index){
//     currentBlock = {row:0, col: index, color:"red"}
//     board[0][index] = "red";
//     return{...currentBlock};
// }

//function generateShapeLocation(){
//    return Math.floor(Math.random()* COLS);}


//unused for now(score system)
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
            drawBlock(c,r,cell ? cell: "black");
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

            r++; // re-check the same row index (since everything shifted down)
        }
    }
}
function moveShape(moveAllowed,x,y){
    if(!moveAllowed){
        for(let block of currentShapeArray){
            board[block.row][block.col] = "green";
        }
        currentShapeArray = [];
        clearFullRows();
        return;


        //board[row][col] = "green";
        //currentShapeArray.splice(i,1);

    }
    for (let i = 0;i < currentShapeArray.length;i++){
        let {row,col, color } = currentShapeArray[i];
        currentShapeArray[i] = {row:row+y, col:col +x,color}
    }

    // board[row][col] = 0;
    // board[row+y][col+x] = color;
    // currentBlock = {row:row +y,col:col +x,color};
    // currentShapeArray[i] = currentBlock;


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
        generateShape()
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


}

document.addEventListener("keydown",handleKeyDown);



function gameLoop(){
    update();
    drawBoard();
}



//sets the interval in at which update loop runs(how often blocks move one row down)
setInterval(gameLoop, 350);



const FOREGROUND = "#606060";
const BACKGROUND = "#e3e3e3";

const viewport = document.getElementById("viewport");
viewport.width = 400
viewport.height = 400
const ctx1 = viewport.getContext("2d");





function clear(){
    ctx1.fillStyle = BACKGROUND
    ctx1.fillRect(0,0,viewport.width, viewport.height)
}

function screen(p){

    return{
        x: (p.x +1)/2*viewport.width,
        y:(1-(p.y +1)/2)*viewport.height,
    }
     

}

function project({x,y,z}){
    return{
        x: x/z,
        y: y/z,
    }
}

function point({x,y}){
    const s = 3;
    ctx1.fillStyle = FOREGROUND
    ctx1.fillRect(x,y,s,s)
}



function translate_z({x,y,z},zOffset){
    return {x,y,z:z +zOffset};
}
const vertexDistance = 0.4;



let verticies = [];
let edges = [];


let zOffset = 1;
const FPS = 60;
let direction = "down";

directionArr = ["left","right","up","down"];


function rotate_xz({x,y,z},angle,direction){
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = Math.tan(angle);
    
    if(direction == "right"){
        return{
            x: x*c - z*s,
            y, //y remains the same because this is sideways rotation
            z: x*s + z*c,
        }
    }
    else if(direction == "left"){
        return{
            x: x*s + z*c,
            y, 
            z: x*c - z*s,
        }

    }
    else if (direction =="up"){
        return{
            x,
            y: y*c - z*s,
            z: y*s + z*c,
        }
    
    }
    else if(direction == "down"){
        return{
            x,
            y: y*s + z*c,
            z: y*c - z*s,
        }
    }


    

}

let angle = 0;

function line(p1,p2){
    ctx1.lineWidth = 1;
    ctx1.strokeStyle = FOREGROUND;
    ctx1.beginPath();
    ctx1.moveTo(p1.x,p1.y);
    ctx1.lineTo(p2.x,p2.y);
    ctx1.stroke();

}

function frame(){
    const deltaTime= 1/FPS;
    //zOffset +=1 *deltaTime;
    angle += Math.PI*deltaTime/4; //1rps
    clear()

    
    for(const vertex of verticies){
        point(screen(project(translate_z(rotate_xz(vertex,angle,direction),zOffset))));
    }
    for(const [i,j] of edges){
        
            const a = verticies[i];
            const b = verticies[j];

            line(
                screen(project(translate_z(rotate_xz(a,angle,direction),zOffset))),
                screen(project(translate_z(rotate_xz(b,angle,direction),zOffset)))
            );

        
    }
    setTimeout(frame,1000 /FPS);
}

setTimeout(frame,1000 /FPS);

let directionArrIndex = 0;
function changeDirection(){
    

    directionArrIndex = (directionArrIndex +1)%directionArr.length;
    direction = directionArr[directionArrIndex];
    
}

function changeVerticies(){
    
}


document.getElementById("viewport").addEventListener("click",()=>{
    changeDirection();
    
    
})


let canvasX = document.getElementById("plotting_grid_x");



const ctxX = canvasX.getContext("2d");



const ROWS = 10;
const COLS = 10;
const CELL_SIZE = 20;
canvasX.width = COLS * CELL_SIZE;
canvasX.height = ROWS * CELL_SIZE;

ctxX.scale(CELL_SIZE,CELL_SIZE);




let gridX = [];
// let gridY = [];
// let gridZ = [];
function createEmptyGrid(grid){
    for (let r = 0; r <ROWS;r++){
    grid[r] = [];
    for(let c = 0; c < COLS; c++){
        grid[r][c] = 0;
    }
}

}

createEmptyGrid(gridX);


function drawCell(x,y,color,ctx){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,1,1);

    ctx.strokeStyle = "#555";
    ctx.lineWidth = 0.05;
    ctx.strokeRect(x, y, 1, 1);

}



function drawGrid(grid,ctx){
    for(let r = 0; r<ROWS; r++){
        for (let c =0; c<COLS;c++){
            let cell = grid[r][c];
            if(cell == 1){
                drawCell(c,r,"#101010",ctx);
        

            } else {
                drawCell(c,r, "#e3e3e3",ctx);
                
            }       
        }
    }
}



drawGrid(gridX,ctxX);



function ExportGridData(){
    
    let data_container = {
        
        verticies,
        edges,
        gridX
        //maybe add color later
    }
     document.getElementById("array_paste_area").value = JSON.stringify(data_container,null,2);
    
}

function ImportGridData(){
    paste_area_text = document.getElementById("array_paste_area").value;
    extracted_data = JSON.parse(paste_area_text);
    gridX = extracted_data.gridX;
    verticies = extracted_data.verticies;
    edges = extracted_data.edges;
    drawGrid(gridX,ctxX);
}

function PlacePoint(canvas,grid,ctx,event){
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    
    let col = Math.floor(mouseX / CELL_SIZE);
    let row = Math.floor(mouseY / CELL_SIZE);

    
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
        return;
    }

    if (grid[row][col] !=0) {
        grid[row][col] = 0;
    } else {
        grid[row][col] = 1;
        AddToArray(gridX,row,col);


    }
    drawGrid(grid,ctx);
}



function startConfig(){
    document.getElementById("array_paste_area").value = `{
  "verticies": [
    {"x":-0.5,"y":-0.3,"z":0},{"x":-0.5,"y":-0.3,"z":-0.3},
    {"x":-0.5,"y":0.1,"z":0},{"x":-0.5,"y":0.1,"z":-0.3},
    {"x":0.1,"y":0.1,"z":0},{"x":0.1,"y":0.1,"z":-0.3},
    {"x":0.1,"y":0.5,"z":0},{"x":0.1,"y":0.5,"z":-0.3},
    {"x":0.7,"y":-0.1,"z":0},{"x":0.7,"y":-0.1,"z":-0.3},
    {"x":0.1,"y":-0.7,"z":0},{"x":0.1,"y":-0.7,"z":-0.3},
    {"x":0.1,"y":-0.3,"z":0},{"x":0.1,"y":-0.3,"z":-0.3},
    {"x":-0.5,"y":-0.3,"z":0},{"x":-0.5,"y":-0.3,"z":-0.3}
  ],
  "edges": [
    [0,1],[2,3],[0,2],[1,3],[4,5],[2,4],[3,5],
    [6,7],[4,6],[5,7],[8,9],[6,8],[7,9],
    [10,11],[8,10],[9,11],[12,13],[10,12],
    [11,13],[14,15],[12,14],[13,15]
  ],
  "gridX": [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ]
}
`
    ImportGridData()

}

function Reset(){
    
    createEmptyGrid(gridX);
    
    verticies = [];
    edges = [];
    previousFrontVrtx = null;
    previousBackVrtx = null;
    document.getElementById("array_paste_area").value = "";

    
}





let previousFrontVrtx = null;
let previousBackVrtx = null;

function AddToArray(grid,r,c){
    let rowVal = ((r+0.5)-5)/5;
    let colVal = ((c+0.5)-5)/5;

    let frontVrtx = verticies.length
    verticies.push({x:rowVal,y:colVal,z:0});

    let backVrtx = verticies.length
    verticies.push({x:rowVal,y:colVal,z:-0.3});
        
    edges.push([frontVrtx, backVrtx]);
    
    if (previousFrontVrtx !== null) {
        edges.push([previousFrontVrtx, frontVrtx]);
        edges.push([previousBackVrtx, backVrtx]);
    }
    previousFrontVrtx = frontVrtx;
    previousBackVrtx =  backVrtx;

    

    
    
}

function GridToVertex(grid){
    verticies = [];
    edges = [];
    let previousVrtx = null;
    for(let r = 0; r < grid.length; r++){
        for(let c = 0; c < grid[r].length; c++){
            
            if(grid[r][c] === 1){
            let rowVal = ((r+0.5)-5)/5;//row
            let colVal = ((c+0.5)-5)/5;//colum
            

            
            let edgeIndex = verticies.length;
            verticies.push({x:rowVal,y:colVal,z:0})
            verticies.push({x:rowVal,y:colVal,z:-0.5})
            edges.push([edgeIndex,edgeIndex+1])
            if(previousVrtx!= null){
                edges.push([previousVrtx,edgeIndex])
            }
            previousVrtx = edgeIndex;
            }
        }
        
    }

    document.getElementById("array_paste_area").value = "[" + verticiesArr + "]";
    

}

canvasX.addEventListener("click", e=>{
    

    PlacePoint(canvasX,gridX,ctxX,e);
    ExportGridData();
    //GridToVertex(gridX);

})


startConfig();
document.getElementById("grid_reset_btn").addEventListener("click" ,()=>{
    Reset();
    drawGrid(gridX,ctxX);
    
})

document.getElementById("grid_import_btn").addEventListener("click",()=>{
    ImportGridData();
});
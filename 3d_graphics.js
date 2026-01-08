// const BACKGROUND = "#101010"
// const FOREGROUND = "#50FF50"

const FOREGROUND = "#606060";
const BACKGROUND = "#e3e3e3";

const game = document.getElementById("game");
game.width = 400
game.height = 400
const ctx1 = game.getContext("2d");





function clear(){
    ctx1.fillStyle = BACKGROUND
    ctx1.fillRect(0,0,game.width, game.height)
}
//need to convert js/html canvas coordinates to conform to standard plotting conventions
//this is the conversion function to do that
function screen(p){

    return{
        x: (p.x +1)/2*game.width,
        y:(1-(p.y +1)/2)*game.height,
    }
     

}

function project({x,y,z}){
    return{
        x: x/z,
        y: y/z,
    }
}

function point({x,y}){
    const s = 6;
    ctx1.fillStyle = FOREGROUND
    ctx1.fillRect(x,y,s,s)
}



function translate_z({x,y,z},zOffset){
    return {x,y,z:z +zOffset};
}
const vertexDistance = 0.4;

const verticies = [
    {x :vertexDistance, y:vertexDistance,z: vertexDistance},
    {x :-vertexDistance, y:vertexDistance,z: vertexDistance},
    {x :-vertexDistance, y:-vertexDistance,z: vertexDistance},
    {x :vertexDistance, y:-vertexDistance,z: vertexDistance},

    {x :vertexDistance, y:vertexDistance,z: -vertexDistance},
    {x :-vertexDistance,y:vertexDistance,z: -vertexDistance},
    {x :-vertexDistance,y:-vertexDistance,z:-vertexDistance},
    {x :vertexDistance, y:-vertexDistance,z:-vertexDistance},
]

const faces = [

    [0,1,2,3],
    [4,5,6,7],
    [0,4],
    [1,5],
    [2,6],
    [3,7],

]

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
    ctx1.lineWidth = 3;
    ctx1.strokeStyle = FOREGROUND;
    ctx1.beginPath();
    ctx1.moveTo(p1.x,p1.y);
    ctx1.lineTo(p2.x,p2.y);
    ctx1.stroke();

}

function frame(){
    const deltaTime= 1/FPS;
    //zOffset +=1 *deltaTime;
    angle += Math.PI*deltaTime/2; //1rps
    clear()

    // vertex rendering, looks better without it 
    // for(const vertex of verticies){
    //     point(screen(project(translate_z(rotate_xz(vertex,angle,direction),zOffset))));
    // }
    for(const face of faces){
        for(let i = 0; i< face.length; ++i){
            const a = verticies[face[i]];
            const b = verticies[face[(i+1)%face.length]];
            line(screen(project(translate_z(rotate_xz(a,angle,direction),zOffset))),
            screen(project(translate_z(rotate_xz(b,angle,direction),zOffset))));

        }
    }
    setTimeout(frame,1000 /FPS);
}

setTimeout(frame,1000 /FPS);

let directionArrIndex = 0;
function changeDirection(){
    //const b = verticies[face[(i+1)%face.length]];

    directionArrIndex = (directionArrIndex +1)%directionArr.length;
    direction = directionArr[directionArrIndex];
    
}

//TODO!!
//change direction when clicking cube

document.getElementById("game").addEventListener("click",()=>{
    changeDirection();
    
    
})
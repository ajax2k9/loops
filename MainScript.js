let level
let levelIdx = 0;
let wps = {}
let balls = []
let bkdImg;
let buttons =[];
let bkgdColor; 
let moveTimer = 0;
let moveInProgress = false;
let activeType = -1;
let levels = []
let turnsUI;
let segundo;
let segundoBold;
let logo;
let turns = 0;
let levelComplete;
let levelNum = 0;
let frametime = 0;
let userJSON;
let arrowRPNG;
let arrowLPNG;
let redoPNG;
let starPNG;
let starPNG2;
let redoButton;
p5.disableFriendlyErrors = true;

let canvas;
let recording= false;
let versionInfo="0.1.1"

let capturer = new CCapture( { format: 'webm',name:"test_video", framerate: 30,
verbose: true } );
let startStop = false;

class point {
     constructor(x, y) {
          this.x = x;
          this.y = y;
     }
}

function setup(){
     createCanvas(800,950);
     canvas = document.getElementById("defaultCanvas0")
     redoButton = new RedoButton(150,200,70);    
     bkgdColor = color(255,200,100);
     loadLevel(levelIdx)
     turnsUI = new TurnsUI(850,color(100))
     levelComplete = new LevelComplete(width/2,450); 
}

function loadLevel(index){
     localStorage.setItem("level_index",levelIdx)
     turns = 0;
     ClearButtons();
     let levelJSON = levels[index]
     level = new Level(levelJSON.w,levelJSON.h,levelJSON.swaps)
     levelJSON.tracks.forEach(t=>{
          level.AddTrack(t[0],t[1],t[2],t[3])

     })
     level.LoadBalls(levelJSON.balls);
     redoButton.active = true;
}
    
function preload() {
     
     for(let i = 0; i < 25; i++){
          levels.push(loadJSON("levels/level_"+i+".json"))
     }

     segundo = loadFont("assets/LABTSECS.ttf")
     segundoBold = loadFont("assets/LABTSECB.ttf")
     logo = loadImage("assets/loopslogo.png",100,50)
     arrowRPNG = loadImage("assets/arrow.png",100,50)
     arrowLPNG = loadImage("assets/arrowLeft.png",100,50)
     redoPNG = loadImage("assets/redo.png",100,50)
     starPNG = loadImage("assets/star.png",100,50)
     starPNG2 = loadImage("assets/starfilled.png",100,50)

     levelIdx = localStorage.getItem("level_index")
     if(levelIdx == null || levelIdx == "null"){
          levelIdx = 0;
     }
}


function mousePressed(){
     
     if(level.levelOver == true){
          levelComplete.checkClick()
     } else {      
          buttons.forEach(b=>{
               b.checkClick();
          })

          redoButton.checkClick(0,0);
     }
}

let dampRatio = 0;
function progressBar(){

     dampRatio +=(level.wRatio - dampRatio)/20;
     noFill();
     stroke(100)
     strokeWeight(4)
     circle(width/2,450,600)
     if(level.wRatio != 0){
          strokeWeight(6)
          stroke(255)
          arc(width/2,450,600,600,0,(2*PI*dampRatio))
     }
}

function Logo(y){
     fill(0);
     noStroke();
     textSize(60)
     textFont(segundoBold)
     textAlign(LEFT,BASELINE)
     text("L",width/2 - 70,65 + y)
     image(logo,width/2 - logo.width/2,y)
     text("p",width/2 + 60,70 + y)
     text("s",width/2 + 90,70 + y)
}

function drawDiagonal(y,w,c,o){
     let x1 = -w
     let y1 = y
     let x2 = width + w
     let y2 = y - (x2 - x1)
     c.setAlpha(50)
     strokeWeight(w+sin(frametime+o)*10)
     stroke(c)
     noFill()

     line(x1,y1,x2,y2)
}

function drawBkgd(){
     drawDiagonal(400,200,color(86,50,50),1)
     drawDiagonal(600,200,color(255,193,140),2)
     drawDiagonal(800,200,color(132,36,12),4)
     drawDiagonal(900,200,color(218,109,66),8)
     drawDiagonal(1000,200,color(231,207,180),16)
     drawDiagonal(1350,200,color(86,50,50),32)
     drawDiagonal(1700,200,color(255,193,140),128)
}

function drawVersion(){
     noStroke()
     fill(255)
     textFont(segundoBold)
     textSize(40)
     text("v"+versionInfo,width-55,40);
}

// function keyPressed(){
//      recording = !recording;

//      if(recording){
//           capturer.start();
//      } else {
//           capturer.stop();
//           capturer.save();
//      }
// }

function draw(){
     background(bkgdColor)

     drawBkgd();
     redoButton.draw();
     Logo(20);
     push();
     translate(level.offsX,level.offsY)
     level.draw()
     balls.forEach(d=>d.draw());
     pop();
     progressBar();
     if(levelComplete.active == false){
          buttons.forEach(b=>{b.draw();});
     }
     turnsUI.draw();
     drawVersion();
     levelComplete.draw(); 
     
     moveInProgress = moveTimer > 0;
     if(moveTimer > 0) moveTimer-=0.1;
     frametime += 0.02;

}

// function render(){
// 	requestAnimationFrame(render);
// 	// rendering stuff ...
// 	capturer.capture( canvas );
// }

// render()

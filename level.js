let spacing = 68
class Level{
    constructor(w,h,turns){
        this.w = w
        this.h = h
        this.offsX = (width - (this.w - 1) * spacing)/2
        this.offsY = (900 - (this.h - 1) * spacing)/2
        this.tracks = []
        this.tiles = []
        this.solution = [];
        this.moveInProgress = false;
        this.wRatio = 0;
        this.swaps = 0;
        this.swapArray = turns;
        this.swapsComplete = false;
        this.holes = [];
        this.levelOver = false;
        for (let ii = 0; ii < w; ii++) {
            this.tiles.push([])
            for (let jj = 0; jj < h; jj++) {
                this.tiles[ii].push(new tile(ii*spacing,jj*spacing))
            } 
        }

        this.maxTurns = turns.length * 5;
    }

    AddTrack(mode,p1,p2,type){
        this.tracks.push(new track(mode,p1,p2,type))
    }

    LoadBalls(ballArray){
        balls = [];
        this.holes = [];
        this.solution = ballArray;
        for(let i=0; i < this.w; i++){
            for(let j=0; j < this.h; j++){
                let sX = i*spacing;
                let sY = j*spacing;
                let hash = "x"+sX + "y"+sY;
                 
                if(wps[hash] == undefined){
                    wps[hash] = new waypoint(sX,sY,0)
                }
                let b = new Ball(wps[hash],ballArray[i + j*this.w]);
                balls.push(b);
                this.holes.push(new hole(sX,sY,SetBallColor(b.type))) 
            }    
        }
    }

    ShuffleBalls(){
        if(this.swaps < this.swapArray.length && this.moveInProgress == false){
                this.tracks[ this.swapArray[this.swaps]].advance();
            this.swaps++;
        }
    }

    draw(){
        let w = (this.w) * spacing;
        let h = (this.h) * spacing;
        this.tracks.forEach(t=>t.drawBkgd())
        noStroke()
        fill(100,100,100,180)
        rect(-spacing/2,-spacing/2,w,h,spacing/4)
        this.holes.forEach(h=>h.draw());
        
        
        
        if(this.moveInProgress == true && moveInProgress == false){
            if(this.swapsComplete && this.CheckResults()){
                levelComplete.show(true);
                redoButton.active = false;
                this.levelOver = true;
            } 
            
            if(turns > this.maxTurns - 1){
                levelComplete.show(false);
                this.levelOver = true;
            }

            if(this.swaps>= this.swapArray.length){
                this.swapsComplete = true;
            }
        }
        this.moveInProgress = moveInProgress;
        this.ShuffleBalls();
    }

    CheckResults(){
        let solved = true;
        let correctSlots = 0;
        for(let i=0; i < this.w; i++){
            for(let j=0; j < this.h; j++){
                let sX = i*spacing;
                let sY = j*spacing;
                let hash = "x"+sX + "y"+sY;
                
                if(wps[hash].ball.type != this.solution[i + j*this.w]){
                    solved = false;
                } else {
                    correctSlots++;
                    let idx = j + this.h * i;
                    if(this.holes[idx]!= undefined){
                        this.holes[idx].t=10;
                    }
                }
            }
        }
        this.wRatio = correctSlots / (this.w *  this.h);
        console.log(this.wRatio);
        return solved;
    }
}

class hole{
    constructor(x,y,c){
        this.x=x;
        this.y=y;
        this.r=50;
        this.t=10;
        this.c=c;
    }

    draw(){

        let factor = this.t/10*PI*2
        strokeWeight(4 + factor)
        fill(100)
        stroke(this.c);
        circle(this.x,this.y,50 + factor * 2);
        if(this.t > 0){
            this.t-=0.5;
        }else{
            this.t = 0;
        }
    }

}
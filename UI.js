class CircleButton{
    constructor(_x,_y,_r,_type){
        this.x=_x;
        this.y=_y;
        this.r = _r;
        this.type= _type;
        this.active = true;
        this.pressed = false;
        this.color = SetColor(this.type)
        this.angle = 0;
    }

    show(){
        this.active = true;
    }
    
    hide(){
        this.active = false;
    }

    clickFunction(){
        if(moveInProgress) return;  
        turns++;
        activeType = this.type;
        level.tracks.forEach(t => {
            if(t.type == this.type){
                t.advance();
            }
        });
    }

    checkClick(){
        if(this.active == false) return;
        let d = dist(this.x,this.y,mouseX,mouseY); 
        if(d > this.r) return;    
        this.clickFunction();

    }
    drawArrow(ang1,ang2){
        let r1 = this.r +1;
        let r2 = this.r -5;
        let r3 = this.r - 11;
        
        let c1 = Cartesian(this.x,this.y,r1,ang1);
        let c2 = Cartesian(this.x,this.y,r2,ang2);
        let c3 = Cartesian(this.x,this.y,r3,ang1);
        stroke(bkgdColor)
        strokeWeight(3)
        line(c1.x,c1.y,c2.x,c2.y);
        line(c2.x,c2.y,c3.x,c3.y);

    }
    draw(){
        fill(this.color)
        stroke(150)
        strokeWeight(2)
        circle(this.x,this.y,this.r);
        if(moveInProgress && activeType == this.type){
            stroke(255)
            this.angle +=0.1;
        } else {
            stroke(100)
        }
        noFill();
        strokeWeight(10)
        circle(this.x,this.y,this.r+20);
        this.drawArrow(this.angle,this.angle+0.2)
        this.drawArrow(this.angle+PI,this.angle+0.2+PI)
    }
}

function AddButton(_type){
    let found = false;
    buttons.forEach(b=>{
        if(b.type == _type){
            found = true
        }
    })

    if(found) return;

    buttons.push(new CircleButton(0,0,30,_type));
    let count = buttons.length;
    let gap = 600/count;

    let x = width/2 - (gap*(count-1)/2);
    buttons.forEach(b=>{
        b.y = 900;
        b.x = x;
        x+=gap;
    })
}

function ClearButtons(){
    buttons = [];
}


class ArrowButton{
    constructor(_x,_y,_d){
        this.x=_x;
        this.y=_y;
        this.d = _d;
        this.active = true;
        this.pressed = false;
        this.string= ""
    }

    show(){
        this.active = true;
    }

    hide(){
        this.active = false;
    }

    clickFunction(){
        
    }

    checkClick(x,y){
        if(this.active == false) return;
        let d = dist(this.x + x,this.y + y,mouseX,mouseY); 
        if(d > this.d/2) return;    
        this.clickFunction();

    }
   
    draw(){
        if(!this.active){
            return;
        }
        noFill();
        stroke(0)
        strokeWeight(2)
        circle(this.x,this.y,this.d)
        textAlign(CENTER,CENTER)
        fill(0)
        textFont("wingdings")
        textSize(60)
        text(this.string,this.x-5,this.y+3)
    }
}

class LeftArrow extends ArrowButton{
    constructor(_x,_y,_d){
        super(_x,_y,_d);
        this.string = "×";
    }

    clickFunction(){
        levelIdx--;
        levelIdx = max(0,levelIdx)
        loadLevel(levelIdx);
        levelComplete.hide();
    }
}

class RightArrow extends ArrowButton{
    constructor(_x,_y,_d){
        super(_x,_y,_d);
        this.string = "Ø";
    }

    clickFunction(){
        levelIdx++;
        loadLevel(levelIdx);
        levelComplete.hide();
    }

    draw(){
        if(!this.active){
            return;
        }
        noFill();
        stroke(0)
        strokeWeight(2)
        circle(this.x,this.y,this.d)
        textAlign(CENTER,CENTER)
        fill(0)
        textFont("wingdings")
        textSize(60)
        text(this.string,this.x+5,this.y+3)
    }
}

class RedoButton extends ArrowButton{
    constructor(_x,_y,_d){
        super(_x,_y,_d);
        this.string = "⭯";
    }

    clickFunction(){
        loadLevel(levelIdx);
        levelComplete.hide();
    }

    draw(){
        if(!this.active){
            return;
        }
        noFill();
        stroke(0)
        strokeWeight(2)
        circle(this.x,this.y,this.d)
        textAlign(CENTER,CENTER)
        fill(0)
        textFont("wingdings")
        textSize(60)
        text(this.string,this.x,this.y+4)
    }
}

function AddButton(_type){
    let found = false;
    buttons.forEach(b=>{
        if(b.type == _type){
            found = true
        }
    })

    if(found) return;

    buttons.push(new CircleButton(0,0,30,_type));
    let count = buttons.length;
    let gap = 600/count;

    let x = width/2 - (gap*(count-1)/2);
    buttons.forEach(b=>{
        b.y = 900;
        b.x = x;
        x+=gap;
    })
}

function text45(x,y,t){
    push();
    translate(x,y);
    rotate(PI/4)
    text(t,0,0);
    pop();
}

class TurnsUI{
    constructor(y,c){
        this.y = y;
        this.color = c
        this.turnDamped = 0;
        this.turns = 0;
    }



    draw(){
        this.turns = level.swapArray.length;
        noStroke();
        fill(255,255,0)
        let turnSpace = 20;
        this.turnDamped += (turns - this.turnDamped)/20
        let offsX = 120 + this.turnDamped * turnSpace
        beginShape();
            vertex(120, this.y);
            vertex(120, this.y - 30);  
            vertex(offsX, this.y - 30);
            vertex(offsX + 30, this.y);
        endShape();

        stroke(this.color)
        fill(this.color)
        strokeWeight(2)    
        line(0,this.y,width,this.y)
        beginShape();
            vertex(0, this.y);
            vertex(0, this.y - 40);  
            vertex(120, this.y - 40);
            vertex(160, this.y);
        endShape();
        let x1 = 150 + this.turns*turnSpace;
        let x2 = x1 +  this.turns*turnSpace;
        let x3 = x2 +  this.turns*turnSpace;
        let x4 = x3 +  this.turns*turnSpace*2;

        
        line(x1,this.y,x1-35,this.y-35)
        line(x2,this.y,x2-35,this.y-35)
        line(x3,this.y,x3-35,this.y-35)
        line(x4,this.y,x4-35,this.y-35)
        textFont(segundo);
        fill(100)
        textSize(15)
        
        text45(x1-30,this.y-35,this.turns);
        text45(x2-30,this.y-35,this.turns*2);
        text45(x3-30,this.y-35,this.turns*3);
        
        textFont("Arial")
        text45(x4-32,this.y-40,"💀");
        
        textFont(segundo);
        fill(255)
        textSize(30);
        text("TURNS",10,this.y - 10)        
    }
}


function Cartesian(_x,_y,_r,_a){
    return{
        x: _x + _r * cos(_a),
        y: _y + _r * sin(_a),
    };
}

class LevelComplete{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.d = 590;
        this.color = color(255,255,255,230);
        this.leftArrow = new LeftArrow(-150,150,70);
        this.rightArrow = new RightArrow(150,150,70);
        this.redo = new RedoButton(0,150,70);
        this.active = true
        this.angle = 0;
        this.scale = 0;
        this.desired_scale = 0;
        this.cooldown = 0;
        this.showFail = false;
    }
    checkClick(){
        this.leftArrow.checkClick(this.x,this.y);
        this.rightArrow.checkClick(this.x,this.y);
        this.redo.checkClick(this.x,this.y);
    }

    show(wonGame){
        this.desired_scale = 1;
        if(wonGame){
            this.cooldown = 10;
        } else {
            this.cooldown = 5;
        }
        this.leftArrow.active = levelIdx > 0;
        this.rightArrow.active = levelIdx < levels.length-1;
        this.showFail = !wonGame;
        return;       
    }

    hide(){
        this.desired_scale = 0;
    }

    drawStars(){
        textAlign(CENTER,CENTER)
        textFont("wingdings")
        textSize(70);
        fill(0)
        
        let x = 130;
        for(let i = 0; i < 3; i++){
            if(turns <= level.swapArray.length * (i+1)){
                text("✮",x,0);
            } else {
                text("✰",x,0);
            }
            x -= 130;
        }

    }

    draw(){
        this.active = this.scale > 0.01;
        //give time to view the finished puzzle
        if(this.cooldown > 0){
            this.cooldown -= 0.1;
        } else {
            this.scale += (this.desired_scale - this.scale)/20;
        }
        
        if(!this.active) return;
        
        push();
        translate(this.x,this.y)
        rotate(this.angle)
        scale(this.scale)
        if(this.active == false)return;
        noStroke()
        fill(this.color)
        circle(0,0,this.d);
        textAlign(CENTER,CENTER)
        fill(0)
        textFont(segundoBold)
        textSize(60)
        if(!this.showFail){
            text("W E L L  D O N E",0,-200)
            this.leftArrow.draw();
            this.rightArrow.draw();
            this.redo.draw();
            this.drawStars();
        } else {
            text("Y O U  L O S E",0,-200)
            textFont("Arial")
            text("💀",0,0);
            this.redo.draw();
        }
        stroke(0)
        strokeWeight(2)

        line(-270,80,270,80)
        push();

        this.angle = PI * this.scale/1+PI;
    }
}
function SetBallColor(type){
    type%=5;
    if(type == 0)return color(255);
    if(type == 1)return color(125,200,214);
    if(type == 2)return color(200,255,100);
    if(type == 3)return color(255,200,100);
    if(type == 4)return color(255,50,255);
}

class Ball{
    constructor(wp,type){
        this.x = wp.x;
        this.y = wp.y;
        this.speed = 8;
        this.wp = wp;
        wp.ball = this;
        this.d = 0;
        this.ang = wp.ang;
        this.cx = 0;
        this.cy = 0;
        this.nextNodes = [];
        this.atNode = true
        this.d = 0;
        this.type = type;
        this.color = SetBallColor(type);
    }


    advance(){
        if(this.nextNodes.length == 0){
            this.nextNodes.push(this.wp.next)
        } else {
            this.nextNodes.push(this.nextNodes[this.nextNodes.length - 1].next)
        }
    }

    move(){
        let d = dist(this.x,this.y,this.wp.x,this.wp.y);
        this.d = d;
        if (d > 0.001){
            moveTimer = 1;
            if(this.atNode){
                this.atNode = false
            }
            let speed = min(d,this.speed)
            if(this.wp.mode == "s"){
                let dx = this.wp.x - this.x
                let dy = this.wp.y - this.y
                
                let ang = atan2(dy,dx);
                
                this.x += cos(ang)*speed;
                this.y += sin(ang)*speed;
            } else {

                this.ang += speed / this.r 
                this.x = this.cx + this.r * cos(this.ang)
                this.y = this.cy + this.r * sin(this.ang)
            }
        } else {
            this.x = this.wp.x;
            this.y = this.wp.y;
            if(this.atNode == false){
                this.atNode = true;
                this.wp.ball = this;
                this.ang = this.wp.ang;

            }
        }
    }

    draw(){
        if(level.swapsComplete == false){
            this.speed = 20
        } else {
            this.speed = 8
        }
        if(this.wp.next!= undefined && this.wp.next.mode == "a"){
            this.r = dist(this.wp.x,this.wp.y,this.wp.next.x,this.wp.next.y) / 2
            this.cx = (this.wp.x + this.wp.next.x)/2
            this.cy = (this.wp.y + this.wp.next.y)/2
        }

        if(this.nextNodes.length > 0){
            if(this.atNode){
                this.wp.ball = undefined;
                this.wp = this.nextNodes.shift();
            }
        }

        this.move();
        
        stroke(255)
        fill(this.color)
        noStroke();
        if(level.swapsComplete == false) return;
        circle(this.x,this.y,40)

    }
}
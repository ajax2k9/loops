class tile{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    draw(){
        rectMode(CENTER)
        color = 255
        stroke(color)
        strokeWeight(1)
        noFill()
        rect(this.x,this.y,spacing-3,spacing-3,5)

        noStroke()
        fill(color)
        rect(this.x,this.y,spacing-8,spacing-8,5)
    }
}
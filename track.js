let waypoints = [];

function SetColor(type){
    type%=5;
    if(type == 0)return color(255,100,100);
    if(type == 1)return color(100,255,100);
    if(type == 2)return color(100,100,255);
    if(type == 3)return color(255,255,50);
    if(type == 4)return color(255,50,255);
}

class waypoint{
    constructor(x,y,ang){
        this.x = x;
        this.y = y;
        this.next;
        this.mode = "s";
        this.ang = ang
        this.tracks;
        this.intersect = false
    }

    draw(){
        stroke(1)
        fill(255,255)
        circle(this.x,this.y,10)
        fill(0)
    }
}
class track{
    constructor(mode,p1,p2,type){
        this.mode = mode
        this.p1 = p1
        this.p2 = p2
        this.angs = [];
        this.diameter=abs(p1 - p2)
        this.getPoints();
        this.createWaypoints();
        this.type = type;
        this.color = SetColor(this.type);
        AddButton(this.type);
    }

    AddWaypoint(x,y,ang){
        let wp = new waypoint(x,y,ang)
        let intX = floor(x)
        let intY = floor(y);
        
        let hash = "x"+intX + "y"+intY;

        if(wps[hash] == undefined){
            wps[hash] = wp;
        } 

        this.wp.push(wps[hash]);
    }

    createWaypoints(){
        this.wp = []
        if(this.mode == "h"){
            for(let i = -1; i <= this.l; i++){
                this.AddWaypoint(this.x2 - (i+1)*spacing,this.y3,PI/2)
                this.angs.push(PI/2)
            }
            for(let i = -1; i <= this.l; i++){
                this.AddWaypoint(this.x1 + (i+1)*spacing,this.y1,-PI/2)
                this.angs.push(-PI/2)
            }

           
        } else {

            for(let i = -1; i <= this.l; i++){
                this.AddWaypoint(this.x1, this.y2 - (i+1)*spacing,PI)
                this.angs.push(PI)
            }
            for(let i = -1; i <= this.l; i++){
                this.AddWaypoint(this.x3, this.y1 + (i+1)*spacing,0)
                this.angs.push(0)
            }
        }
    }

    getPoints(){
        this.x1 = 0;
        this.x2 = 0;
        this.x3 = 0;
        this.x4 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.y3 = 0;
        this.y4 = 0;
        this.ang1 = 0;
        this.ang2 = 0;
        this.l = 0;
        
        if(this.mode == "H" || this.mode == "h"){
            this.x1 = this.x3 = -spacing
            this.x2 = this.x4 = (level.w) * spacing

            this.y1 = this.y2 = this.p1 * spacing
            this.y3 = this.y4 = this.p2 * spacing

            this.ang1 = PI/2
            this.ang2 = PI * 3/2
            this.l = level.w

        } else {
            this.y1 = this.y3 = -spacing
            this.y2 = this.y4 = (level.h) * spacing

            this.x1 = this.x2 = this.p1 * spacing
            this.x3 = this.x4 = this.p2 * spacing
            
            this.ang1 = PI
            this.ang2 = 0
            this.l = level.h
        }

        this.arc1x = (this.x1 + this.x3)/2
        this.arc1y = (this.y1 + this.y3)/2
        this.arc2x = (this.x2 + this.x4)/2
        this.arc2y = (this.y2 + this.y4)/2

        this.w = this.diameter * spacing
    }

    advance(){
        this.SetLinks();

        for(let i=0; i<this.wp.length/2; i++){
            this.wp.forEach(w=>{
                if(w.ball != undefined)w.ball.advance()
            })
        }
    }

    SetLinks(){
        for(let w = 0; w < this.wp.length - 1; w++){
            this.wp[w].next = this.wp[w + 1]
        }
        this.wp[this.wp.length - 1].next = this.wp[0];
        let index = 0;
        this.wp.forEach(w=>{
            w.mode = 's'
            w.ang=this.angs[index]
            if(w.ball != undefined)w.ball.ang = w.ang
            index++

        });

        this.wp[0].mode = "a"
        this.wp[this.wp.length/2].mode = "a"
    }

    drawBkgd(){
        noFill()
        if(moveInProgress && activeType == this.type && level.swapsComplete){
            stroke(255)
            strokeWeight(5)
        }   else {
            stroke(100)
            strokeWeight(3)
        }
        
        line(this.x1,this.y1,this.x2,this.y2)
        line(this.x3,this.y3,this.x4,this.y4)
        
        arc(this.arc1x,this.arc1y,this.w,this.w,this.ang1,this.ang2)
        arc(this.arc2x,this.arc2y,this.w,this.w,this.ang2,this.ang1)

        stroke(this.color)
        strokeWeight(6)
        strokeCap(SQUARE)
        arc(this.arc1x,this.arc1y,this.w-15,this.w-15,this.ang1,this.ang2)
        
       
    }
}
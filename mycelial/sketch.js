var nodes = [];
var limit = 200;
var offset = 100;
var speed = 0.5;
var img;

var sizeY;
var sizeX;

var cam;

function setup() {
    createCanvas(windowWidth, windowHeight);
    smooth();
    cam = new Camera();
    addNode();
    background(255);
    oldX=windowWidth;
    oldY=windowHeight;
}
var oldX, oldY,newX,newY;
function draw() {
  newX=windowWidth;
  newY=windowHeight;
  if(oldX!=newX || oldY !=newY)
  {
    windowRes();
  }
  sizeY = windowHeight;
  sizeX = windowWidth;
  //fill(color(50, 50, 50, 40));
  background(0);
  drawFabric();
  noStroke();
  fill(0, 40);
  rect(0,0,sizeX,sizeY);
  connectNodes();
  checkTimer();
  for(idx in nodes){
    nodes[idx].display();
    nodes[idx].move();
  }
  oldX=windowWidth;
  oldY=windowHeight;
}

function windowRes() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged(){
    var dx = cam.pmouseX - cam.mouseX;
    var dy = cam.pmouseY - cam.mouseY;
    cam.translate(dx, dy);
}

function mouseWheel(e) {
  var factor = Math.pow(1.01, e.delta);
  cam.scale(factor, mouseX, mouseY);
}

var counter=0;
var drawFabric = function(){
  for (var i = 0; i<=width; i+=50) {
      if(counter==i)
        strokeWeight(4);
      else if(abs(counter-i) == 50)
        strokeWeight(2);
      else if(abs(counter-i) == 100)
        strokeWeight(1);
      else if(abs(counter-i) == 200)
        strokeWeight(0.5);
      else 
        strokeWeight(0.1);

    line(i, 0, i, height);
  }
  
  strokeWeight(0.1);
  for (var j = 0; j<=height; j+=50) {
    line(0, j, width, j);
  }

  if(!(frameCount%5)){
     counter = counter<=width ? counter + 50:0;
  }
}


var connectNodes = function(){
    stroke(200);
    strokeWeight(2);
    for(i in nodes){
        var min = Number.MAX_VALUE;
        var minIdx = i;
        for(j in nodes){
            if(i != j){
                var dist = nodes[i].distance(nodes[j]);
                if(dist < min){
                    min = dist;
                    minIdx = j;
                } 
            }
        }
        var distance = round(getGeoDistance(nodes[i].long, nodes[i].lat, nodes[minIdx].long, nodes[minIdx].lat, "km"));
        if(nodes.length > 1){
            var posX = (nodes[i].x + nodes[minIdx].x) / 2;
            var posY = (nodes[i].y + nodes[minIdx].y) / 2;
            fill(255);
            textAlign(CENTER);
            textSize(15);
            text(distance + " km", posX, posY);
            line(nodes[i].x, nodes[i].y, nodes[minIdx].x, nodes[minIdx].y);
        }
    }
}

var checkTimer = function(){
  if(!(frameCount % limit)){ 
    limit = int(getRandomInRange(50,200));
    addNode();
  }
}

var addNode = function(){
    var long = getRandomInRange(-180,180,3);
    var lat = getRandomInRange(-90, 90, 3);
    nodes.push(new Point(long, lat));
}

function getGeoDistance(long_1, lat_1, long_2, lat_2, mode){
    return calcGeoDistance(long_1, lat_1, long_2, lat_2, mode);
}

function getRandomInRange(from, to) {
    return (Math.random() * (to - from) + from);
}

function getRandomColor(){
    return color(random(255), random(255), random(255));
}

function touchMoved(){
    
}

function mouseMoved(){

}

class Point {
    constructor(longitude, latitude){
        this.long = latitude;
        this.lat = latitude;
        this.x = getRandomInRange(offset, sizeX-offset);
        this.y = getRandomInRange(offset, sizeY-offset);
        this.color = getRandomColor();
        this.dir = int(random(4));
        this.size = 20;
        this.beat = false;
    }

    display(){
        fill(100);
        stroke(200);
        ellipse(this.x, this.y, this.size, this.size);
        fill(color(100,90));
        stroke(this.color);
        ellipse(this.x, this.y, this.size+20, this.size+20);
        //imageMode(CENTER);
        //image(img,this.x,this.y, img.width/2, img.height/2);
    }

    distance(point){
        return Math.sqrt(Math.pow(this.x - point.x,2) + Math.pow(this.y - point.y,2)); 
    }

    changeDir(){
        this.x = getRandomInRange(offset, sizeX-offset);
        this.y = getRandomInRange(offset, sizeY-offset);
        this.dir = int(random(4));
    }

    heart_beat(){
        if(!this.beat) 
            this.size++; 
        else 
            this.size --;

        if(this.size > 35 || this.size < 20) 
            this.beat = !this.beat;
    }


    move(){
        this.heart_beat();
        switch(this.dir){
            case 0:
                this.x+=speed;
                if(this.x > (sizeX+offset)) this.changeDir();  
                break;
            case 1:
                this.x-=speed;
                if(this.x < (0-offset)) this.changeDir();  
                break;
            case 2:
                this.y+=speed;
                if(this.y > (sizeY+offset)) this.changeDir();  
                break;
            case 3:
                this.y-=speed;
                if(this.y < (0-offset)) this.changeDir();  
                break;
        }
    }
}
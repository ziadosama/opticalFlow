import gab.opencv.*;
import processing.video.*;
import oscP5.*;
import netP5.*;

OpenCV opencv;
Movie video;
OscP5 oscP5;
NetAddress myRemoteLocation;

int portNumber=1200;
String ip="127.0.0.1";

//PVector min, max;
int flowScale = 1;
PVector aveFlow;

void settings()
{
  size(720*2, 480);
}

void setup() {

  video = new Movie(this, "gopro_out.mov");
  opencv = new OpenCV(this, 720, 480);
  video.loop();
  video.play();  
  delay(1000);

  /* start oscP5, listening for incoming messages at port 12000 */
  oscP5 = new OscP5(this, portNumber);

  //for minimum and maximum flows
  //min = new PVector(100,100);
  //max = new PVector(-100,-100);
  myRemoteLocation = new NetAddress(ip, portNumber);
}


void draw() {
  background(0);
  opencv.loadImage(video);
  opencv.calculateOpticalFlow();

  image(video, 0, 0);
  translate(video.width, 0);
  stroke(255, 0, 0);
  opencv.drawOpticalFlow();

  aveFlow = opencv.getAverageFlow();

  stroke(255);
  strokeWeight(2);
  sendData();
  //finding maximum and minimum flows
  //println(aveFlow.x*flowScale, video.height/2, aveFlow.y*flowScale);
  //if (aveFlow.x<min.x)
  //  min.x=aveFlow.x;
  //if (aveFlow.y<min.y)
  //  min.y=aveFlow.y;
  //if (aveFlow.x>max.x)
  //  max.x=aveFlow.x;
  //if (aveFlow.y>max.y)
  //  max.y=aveFlow.y;
  //println(min.x*flowScale, video.height/2, min.y*flowScale);
  // println(max.x*flowScale, video.width/2, max.y*flowScale);
}

void movieEvent(Movie m) {
  m.read();
}

void sendData() {
  /* in the following different ways of creating osc messages are shown by example */
  OscMessage myMessage = new OscMessage("/test");

  myMessage.add(aveFlow.x);
  myMessage.add(aveFlow.y);

  /* send the message */
  oscP5.send(myMessage, myRemoteLocation);
}


/* incoming osc message are forwarded to the oscEvent method. */
void oscEvent(OscMessage theOscMessage) {
  /* print the address pattern and the typetag of the received OscMessage */
  print("### received an osc message.");
  print(" addrpattern: "+theOscMessage.addrPattern());
  println(" typetag: "+theOscMessage.typetag());
}
let nearEarthObj; // object of interest in api
let lunarDist = []; // lunar distances of asteroids
let mileDist = []; // mile distance of asteroids
let asteroidNames = [];
let asteroidDiameter = [];
let earth, moon, asteroid, locations;
let aInfo = []; // asteroid information
let sV = 255; // stroke value
let xL, yL; // x and y coordinates of asteroids
let nasa, rocket, nasa2;
let info = []; // contains info of asteroids
let clickCount = 0;
let sE = 255; // earth stroke effects
let earthSound; // audio when touch earth
let safe = [];

function preload() {
  // load api
  let url =
   'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=zbaIHPjZdynhlHycyBSELEHdLzoSiwG1M7brS3i1';
  nasa_Data = loadJSON(url);

  // load images
  earth = loadImage('pics/Earth.png');
  moon = loadImage('pics/Moon.png');
  ast = loadImage('pics/Aster.png');
  nasa = loadImage('pics/nasa.png');
  nasaLogo = loadImage('pics/nasaLogo.jpg');
  rocket = loadImage('pics/rocket3.png');
  nasa2 = loadImage('pics/nasaLogo2.jpg');

  // load table with x and y coordinates of asteroids
  locations = loadTable('aster_loc.csv','csv','header');
}

function setup(){
  createCanvas(1500, 1000);
  //noLoop();
  // Get columns from table
  xL = locations.getColumn('x');
  yL = locations.getColumn('y');

  // sound effect by zapsplat.com
  earthSound = createAudio('earth.mp3');

  // set correct locations of asteroids
  assignInt();

  background('black')

  // text at bottom of screen
  fill('white');
  textSize(45);
  text('Near Earth Asteroid Observations', 560, 925);
}

function draw(){

  // get near_earth_objects object from json nasa_Data
  nearEarthObj = nasa_Data.near_earth_objects;

  // fill asteroid info in respective arrays
  assignAsteroidInfo();

  // display several images
  emImages();

  // display effect when over earth
  earthActivity();

  // show when clicked on earth
  if (clickCount >= 1){
    // display information of lunar distance lines
    infoText();
    // draw lunar distances scaled
    drawLunarDist();
    // display moon information and effects
    moonId();
    // get coordinates of asteroids
    assignAsteroidIdentity();
  }
  //print(safe);
}

function infoText(){
  noFill();
  strokeWeight(3);
  stroke('red');
  rect(80, 555, 220, 150);

  noStroke();
  fill('white');
  textSize(20);
  text('*Lines from Earth to asteroid represent lunar distance scaled by 15\n' + '*Danger is POTENTIAL', 100, 559, 200,150);
}

function earthActivity(){

  push();
    let earthH = new EarthIdentifier(width/2, height/2);
    earthH.hovered();

    let tD = dist(mouseX, mouseY, width/2, height/2);
    if (mouseIsPressed && tD < 100){
      clickCount++;
      earthSound.play();

    }
  pop();


}

// class to display information of each asteroid
class InfoDisplay{
  constructor(name, lunar_Dist, milesDist, diameterA, safety){
    this.name = name;
    this.lunarDist = lunar_Dist;
    this.mileDist = milesDist;
    this.diameterA = diameterA;
    this.safety = safety
  }

  display(){
    rect(1100, 120, 310, 60);
    rect(1150, 180, 210, 610);
    image(nasaLogo, 1100, 120, 160,60);
    image(rocket, 1300, 125, 45, 45);

    textFont('Georgia');
    textSize(30);
    fill('white');
    noStroke();
    text('Name: ' + this.name, 1160, 200, 165, 150);
    if (this.safety == false){
      text('Danger: No', 1160, 320, 165, 100);
    }
    else{
      text('Danger: Yes', 1160, 320, 175, 100);
    }
    text('Lunar Distance: ' + this.lunarDist, 1160, 400,175, 200);
    text('Distance (mi): ' + this.mileDist, 1160, 510, 165, 150);
    text('Diameter (mi): ' + this.diameterA, 1160, 650, 165, 200);
  }

  noDisplay(){
    fill('black');
    rect(1100, 120, 310, 60);
    rect(1150, 180, 210, 610);

  }
}

function moonId(){
  push();
    let moonClick = new Identifier(width/2, height/2 + 135, sV);
    moonClick.hovered();
    let moonDisplay = new InfoDisplay('Moon', '1', '238,900', 2158, false);

    if (moonClick.hovered()){
      moonDisplay.display();

    }
    else{
      moonDisplay.noDisplay();

    }
  pop();
}

function emImages(){
  noTint();
  image(earth, width/2 - 75, height/2 - 75, 150, 150);
  image(moon, width/2 - 35, height/2 + 95, 70, 70);
  image(nasa2, 300, 850, 250, 100);

  push();
    tint(255,50);
    image(nasa, 50, 40, 350, 300);
  pop();
}

function assignAsteroidIdentity(){
  push();
    for (var i = 0; i < 9; i++){
      aInfo[i] = new Identifier(xL[i], yL[i], sV);
    }
    for (var i = 0; i < 9; i++){
      aInfo[i].hovered();
      if (aInfo[i].hovered()){
        info[i].display();
      }

    }
  pop();
}

function assignInt(){
  for (var i = 0; i < 9; i++){
    xL[i] = width/2 + int(xL[i]);
    yL[i] = height/2 + int(yL[i]);
  }
}

// class to display disappearing hovering effect over Earth
class EarthIdentifier{
  constructor(x, y){
      this.x = x;
      this.y = y;

  }

  hovered(){
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 100){
      stroke(sE);
      let sL = sE - 30;
      strokeWeight(5);
      noFill();
      circle(this.x, this.y, 130);
      stroke(sL);
      circle(this.x, this.y, 150);
      if (sE < 0){
        sE = 255;
      }
      sE = sE - 10;

    }
    else{
      sE = 0;
      stroke(sE);
      strokeWeight(5);
      noFill();
      circle(this.x, this.y, 130);
      circle(this.x, this.y, 150);
    }


  }
}

// class to display hovering effect
class Identifier{
  constructor(x, y, sv){
      this.x = x;
      this.y = y;
      this.sv = sv;
  }

  hovered(){
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 40){
      stroke(this.sv);
      let sL = this.sv - 30;
      strokeWeight(5);
      noFill();
      circle(this.x, this.y, 60);
      stroke(sL);
      circle(this.x, this.y, 80);
      if (this.sv < 0){
        this.sv = 255;
      }
    return true;
    }
    else{
      this.sv = 0;
      stroke(this.sv);
      strokeWeight(5);
      noFill();
      circle(this.x, this.y, 60);
      circle(this.x, this.y, 80);
    }


  }

}

function assignAsteroidInfo(){
  for (var i = 0; i < nearEarthObj.length; i++){
    let close = nearEarthObj[i].close_approach_data[0];

    if (close != undefined){
      let lunar = close.miss_distance.lunar;
      // remove outlier
      if (lunar < 100){
        lunar = lunar*15; // scale data
        append(lunarDist, lunar);
        let mile = round(close.miss_distance.miles);
        append(mileDist, mile);
        let name = nearEarthObj[i].name;
        append(asteroidNames, name);
        let diameter = nearEarthObj[i].estimated_diameter.miles.estimated_diameter_max;
        append(asteroidDiameter, diameter);
        let dangerous = nearEarthObj[i].is_potentially_hazardous_asteroid;
        append(safe, dangerous);
        let asterInfo = new InfoDisplay(name, round(lunar/15), mile, diameter, dangerous);
        append(info, asterInfo);
      }
    }
  }
}

function drawLunarDist(){
  push();
    translate(width/2,height/2);
    let angle = 360 / 10;
    for(let s = 0; s < 10; s++) {
      rotate(radians(angle));
      stroke(255);
      strokeWeight(5);
      if (s == 9){
        rect(0, 75, 1, 15);
      }
      else{
        rect(0,75,1, lunarDist[s]);
        image(ast, -25, lunarDist[s] + 80, 50, 50);
      }
    }
  pop();
}


var gameState = "INSTRUCTIONS";
var player , playerImg, player2;

var backgroundImg , bg2;

var syringe,syringeImg ,syringeGroup , shootSound;
var covid , covidImg,covidGroup;
var armor1,armorImg , ammoBox , ammoImg;
var bossCovid,bossImg;


var edge1,edge2,edge3,edge4;
var lifeBar ,  win;
var heliImg , helicopter;

//Giving the values.
var kills = 0;
var ammo = 50;
var covidHealth = 450;
var timer = 120;
var life = 200;
 var covidCount = 0;
function preload(){
   //Loading all the images.
   backgroundImg = loadImage("images/background.jpg");
   bg2 = loadImage("images/bg2.png");
   bg2.scale=0.5;
   
  playerImg = loadImage("images/Player.png");
   player2 = loadImage("images/Player2.png");
  
   syringeImg = loadImage("images/syringe.png");
  covidImg = loadImage("images/covid.png");
   bossImg = loadImage("images/BossCovid.png");

   heliImg = loadImage("images/helicopter.png");
   armorImg = loadImage("images/armor.png"); 
   ammoImg = loadImage("images/ammo.png");
   win = loadImage("images/win.jpg");
   
   //Loading all the sounds.
   shootSound = loadSound('Gun.mp3.mp3');
}

function setup() {
  //Creating the canvas.
  var canvas = createCanvas(displayWidth+1000, 700);
  
  //Creating the player.
  player = createSprite(150,550,20,20);
  player.scale = 0.3;
  player.setCollider("rectangle",-50,0,300,250)
  player.addImage(playerImg);
  
  //Creating the helicopter which will be invisible in PLAY state.
  helicopter = createSprite(2450,425,20,20);
  helicopter.addImage(heliImg);
  helicopter.visible = false;
  
  //Creating the boss covid.
  bossCovid = createSprite(helicopter.x-100 , player.y-100 , 20,20 );
  bossCovid.addImage(bossImg);
  bossCovid.scale = 0.65;
  bossCovid.visible = false;

  //Creating the invisible edges.
  edge1 = createSprite(0,350,15,1000);
  edge1.visible = false;

  edge2 = createSprite(2480,350,15,1000);
  edge2.visible = false;

  edge3 = createSprite(displayWidth/2,630,displayWidth*2+1250,10);
  edge3.visible = false;
  
  //creating the armor and ammoBox to help the player.
  armor1 = createSprite(displayWidth/2+500 , 550 , 20,20);
  armor1.scale = 0.3
  armor1.addImage(armorImg);

  ammoBox = createSprite(displayWidth/2+1500 , 515,20,20);
  ammoBox.addImage(ammoImg);
  ammoBox.scale = 0.2;
  
  //Creating the groups.
  covidGroup = createGroup();
 syringeGroup = createGroup();
}

function draw() {
  background(backgroundImg);
  
  //Making the player collide with the edges.
  player.collide(edge1);
  player.collide(edge2);
  
  //Displaying the life, kills and ammo of the player.
  textSize(22);
  fill("Blue")
  stroke("red");
  strokeWeight(2);
  textStyle(BOLD);
  textFont("Algerian");

  text ("KILLS : "+ kills , player.x , player.y - 250);
  text("Life : "+ life , player.x , player.y-150);
  text("AMMO : " + ammo , player.x , player.y - 200);

  if(gameState === "INSTRUCTIONS"){
    //Displaying the instruction of the game.
    text("Kill 25 Covid-19 viruses to lure the Covid boss.You have 50 syringes to do so." , displayWidth/2,25);
    text("Once you find the Covid boss , kill it and escape with the helicopter in the given time", displayWidth/2,75);
    text("Press UP ARROW to start" , displayWidth/2,135);
    text("TIP : Aim at Covid-19 head. " , displayWidth/2,110);

    //Writing a conditon to start the game.
    if(keyIsDown(UP_ARROW)){
      gameState = "PLAY";
    }
  }

  if(gameState === "PLAY"){
     //Condition to spawn the Covid.
    if(covidCount<=60){
    spawnCovid();
    }
    //Conditions for using armor and the ammo box..
    if(player.isTouching(armor1)&& life<200){
      armor1.destroy();
      life = 200;
    }
  
    if(player.collide(ammoBox)){
      ammoBox.destroy();
      ammo+= 20;
    }
    //Destroying covid when hit by a bullet and increasing the kill.
    if(syringeGroup.isTouching(covidGroup)){
       covidGroup.get(0).destroy();
       kills++;
      syringeGroup.get(0).lifetime = 0;
     }
      //Decreasing player health when in contact with covid.
    if(covidGroup.isTouching(player)){
       covidGroup.get(0).velocityX = 0;
       life--;
     }
    
  //Making the player move.
  if(keyIsDown(RIGHT_ARROW)){
       changePosition(10,0);
       player.addImage(playerImg);
  }

  if(keyIsDown(LEFT_ARROW)){
      changePosition(-10,0);
  }

  if(keyIsDown(UP_ARROW)&& player.y>470){
      changePosition(0,-1);
      player.scale -=0.001;
  }

  if(keyIsDown(DOWN_ARROW)&& player.y<600){
      changePosition(0,1);
      player.scale +=0.001;
  }

  //Condition for ending the game.
  if(life === 0 || ammo === 0){
      gameState = "END";
      life = 0;
  }
  //Condition for changing the gameState to extend.
  if(player.collide(edge2) && kills >= 25){
     syringeGroup.destroyEach();
      covidGroup.destroyEach();
      player.x = 150;
      gameState = "EXTEND";
  }
}

if(gameState === "EXTEND"){
  //Displaying the rule , time left and bossCovid health.
  fill("RED");
  stroke("BLACK");
  strokeWeight(7);
  textSize(20);

  text("KILL THE BOSS Covid & REACH THE HELICOPTER TO WIN",displayWidth/2 , 100);
  text("TIME LEFT : " + timer , player.x , player.y + 100);
  text("Covid HEALTH : "+ covidHealth , bossCovid.x-150 , bossCovid.y - 270);
  //Making the helicopter and boss covid visible.
  helicopter.visible = true;
  bossCovid.visible = true;
  //Giving the boss covid a velocity.
  bossCovid.velocityX = -0.5;
  //Decreasing player health when in contact with covid.
  if(covidGroup.isTouching(player)){
    life--;
   }
  //Conditions for using armor and the ammo box..
  if(player.isTouching(armor1)&& life<200){
    armor1.destroy();
    life = 200;
  }

  if(player.collide(ammoBox)){
    ammoBox.destroy();
    ammo+= 20;
  }
 //decreasing covid health when hit by a bullet.
  if(syringeGroup.isTouching(covidGroup)){
    covidGroup.get(0).destroy();
     kills++;
     bulletGroup.get(0).lifetime = 0;
   }
   //Making the timer work.
  if(World.frameCount%25 === 0){
   timer = timer - 1;
  }
  //Spawning covid.
  if(World.frameCount%1 === 0){
    covidGroup.setVelocityXEach(-7);
    spawnCovid();
  }
  //Decreasing boss covid health when hit by bullet. 
  if(syringeGroup.isTouching(bossCovid)){
  covid-=5;
  syringeGroup.get(0).destroy();
  }
  //Destroying boss covid when its health is 0. 
  if(covidHealth === 0){
   covidHealth = 0;
    bossCovid.destroy();
  }
  //Giving condition to win the game.
  if(player.isTouching(helicopter)){
     gameState = "WIN";
  }
 //Making the player move.
 if(keyIsDown(RIGHT_ARROW)){
   changePosition(10,0);
   player.addImage(playerImg);
 }

 if(keyIsDown(LEFT_ARROW)){
   changePosition(-10,0);
 }

 if(keyIsDown(UP_ARROW)&& player.y>470){
   changePosition(0,-1);
   player.scale -=0.001;
 }

 if(keyIsDown(DOWN_ARROW)&& player.y<600){
   changePosition(0,1);
   player.scale +=0.001;
 }
//Giving condition to end the game.
 if(player.isTouching(bossCovid)){
   gameState = "END";
 }
//Giving condition to end the game.
 if(life === 0 || ammo === 0 || timer ===0){
   gameState = "END";
   life = 0;
}
}

if(gameState === "WIN"){
    //Changing the background.
    background(win);
    //Destroying all the chracters.
    bossCovid.destroy();
    player.destroy();

    helicopter.destroy();
    armor1.destroy();
    ammoBox.destroy();

    syringeGroup.destroyEach();
    syringeGroup.setLifetimeEach(0);
    covidGroup.destroyEach();

    //Pausing the sounds.
    shootSound.stop();  
}

if(gameState === "END"){
  //Changing the background.
  background(bg2);
  //Destroying the characters.
  bossCovid.destroy();
  player.destroy();

  armor1.destroy();
  ammoBox.destroy(); 
  helicopter.destroy();

 covidGroup.destroyEach();
 syringeGroup.destroyEach();

  //Pausing the sounds.
  shootSound.stop();
}
  drawSprites();
}

function changePosition(x,y){
  //Function for changing player position.
  player.x = player.x+x;
  player.y  = player.y+y
}

function keyPressed(){
  if(keyCode === 32 && gameState !== "INSTRUCTIONS" && gameState !== "END" ){
    //Function for shooting a bullet when  SPACE bar is pressed and decreasing the syringes
    shoot();
    ammo = ammo -0.5;
  }
}

function spawnCovid(){
  if(World.frameCount%85===0){
    //Spawing the covid.
    covid = createSprite(2470,random(480,615),20,20);
    covid.setCollider("rectangle",0,-100,70,135);
    covid.velocityX = -10;
    covid.addImage(covidImg);
    covid.scale = random(0.35,0.4);

    covidCount++;
    covid.lifetime = 280;
    //Adding covid to group.
    covidGroup.add(covid);
  }
}

function shoot(){
    //Creating the syringes.
    syringe = createSprite(player.x+35 , player.y-55 , 20,20);
    syringe.setCollider("rectangle",50,0,200,50);
    syringe.velocityX = 20;
    syringe.lifetime = 100;
    syringe.addImage(syringeImg);
    syringe.scale = 0.2;
    //Adding syringe to the group.
    syringeGroup.add(syringe);
    //Playing a sound.
    shootSound.play();
}

let a = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];
let pointsO = 0;
let pointsX = 0;
let turn = 0;//0 means turn for "O"  1 means turn for "X"
let stop = true;// false means game runs, true means game stops

let canvasX = 600;
let canvasY = 600;


// coin flip variables
let startTime;
let durationTime = 2000; // base value = 2000, means 2 seconds
let rotating = false;
let flipButton;
let startGameButton;
let coin;
let rotationSpeed = 10; // base value = 10


//game box color change variables
let startColorTime;
let colorDurationTime = 1000;//minimum it should be 1000 under this creates problem, 1200 recommended
let currentColor;



//game end line variables
let startLineTime;
let lineDurationTime= 500;
let button;
let currentLineTime;
let lineLenght;
let startX;
let startY;
let isHorizontal=0;//0 for horizontal, 1 for vertical,2 for \ ,3 for /
let isBlue;




function setup() {
  let gameCanvas = createCanvas(canvasX, canvasY, WEBGL);
  gameCanvas.parent('game');


  flipButton = createButton('Flip Coin');
  flipButton.show();
  flipButton.position(canvasX * 2, canvasY / 6);
  flipButton.mousePressed(flipCoin);

  // Create the remove button

  startGameButton = createButton('Start Game');
  startGameButton.position(canvasX * 2, canvasY / 6);
  startGameButton.hide();
  startGameButton.mousePressed(function() {
    rotating = false; // Stop animation on remove button click
    var roundElement = document.getElementById("round");
    var roundNumber = parseInt(roundElement.innerHTML); // Get the current round number and convert it to an integer
    roundNumber++; // Increment the round number
    roundElement.innerHTML = roundNumber;
    clear();
    noLoop();
    restart();
    startGameButton.hide();
    // Clear canvas after stopping animation
  });


}


function draw() {

  

  
  //GAME END LİNES//
  if(stop === true)
  {
    translate(-canvasX/2,-canvasY/2,0);
    fill(255,50,0);
    strokeWeight(canvasX/40);
    currentLineTime = millis() - startLineTime;
    if (currentLineTime < lineDurationTime)
      {
          lineLenght = map(currentLineTime, 0, lineDurationTime, 0, canvasX/4*3);
          stroke('rgba(255,77,77, 0.50)');
          if(isBlue)
            stroke('rgba(77,77,255,0.50)');


          switch (isHorizontal){

            case 0:
              {
                line(startX-lineLenght/2,startY,startX+lineLenght/2,startY);
                stroke(255, 200, 200);
                if(isBlue)
                  stroke('rgba(200,200,255,1)');
                strokeWeight(canvasX/120);
                line(startX-lineLenght/2,startY,startX+lineLenght/2,startY);
                break;
              }
            case 1:
            {
              line(startX,startY-lineLenght/2,startX,startY+lineLenght/2);
              stroke(255, 200, 200);
              if(isBlue)
                stroke('rgba(200,200,255,1)');
              strokeWeight(canvasX/120);
              line(startX,startY-lineLenght/2,startX,startY+lineLenght/2);
              break;
            }
            case 2:
            {
              line(startX-lineLenght/2,startY-lineLenght/2,startX+lineLenght/2,startY+lineLenght/2);
              stroke(255, 200, 200);
              if(isBlue)
                stroke('rgba(200,200,255,1)');
              strokeWeight(canvasX/120);
              line(startX-lineLenght/2,startY-lineLenght/2,startX+lineLenght/2,startY+lineLenght/2);
              break;
            }
            case 3:
            {
              line(startX-lineLenght/2,startY+lineLenght/2,startX+lineLenght/2,startY-lineLenght/2);
              stroke(255, 200, 200);
              if(isBlue)
                stroke('rgba(200,200,255,1)');
              strokeWeight(canvasX/120);
              line(startX-lineLenght/2,startY+lineLenght/2,startX+lineLenght/2,startY-lineLenght/2);
              break;
            }

          }
      }
  }


  //GAME LINES//

  if (stop === false) {

    push();//game lines
    translate(-canvasX / 2, -canvasY / 2);
    specularMaterial(255);
    shininess(50);
    pointLight(255, 255, 255, 1, canvasY / 7.5, 100);
    pointLight(255, 255, 255, 1, -canvasY / 7.5, 100);
    pointLight(255, 255, 255, 100, -canvasY / 7.5, 100);
    pointLight(255, 255, 255, -100, -canvasY / 7.5, 100);
    let colorBlue;
    let colorRed;
    let currenColorTime = millis() - startColorTime;


    if (currenColorTime < colorDurationTime && turn === 0) {
      colorRed = map(currenColorTime, 0, colorDurationTime, 0, 255);
      fill(colorRed, 50, 255 - colorRed);
      //console.log("Red:" + colorRed);
      //this project made by 8th group, other than us no one can use this code.
    }
    else if (currenColorTime < colorDurationTime && turn === 1) {
      colorBlue = map(currenColorTime, 0, colorDurationTime, 0, 255);
      fill(255 - colorBlue, 50, colorBlue);
      //console.log("Blue:" + colorBlue);
    }//çerçeve rengi
    else {
      fill(currentColor);
    }

    if (colorBlue > 245) {
      currentColor = color(0, 50, 255);

    }
    if (colorRed > 245) {
      currentColor = color(255, 50, 0);
    }
    
     

    noStroke();
    rotateZ(PI / 2);
    translate(canvasY / 2, -canvasX / 3, -canvasX / 60);
    box(canvasY, canvasX / 60);
    translate(0, -canvasX / 3, 0);
    box(canvasY, canvasX / 60);

    rotateZ(PI / 2);
    translate(canvasX / 6, canvasY / 6, -canvasX / 60);
    box(canvasY, canvasX / 60);
    translate(0, -canvasY / 3, 0);
    box(canvasY, canvasX / 60);
    pop();//game lines ends
  }



  //COIN//


  // Draw the coin only if rotating or remove button hasn't been pressed
  if (rotating || !startGameButton.mousePressed) {
    translate(canvasX / 2, canvasY / 2);
    let currenTime = millis() - startTime;// calculates time and use it for coin spin duration
    background('rgba(0, 0, 0, 0)');
    // If elapsed time is less than duration, flip the ellipsoid
    if (currenTime < durationTime) {
      let rotation = map(currenTime, 0, durationTime, 0, PI);// if we want to rotate something we have to use angles so we are remapping currenTime values to 0 to PI
      rotateX(rotation * rotationSpeed);
      rotateZ(rotation);
      rotateY(rotation);

    } else {
      noLoop();
      rotating = false;
      startGameButton.show();
      // Stop looping and mark rotation as finished
      if (coin < 0.5) {
        turn = 1;//changes turn to X
        rotateX(PI * 2);//rotate to X side of coin
        console.log("x plays");
        currentColor = color(0, 50, 255);// it will change box color when coin stops
      }
      else if (coin >= 0.5) {
        turn = 0;//changes turn to O
        rotateX(PI);//rotate to O side of coin
        console.log("o plays");
        currentColor = color(255, 50, 0);// it will change box color when coin stops
      }



    }
    push();
    specularMaterial(50);//to change light and materials of coin
    shininess(10);
    pointLight(255, 255, 255, 1, canvasY / 7.5, 100);
    pointLight(255, 255, 255, 1, -canvasY / 7.5, 100);
    noStroke();


    fill(255, 215, 0);// main coin
    ellipsoid(canvasX / 5, canvasY / 5, canvasX / 100, 24, 16);


    translate(0, 0, -canvasX / 40);//o side of coin
    drawcircle(0, 0);


    translate(0, 0, canvasX / 15);// x side of coin
    drawcross(0, 0);

    pop();
  }
}



function flipCoin() {
  stop = true;//when coin comes game stops
  startTime = millis();// gets value for startTime
  rotating = true;
  loop();

  coin = random(0, 1);// to decide randomly
  console.log("coin value: " + coin);

  startGameButton.hide();//hides buttons when spinning
  flipButton.hide();
}




function mousePressed() {


  let i, j;// i x eksenindeki ilerlemeyi yapmak için j ise y eksenindeki ilerlemeyi yapmak için
  if (stop === true) {
    return;
  }
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      if (mouseX <= canvasX / 3 * (i + 1) && mouseY <= canvasY / 3 * (j + 1) && mouseX >= 0 && mouseY >= 0) {

        if (a[i][j] === 0) { // Check if the slot is empty
          translate(-canvasX / 2, -canvasY / 2);
          if (turn === 0) {
            a[i][j] = 1;
            drawcircle(canvasX / 3 * i + canvasX / 6, canvasY / 3 * j + canvasY / 6);

          }

          else if (turn === 1) {
            a[i][j] = 4;
            drawcross(canvasX / 3 * i + canvasX / 6, canvasY / 3 * j + canvasY / 6);

          }
          startColorTime = millis();// starts color change
          turn = (turn + 1) % 2;// Toggle turn between 0 and 1

        }

        return; // exit the loop once a square is found

      }
    }
  }
}

function mouseReleased() {


  if (stop === true) {
    return;//if game not running do not checks win
  }
  checkWin(); // checks win every time mouse relased if game still running

  var outputO = document.getElementById("scoreO");//to write points in html
  outputO.innerHTML = pointsO;

  var outputX = document.getElementById("scoreX");
  outputX.innerHTML = pointsX;
  if (pointsX >= 100) {
    document.querySelector(".col-displayX").style.fontSize = "60px";
  }
  if (pointsO >= 100) {
    document.querySelector(".col-displayO").style.fontSize = "60px";
  }
}


function drawcircle(x, y) {
  push();
  specularMaterial(10);//
  ambientLight(100, 10, 0, 255);//
  pointLight(255, 255, 255, x, y, 30);//bu işaretli yerler rengini falan düzenlemek için
  noStroke();//
  fill(255, 0, 0);//
  translate(x, y);
  torus(canvasX / 10, canvasY / 30);
  pop();
}

function drawcross(x, y) {
  push();
  specularMaterial(50);//
  shininess(0);//
  ambientLight(0, 10, 120, 10);// bu işaretli yerler rengini falan düzenlemek için
  noStroke();//
  fill(0, 0, 255);//
  translate(x, y);
  rotateZ(PI / 4);
  box(canvasX / 4, canvasX / 20);
  rotateZ(PI / 2);
  box(canvasX / 4, canvasX / 20);
  pop();
}



function checkWin() {
  strokeWeight(canvasX / 40);//neon line strokeweight

  let i;
  let j;
  translate(-canvasX / 2, -canvasY / 2);
  for (i = 0; i < 3; i++) //checks win in vertical lines
  {
    if (a[i][0] + a[i][1] + a[i][2] === 3) {
      oWins();
      drawGameEndLine((i + 1) * canvasX / 3 - canvasX / 6, canvasY/2,1,false);
    }
    if (a[i][0] + a[i][1] + a[i][2] === 12) {
      xWins();
      drawGameEndLine((i + 1) * canvasX / 3 - canvasX / 6, canvasY/2,1,true);
    }
  }

  if(stop)
    return;


  for (j = 0; j < 3; j++) // checks win in horizontal lines
  {
    if (a[0][j] + a[1][j] + a[2][j] === 3) {
      oWins();
      drawGameEndLine(canvasX/2, (j + 1) * canvasY / 3 - canvasY / 6,0,false);
    }

    if (a[0][j] + a[1][j] + a[2][j] === 12) {
      xWins()
      drawGameEndLine(canvasX/2, (j + 1) * canvasY / 3 - canvasY / 6,0,true);
      ;

    }
  }

  if(stop)
    return;

  if (a[0][0] + a[1][1] + a[2][2] === 3)//checks win in \ 
  {
    oWins();
    drawGameEndLine(canvasX/2, canvasY/2,2,false);


  }
  if (a[0][0] + a[1][1] + a[2][2] === 12) {
    xWins();
    drawGameEndLine(canvasX/2, canvasY/2,2,true);
  }

  if(stop)
    return;


  if (a[2][0] + a[1][1] + a[0][2] === 3) // checks win in /
  {
    oWins();
    drawGameEndLine(canvasX/2, canvasY/2,3,false);
  }
  if (a[2][0] + a[1][1] + a[0][2] === 12) {
    xWins();
    drawGameEndLine(canvasX/2, canvasY/2,3,true);
  }

  if(stop)
    return;

  if (a[0][0] != 0 && a[0][1] != 0 && a[0][2] != 0 && a[1][0] != 0 && a[1][1] != 0 && a[1][2] != 0 && a[2][0] != 0 && a[2][1] != 0 && a[2][2] != 0) {//Checks for draw
    pointsX++;
    pointsO++;
    stop = true;//stops game 
    flipButton.show();//flip coin button appears
  }
}


function oWins() {
  pointsO = pointsO + 3;
  stop = true;
  console.log("Owins:", pointsO);
  
  text('O WIN!', 50, 50);
  flipButton.show();//flip coin button appears
}

function xWins() {
  pointsX = pointsX + 3;
  stop = true;
  console.log("Xwins:", pointsX);
  
  text('X WIN!', 150, 650);
  flipButton.show();//flip coin button appears
}

function restart() {
  loop();
  //redraw canvas
  stroke(10);
  translate(-canvasX / 2, -canvasY / 2);//When we use WEBGL we have to translate everything to -150,-150 to achive normal canvas origin
  background('rgba(0, 0, 0, 0)');



  stop = false;//run game again
  a = [//reset the values 
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
}

function drawGameEndLine(startx,starty,vh,isblue){
  isBlue=isblue;
  isHorizontal=vh;
  startX=startx;
  startY=starty;
  startLineTime = millis();
  loop();
}


const backgroundColor = 'white';

let gameState = 'runGame';

let handPose;
let video;
let hands = [];
let faces = [];

const THUMB_TIP = 4;
const INDEX_FINGER_TIP = 8;
const MIDDLE_FINGER_TIP = 12;
const RING_FINGER_TIP = 16;
const PINKY_FINGER_TIP = 20;

const LEFT_LIP = 61;
const RIGHT_LIP = 308;
const TOP_LIP = 0;
const BOTTOM_LIP = 17;

let thumb, index, middle, ring, pinky;

let lLip, rLip, tLip, bLip;

showPoints = false;

let ball, ball1, ball2, join

let glove1, glove2, glove3, glove4, glove5
let myFood;

let newFoodCounter = 0;

let score = 0;
let scoreBoard;

let timer;
let timerText;

let size = 50;
function preload(){
    //Asset Preload
    gloveImg = loadImage('assets/entities/glove.png');
    foodImg = loadImage('assets/entities/food.png');

    eatSound = loadSound('assets/sounds/eat.ogg')
    eatSound.volume = 0.5;

	// Load the handPose model
	handPose = ml5.handPose({maxHands:1, flipped: true });

	// Load the faceMesh model
    faceMesh = ml5.faceMesh({maxFaces:1, flipped: true });

	// Create the webcam video and hide it
	video = createCapture(VIDEO);
	video.hide();
}


function setup(){
    initializeObjects();

    //canvas settings
    document.body.style.backgroundColor = color(backgroundColor);
	createCanvas(video.width, video.height);
    displayMode('centered');

	// start detecting hands from the webcam video
	handPose.detectStart(video, gotHands);

	// start detecting faces from the webcam video
    faceMesh.detectStart(video, gotFaces);

    glove1 = new gloves.Sprite();
    glove2 = new gloves.Sprite();
    glove3 = new gloves.Sprite();
    glove4 = new gloves.Sprite();
    glove5 = new gloves.Sprite();


    //Glove Finger Colliders
    //Thumb
    glove1.addCollider( -32, 18, 20);
    glove2.addCollider( -32, 18, 20);
    glove3.addCollider( -32, 18, 20);
    glove4.addCollider( -32, 18, 20);
    glove5.addCollider( -32, 18, 20);


    //Pointer
    glove1.addCollider(-25, -25, 20);
    glove2.addCollider(-25, -25, 20);
    glove3.addCollider(-25, -25, 20);
    glove4.addCollider(-25, -25, 20);
    glove5.addCollider(-25, -25, 20);


    //Middle
    glove1.addCollider(  2, -30, 20);
    glove2.addCollider(  2, -30, 20);
    glove3.addCollider(  2, -30, 20);
    glove4.addCollider(  2, -30, 20);
    glove5.addCollider(  2, -30, 20);


    //Pinky
    glove1.addCollider( 27, -17, 20);
    glove2.addCollider( 27, -17, 20);
    glove3.addCollider( 27, -17, 20);
    glove4.addCollider( 27, -17, 20);
    glove5.addCollider( 27, -17, 20);

    ui();
}

function draw(){
    clear();
	switch(gameState){
        case 'runGame': runGame();
        break;
        case 'start': startMenu();
        break;
        case 'end': endMenu();
        break;
    }
      
}

function startMenu(){

}

function endMenu(){

}

function runGame(){
    // Draw the webcam video
	image(video, 0, 0, width, height);

	// Draw all the hand points
    drawPoints(showPoints);

    //Timer
    timer = round(frameCount/60,1);
    timerText.innerText = `Time: ${timer}s`


    // add food every 60 frame (1 second)
    if (food.length < 12){
        newFoodCounter++; 
        if (newFoodCounter > 100) {
            newFoodCounter = 0;
            let newFood = new food.Sprite();    
        }  
    }

    if (faces.length > 0){  
        lLip = faces[0].keypoints[LEFT_LIP];
        rLip = faces[0].keypoints[RIGHT_LIP];
        tLip = faces[0].keypoints[TOP_LIP];
        bLip = faces[0].keypoints[BOTTOM_LIP];

        if (hands.length > 0) {
            thumb = hands[0].keypoints[THUMB_TIP];
            index = hands[0].keypoints[INDEX_FINGER_TIP];
            middle = hands[0].keypoints[MIDDLE_FINGER_TIP];
            ring = hands[0].keypoints[RING_FINGER_TIP];
            pinky = hands[0].keypoints[PINKY_FINGER_TIP];


            glove1.x = thumb.x;
            glove1.y = thumb.y;

            glove2.x = index.x;
            glove2.y = index.y;

            glove3.x = middle.x;
            glove3.y = middle.y;

            glove4.x = ring.x;
            glove4.y = ring.y;

            glove5.x = pinky.x;
            glove5.y = pinky.y;

        }
        for(f of food) ateCheck(f);
    }
}

function ateCheck(obj){
    if(obj.x>lLip.x && obj.x<rLip.x && obj.y>tLip.y && obj.y<bLip.y) {
        eatSound.play();
        score+=50;
        scoreBoard.innerText= `Score: ${score}`;
        obj.remove();
    }
}

function drawPoints(visible){
    if(visible){
        allSprites.debug = true;
	    // Draw all the tracked hand points
        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                fill(0, 255, 0);
                noStroke();
                circle(keypoint.x, keypoint.y, 10);
            }
        }
    
        // Draw all the tracked face points
        for (let i = 0; i < faces.length; i++) {
            let face = faces[i];
            for (let k = 0; k < face.keypoints.length; k++) {
                let keypoint = face.keypoints[k];
                fill(0, 255, 0);
                noStroke();
                circle(keypoint.x, keypoint.y, 10);
            }
        }
    }
}

function ui(){
    scoreBoard = createP('Score: ' + score);
    scoreBoard.position(10,10)
    scoreBoard.classList.add('score')

    timerText = createP('Time: 0.0s')
    timerText.position(scoreBoard.x + 30, 10)
    timerText.classList.add('timer')


    let btn = createButton('Debug');
    btn.position(1500, 10)
    btn.classList.add('btn-1')
    btn.addEventListener('click', () => {
        if (showPoints){
            showPoints = false;
        } else {
            showPoints = true;
        }
        if(allSprites.debug){
            allSprites.debug = false;
        }else {
            allSprites.debug = true;
        }
});

}


// Callback function for when handPose outputs data
function gotHands(results) {
	// save the output to the hands variable
	hands = results;
}


// Callback function for when faceMesh outputs data
function gotFaces(results) {
    // Save the output to the faces variable
    faces = results;
  }
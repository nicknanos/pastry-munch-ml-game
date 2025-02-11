let gloves, food
let handImg, foodImg
let eatSound
let spawnOffset = 200;
function initializeObjects(){
    gloves = new Group();
    gloves.w = 50;
    gloves.h = 30;
    gloves.x = 0;
    gloves.y = 0;
    gloves.diameter = 90;
    gloves.rotationLock = 'true';
    gloves.image = gloveImg;
    gloves.image.scale = 0.3;
    gloves.image.offset.x = -10;
    gloves.image.offset.y = -20;

    gloves.overlap(gloves);

    food = new Group();
    food.w = 55;
    food.h = 50;
    food.x = () => random(spawnOffset, width- spawnOffset);  
    food.y = () => random(spawnOffset, height-spawnOffset);
    food.rotationLock = 'true';
    food.image = foodImg;
    food.image.scale = 0.5;
}
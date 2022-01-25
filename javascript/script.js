let time = new Date();
let deltaTime = 0;

let groundY = 22;
let velocityY = 0;
let impulse = 900;
let gravity = 2500;

let dinoPosX = 42;
let dinoPosY = groundY;

let groundX = 0;
let velocityStage = 1280 / 3;
let gameVelocity = 1;
let score = 0;

let stopped = false;
let jumping = false;

let timeUntilObstacle = 2;
let timeObstacleMin = 0.7;
let timeObstacleMax = 1.8;
let obstaclePosY = 16;
let obstacles = [];

let timeUntilCloud = 0.5;
let timeCloudMin = 0.7;
let timeCloudMax = 2.7;
let minCloudY = 100;
let maxCloudY = 270;
let velocityCloud = 0.5;
let clouds = [];

let $container;
let $dinosaur;
let $textScore;
let $ground;
let $gameOver;

loopingGame();

const update = () => {
  if (stopped) return;

  moveGround();
  moveDino();
  decideCreateObstacle();
  decideCreateClouds();
  moveObstacles();
  moveClouds();
  detectCollision();

  velocityY -= gravity * deltaTime;
};

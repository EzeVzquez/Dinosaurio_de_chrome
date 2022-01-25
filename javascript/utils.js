// Inicia el movimiento del juego
const loopingGame = () => {
    const init = () => {
        time = new Date();
        start();
        loop();
    };

    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(init, 1);
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }

    const loop = () => {
        deltaTime = (new Date() - time) / 1000;
        time = new Date();
        update();
        requestAnimationFrame(loop);
    };
};

// Calcula el desplazamiento del juego
const calculateDisplacement = () => {
    return velocityStage * deltaTime * gameVelocity;
};

// Mueve el ground
const moveGround = () => {
    groundX += calculateDisplacement();
    $ground.style.left = -(groundX % $container.clientWidth) + "px";
};

// hace saltar al dinosaurio
const jump = () => {
    if (dinoPosY === groundY) {
        jumping = true;
        velocityY = impulse;
        $dinosaur.classList.remove("running");
    }
};

// tecla para hacer saltar al dinosaurio
const handleKeyDown = (ev) => {
    if (ev.keyCode == 32) {
        jump();
    }
};
// crea la animacion del dinosaurio corriendo cuando toca el suelo
const touchGround = () => {
    dinoPosY = groundY;
    velocityY = 0;
    if (jumping) {
        $dinosaur.classList.add("running");
    }
    jumping = false;
};

// Mueve el dinosaurio en el container
const moveDino = () => {
    dinoPosY += velocityY * deltaTime;
    if (dinoPosY < groundY) {
        touchGround();
    }
    $dinosaur.style.bottom = dinoPosY + "px";
};


// Crea los cactus
const createObstacle = () => {
    let obstacle = document.createElement("div");
    $container.appendChild(obstacle);
    obstacle.classList.add("cactus");
    if (Math.random() > 0.5) obstacle.classList.add("cactusTwo");
    obstacle.posX = $container.clientWidth;
    obstacle.style.left = $container.clientWidth + "px";
    obstacles.push(obstacle);
    timeUntilObstacle =
        timeObstacleMin +
        (Math.random() * (timeObstacleMax - timeObstacleMin)) / gameVelocity;
};

// Decide cuando crear los obstaculos
const decideCreateObstacle = () => {
    timeUntilObstacle -= deltaTime;
    if (timeUntilObstacle <= 0) {
        createObstacle();
    }
};

// Va sumando los puntos de score
const winPoints = () => {
    score++;
    $textScore.innerText = score;
    if (score == 10) {
        gameVelocity = 1.5;
    } else if (score == 20) {
        gameVelocity = 2;
    } else if (score == 25) {
        gameVelocity = 2.5
    }
    $ground.style.animationDuration = (3 / gameVelocity) + "s";
};

// Mueve los cactus
const moveObstacles = () => {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].posX < -obstacles[i].clientWidth) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
            obstacles.splice(i, 1);
            winPoints();
        } else {
            obstacles[i].posX -= calculateDisplacement();
            obstacles[i].style.left = obstacles[i].posX + "px";
        }
    }
};

//Crea la colision
const isCollision = (a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) => {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
};

//Cambia la animacion del dinosaurio cuando choca con un cactus
const crashed = () => {
    $dinosaur.classList.remove("running");
    $dinosaur.classList.add("crashed");
};

// Hace saltar el cartel de gameOver
const gameOver = () => {
    crashed();
    $gameOver.style.display = "block";
    stopped = true;
};

// Detecta la colision de los cactus
const detectCollision = () => {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].posX > dinoPosX + $dinosaur.clientWidth) {
            break; 
        } else {
            if (isCollision($dinosaur, obstacles[i], 10, 30, 15, 20)) {
                gameOver();
            }
        }
    }
};

// Crea las nubes
const createCloud = () => {
    let cloud = document.createElement("div");
    $container.appendChild(cloud);
    cloud.classList.add("cloud");
    cloud.posX = $container.clientWidth;
    cloud.style.left = $container.clientWidth + "px";
    cloud.style.bottom =
        minCloudY + Math.random() * (maxCloudY - minCloudY) + "px";
    clouds.push(cloud);
    timeUntilCloud =
        timeCloudMin +
        (Math.random() * (timeCloudMax - timeCloudMin)) / gameVelocity;
};

// Decide cuando crear las nubes
const decideCreateClouds = () => {
    timeUntilCloud -= deltaTime;
    if (timeUntilCloud <= 0) {
        createCloud();
    }
};

// hace que las nubes se muevan
const moveClouds = () => {
    for (let i = clouds.length - 1; i >= 0; i--) {
        if (clouds[i].posX < -clouds[i].clientWidth) {
            clouds[i].parentNode.removeChild(clouds[i]);
            clouds.splice(i, 1);
        } else {
            clouds[i].posX -= calculateDisplacement() * velocityCloud;
            clouds[i].style.left = clouds[i].posX + "px";
        }
    }
};

//Inicia el juego
const start = () => {
    $container = document.getElementById("container");
    $dinosaur = document.getElementById("dinosaur");
    $textScore = document.getElementById("score");
    $ground = document.getElementById("ground");
    $gameOver = document.getElementById("gameOver");
    document.addEventListener("keydown", handleKeyDown);
};
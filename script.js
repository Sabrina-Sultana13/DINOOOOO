let score = 0;
let cross = true;
let audio = new Audio("FastFeelBananaPeel-320bit.mp3");
let audiogo = new Audio("gameover.mp3");
let gameRunning = true;
let playerName = '';

function startGame() {
    playerName = prompt("Who is playing?");
    if (!playerName) playerName = "Player";
    updateScore(score);
}

setTimeout(() => {
    audio.play();
}, 1000);

document.addEventListener("DOMContentLoaded", function () {
    startGame();

    document.onkeydown = function (e) {
        if (gameRunning) {
            const dino = document.querySelector('.dino');
            const dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));

            if (e.keyCode == 38) {
                if (!dino.classList.contains("animateDino")) {
                    dino.classList.add("animateDino");
                    dino.style.left = (dinoX + 20) + "px";
                    setTimeout(() => {
                        dino.classList.remove("animateDino");
                    }, 700);
                }
            }

            if (e.keyCode == 39) {
                dino.style.left = (dinoX + 112) + "px";
            }

            if (e.keyCode == 37) {
                dino.style.left = (dinoX - 112) + "px";
            }
        }
    };
});

setInterval(() => {
    if (gameRunning) {
        const dino = document.querySelector('.dino');
        const gameOver = document.querySelector('.gameOver');
        const obstacle = document.querySelector('.obstacle');
        const dx = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
        const dy = parseInt(window.getComputedStyle(dino, null).getPropertyValue('bottom'));
        const ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
        const oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('bottom'));

        const offsetX = Math.abs(dx - ox);
        const offsetY = Math.abs(dy - oy);

        if (offsetX < 113 && offsetY < 100 && !dino.classList.contains("animateDino")) {
            gameRunning = false;
            gameOver.innerHTML = `${playerName}, Game Over😢 - You scored: ${score} - Reload to start over😊`;
            obstacle.classList.remove('obstacleAni');
            audio.pause();
            audiogo.play();
            jumpRotateAndFall(dino);
        } else if (offsetX < 145 && cross) {
            score += 1;
            updateScore(score);
            cross = false;
            setTimeout(() => {
                cross = true;
            }, 1000);
            setTimeout(() => {
                const aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
                const newDur = aniDur - 0.1;
                obstacle.style.animationDuration = newDur + 's';
                console.log("New Animation Duration : ", newDur);
            }, 500);
        }
    }
}, 10);

function jumpRotateAndFall(dino) {
    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        jumpHeight += 9;
        dino.style.bottom = `${jumpHeight}px`;

        if (jumpHeight >= 100) {
            clearInterval(jumpInterval);
            startRotationAndSlowFall(dino);
        }
    }, 20);
}

function startRotationAndSlowFall(dino) {
    let rotationAngle = 0;
    const fallInterval = setInterval(() => {
        const currentBottom = parseInt(window.getComputedStyle(dino, null).getPropertyValue('bottom'));

        dino.style.bottom = `${currentBottom - 1.5}px`;
        rotationAngle += 5;
        dino.style.transform = `rotate(${rotationAngle}deg)`;

        if (currentBottom <= -150) {
            clearInterval(fallInterval);
            audiogo.pause();  
            dino.style.bottom = '0px';
            dino.style.transform = 'rotate(0deg)';
        }
    }, 20);
}

function updateScore(score) {
    const scoreElement = document.getElementById('scoreCount');
    scoreElement.innerHTML = `${playerName}, Your Score: ${score}`;
}

function restartGame() {
    score = 0;
    gameRunning = true;
    const dino = document.querySelector('.dino');
    const gameOver = document.querySelector('.gameOver');
    const obstacle = document.querySelector('.obstacle');

    gameOver.innerHTML = 'Welcome to Dinosaur Hunter🌸';
    updateScore(score);

    dino.style.left = "12px";
    dino.classList.remove('animateDino');
    dino.style.bottom = '0px';

    obstacle.classList.add('obstacleAni');
    audio.currentTime = 0;
    audio.play();
}

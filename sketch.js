
const boardColors = ['black', '#d4d4f7', 'Lavender', 'aquamarine', 'lightpink'];
const playerImgUrl = ['img/black.gif', 'img/alteres.gif', 'img/dansefille.gif', 'img/dancing_simpson.gif'];
const playerImg = [];

const nbRow = 6, nbCol = 7;
const intervalTime = 450;
const GRAVITY = 4;
const VELOCITY = 20;
const ANGLE = (56/180) * Math.PI;
const TIMESLICE = 0.02;
var gameIsStarted = false;
var gameIsOver = false;
var gameIsIntro = true;
var videoIsPlaying = false;

var boardBuffer;

var nbPlayer;
var boardWidth = 800;
var boardHeight = 600;
var tuileWidth;
var tuileHeight;
var interval;
var sndAscend, sndDescend, sndBrasse, sndQuiz;
var sndMove = [];
var Tuiles = [];
var players = [];
var messages = [];
var imgQuiz = [];
var imgEchelle, imgSerpent, imgLastCell;
var lastNumber;
var activePlayer;
var btnPlay, btnNewGame, btnReset;
var deltaInterval;
var introFlag, beginFlag;
var font;
var positionPlayer, quizPlayer;

function preload(){ 
    

    playerImg[0]    = loadImage(playerImgUrl[0]);
    playerImg[1]    = loadImage(playerImgUrl[1]);
    playerImg[2]    = loadImage(playerImgUrl[2]);
    playerImg[3]    = loadImage(playerImgUrl[3]); 
    imgEchelle      = loadImage('img/Echelle.png');
    imgEchelle      = loadImage('img/echelle1.png');
    imgSerpent      = loadImage('img/Serpent1.png');
    imgLastCell     = loadImage('img/soleil2.gif');
    imgQuiz[0]      = loadImage('img/quiz1.png'); 
    imgQuiz[1]      = loadImage('img/quiz1.jpg'); 
    imgQuiz[2]      = loadImage('img/cochon3.jpg'); 
    imgQuiz[3]      = loadImage('img/chien1.jpg'); 
    sndAscend       = loadSound('sounds/ascend_toes.mp3');
    sndDescend      = loadSound('sounds/slip1.mp3');
    sndQuiz         = loadSound('sounds/quizmagic.mp3');
    sndBrasse       = loadSound('sounds/brasse.mp3');
    sndMove[0]      = loadSound('sounds/pop3.mp3');
    sndMove[1]      = loadSound('sounds/pop2.mp3');
    sndMove[2]      = loadSound('sounds/pop.mp3');
    sndMove[3]      = loadSound('sounds/pop.mp3');
    sndHorn         = loadSound('sounds/Clochette1.wav');
    startintro      = loadSound('sounds/startintro.mp3');
    font            = loadFont('LapsusPro-Bold.otf');
    
    sndMove[0].setVolume(.1);
    sndMove[1].setVolume(.1);
    sndMove[2].setVolume(.1);
    sndMove[3].setVolume(.1);
    sndAscend.setVolume(.1);
    sndDescend.setVolume(.1);
    sndBrasse.setVolume(.1);
    sndQuiz.setVolume(.1);

}

function setup(){
    boardWidth = document.getElementById('canvasholder').offsetWidth;
    boardHeight = boardWidth / 1.33;
    tuileWidth = boardWidth / nbCol;    
    tuileHeight = boardHeight / nbRow;
    document.getElementById('v1').setAttribute('data-vimeo-width', boardWidth * 0.75);
    document.getElementById('v2').setAttribute('data-vimeo-width', boardWidth * 0.75);
    var sketchholder = createCanvas(boardWidth, boardHeight);
    sketchholder.parent('canvasholder') 
    boardColor = color(200,0,200);
    btnNewGame = select('#btnNewgame');
    btnNewGame.mousePressed(newGame);
    btnPlay = select('#btnRoll');
    btnPlay.mousePressed(rollDice);
    btnReset = select('#btnReset');
    btnReset.mousePressed(reset);
    messages.push(new message());
    startintro.setVolume(.1);
    deltaInterval = 0;
    frameRate(30);
    quizPlayer = new videoplayer('v1');
    positionPlayer = new videoplayer('v2');
    positionPlayer.getChapters().then(function(chapters) {positionPlayer.chapters = chapters;});
    quizPlayer.getChapters().then(function(chapters) {quizPlayer.chapters = chapters;});
    window.addEventListener('load', resize, false);
    window.addEventListener('resize', resize, false); 
    document.getElementById("btnRoll").disabled = true;
}

function resize(){
    boardWidth = document.getElementById('canvasholder').offsetWidth;
    boardHeight = boardWidth / 1.33;
    tuileWidth = boardWidth / nbCol;    
    tuileHeight = boardHeight / nbRow;
    resizeCanvas(boardWidth, boardHeight);
    document.getElementById('v1').setAttribute('data-vimeo-width', boardWidth * 0.75);
    document.getElementById('v2').setAttribute('data-vimeo-width', boardWidth * 0.75);
    newGame();
}

function reset(){
    gameIsIntro = true;
    gameIsOver = false;
    gameIsStarted = false;
}

function gameOver(p){
    background('Violet');
    clearInterval(interval);
    gameIsStarted = false;
    gameIsOver = true;
    document.getElementById('gameover').style.display = 'block';
    document.getElementById('winplayer').innerText = 'Joueur ' + (p.offset + 1) + ' gagne!';
    document.getElementById('winplayerimg').src = playerImgUrl[p.offset] ;  
}

function pageIntro(){
    gameIsIntro = true;
    background(0);
    var a = select('#intro');
    a.style('display', 'block');
}

function newGame(){

    document.getElementById('intro').style.display = 'none';
    document.getElementById('gameover').style.display = 'none';
    nbPlayer = document.getElementById('nbPlay').value;
    gameIsStarted = false;
    clearInterval(interval);
    interval = setInterval(updateOneSec, intervalTime);
    initBoard();
    startintro.play();
    clear();
    players = [];
    activePlayer = 0;
    for (let i=0; i<nbPlayer; i++){
        players.push(new Player(i, playerImg[i], sndMove[i]));
    }
    nextPlayerImg();
    for (let i = 0; i < Tuiles.length; i++){
        setTimeout(function(){
            Tuiles[i].draw();
            if (i == Tuiles.length - 1){                     
                messages[0].print('Prêt!', 2000, 100, 200);
                introFlag = false;
                gameIsStarted = true;
                document.getElementById("btnRoll").disabled = false;
            }
        }, i * 15)
    }
    gameIsOver = false;
    gameIsIntro = false;
}

function nextPlayerImg(){
    var a = document.getElementById('btnRoll');
    a.style.backgroundImage = "url('" + playerImgUrl[activePlayer] + "')";
    a.disabled = false;
}

function rollDice() {   
    if (gameIsStarted){
        const dice = [...document.querySelectorAll(".die-list")];
        lastNumber = floor(random(1, 7));
        //lastNumber = 6;
        dice.forEach(die => {
            toggleClasses(die);
            die.dataset.roll = lastNumber;
        }); 
        sndBrasse.play();
        setTimeout(function(){
            let p = players[activePlayer];
            p.coups = lastNumber;
            activePlayer++;
            if (activePlayer > (nbPlayer - 1)){activePlayer = 0}
        }, 2000);  
    } 
}
  
function toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
}

function updateOneSec(){
    for (let p of players){p.update();}
}

function draw(){
    if (gameIsStarted){
        background(255);
        drawBoard();
        for (var p of players){
            if (p.offset != activePlayer){p.draw();}}
        players[activePlayer].draw();
    }

    if (gameIsIntro){pageIntro();}
    for (let m of messages){m.show();}
}

function displayTest(str){
    test = document.getElementById("test");
    test.innerHTML = str;
}

function videoPlayNext(v){

    var currChapter = v.chapters[v.currChapter];
    var x = document.getElementById(v.refid);

    v.chapterStart = currChapter.startTime;
    if (v.currChapter == v.chapters.length -1){
            v.getDuration().then(function(duration){
                v.chapterEnd = duration - 1;
            }).catch(function(error){
                console.log(error);
            });
    }
    else{
        v.chapterEnd = v.chapters[v.currChapter + 1].startTime;
    }

    v.setCurrentTime(v.chapterStart + 0.01).then(function(seconds){
        v.play().then(function(data){
            document.getElementById('btnRoll').disabled = true; 
            videoIsPlaying = true; 
            setTimeout(function(){x.style.display ='flex';}, 1000); 
            v.currChapter++;
            if (v.currChapter > v.chapters.length - 1){v.currChapter = 0}
            //v.chapterEnd = v.chapterStart + 5;
            v.on('pause', function(data){
                document.getElementById('btnRoll').disabled = false; 
                x.style.display ='none';
            });

            v.on('timeupdate', function(data){
                if (data.seconds >= v.chapterEnd){
                    v.pause();
                    //v.off();
                }
            });
        });
        
    }).catch(function(error){
        console.log(error);
    });
}


class Player{
   
    constructor(offset, image, snd){
        this.position = 0;
        this.coups = 0;
        this.currTuile = Tuiles[0];
        this.offset = offset;
        this.snd = snd;
        this.pos = createVector(this.currTuile.center.x, this.currTuile.center.y);
        this.nextPos = createVector(this.currTuile.center.x, this.currTuile.center.y);
        this.isMoving = false;
        this.img = image;
        this.hasPendingAction = false;
        this.dir = -1;
    }

    shareTuile(){
        return players.filter(x => x.currTuile.numero == this.currTuile.numero).length;
    }
   
    update(){
        

        if (this.offset == activePlayer){
            this.img.play();
        } else{



            this.img.pause();
        }

        if (this.coups > 0){    

            document.getElementById('btnRoll').disabled = true;
            this.dir = floor(this.currTuile.numero/7)%2 == 0?-1: 1;
            this.currTuile = Tuiles[this.currTuile.idx + 1];
            if(this.currTuile.numero == Tuiles.length){
                this.coups = 0;
            }
            else{
                this.nextPos = this.currTuile.center;
                this.isMoving = true;
                this.coups --;
            }
  
            this.snd.play();

            if (this.coups == 0){
                if(this.currTuile.numero == Tuiles.length || this.currTuile.videoRef >= 0 || this.currTuile.next > 0){
                    this.hasPendingAction = true;
                }                
                if (!this.hasPendingAction){
                    document.getElementById('btnRoll').disabled = false;
                    nextPlayerImg();
                }
            }

            document.getElementById('remain').innerHTML = lastNumber - this.coups;

        } else {



            if (this.hasPendingAction){this.lastAction();}          
        }


    }

    lastAction(){
        
        if(this.currTuile.numero == Tuiles.length){
            gameOver(this);
        }

        if (this.currTuile.videoRef >= 0){  
            sndQuiz.play();
            videoPlayNext(quizPlayer);
        }

        if (this.currTuile.next > 0){ 
            
            if (this.currTuile.next < this.currTuile.idx) {sndDescend.play();}
            else {sndAscend.play();}

            this.currTuile = Tuiles[this.currTuile.next];
            this.nextPos = Tuiles[this.currTuile.idx].center;
            this.dir = floor(this.currTuile.numero/7)%2 == 0?-1: 1;
            videoPlayNext(positionPlayer);
        }

        this.hasPendingAction = false; 
        document.getElementById('btnRoll').disabled = false;
        nextPlayerImg();        
    }

    draw(){
        push();
        var y = 0;
        var x = 0;
        var h = tuileHeight * .75;

        this.pos.x = lerp(floor(this.pos.x), this.nextPos.x, 0.4);
        this.pos.y  =lerp(floor(this.pos.y), this.nextPos.y, 0.6);
        stroke(0);
        strokeWeight(3);
        fill(255);
        translate(this.pos.x, this.pos.y);

        x = this.nextPos.x - this.pos.x;
        y = -0.007 * x * x;
        h = h + (y * 4);

        scale(this.dir, 1);
        imageMode(CENTER, CENTER);
        image(this.img, 0, y, tuileHeight*.85, h);
        pop();

        if (this.shareTuile() > 1){
            this.nextPos = this.offset == 0?this.currTuile.q1: this.offset == 1? this.currTuile.q2: this.offset == 2? this.currTuile.q3: this.currTuile.q4;
        }else{this.nextPos = this.currTuile.center;}
    }
    
 

}
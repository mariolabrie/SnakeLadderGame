class message{
    constructor(){
        this.msg = 'DEFAULT';
        this.duree = 1000;
        this.h = 100;
        this.h2 = 100;
        this.endtime = 0;
    }

    print(msg, duree, h, h2){
        this.msg = msg;
        this.duree = duree;
        this.h = h;
        this.h2 = h2;
        this.endtime = millis() + duree - 500;
    }

    show(){
        if (millis() < this.endtime){
            push();
            textFont(font);
            textAlign(CENTER);
            strokeWeight(12);
            stroke('white');
            fill('red');
            
            textSize(this.h2);
            
            translate(boardWidth/2, boardHeight/2);
            text(this.msg, 0, 0);

            if (this.h2 > this.h){ this.h2 = this.h2 - 10;}

            pop();
        } 
    }
}
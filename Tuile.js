class Tuile {
    
    constructor(idx, position, couleur) {
        this.idx = idx;
        this.numero = idx + 1;
        this.next = 0;
        this.pos = position;
        this.center = createVector();
        this.q1 = createVector();
        this.q2 = createVector();
        this.q3 = createVector();
        this.q4 = createVector();
        this.couleur = couleur;
        this.videoRef = -1;
        this.center.set(floor(this.pos.x + tuileWidth/2), floor(this.pos.y + tuileHeight/2));
        this.q1.set(floor(this.pos.x + tuileWidth/3), floor(this.pos.y + tuileHeight/3));
        this.q2.set(floor(this.pos.x + 2*(tuileWidth/3)), floor(this.pos.y + tuileHeight/3));
        this.q3.set(floor(this.pos.x + 2*(tuileWidth/3)), floor(this.pos.y + 2*(tuileHeight/3)));
        this.q4.set(floor(this.pos.x + tuileWidth/3), floor(this.pos.y + 2*(tuileHeight/3)));
    }

    draw(sw = this.couleur){
        push();
        let tColor = color('white');    
        let nbSize = tuileHeight * .35;

        if (this.idx == 0 || this.idx == Tuiles.length - 1){
            sw = color('#ff99c2');
        }
        translate(this.pos.x, this.pos.y);
        fill(sw);
        stroke(0);
        strokeWeight(1);
        rect(0, 0, tuileWidth, tuileHeight, 5);

        if (this.videoRef >= 0){
            image(imgQuiz[0], 0, 0, tuileWidth, tuileHeight);
        }
        if (this.numero == nbCol * nbRow){
            image(imgLastCell, 0, 0, tuileWidth, tuileHeight);
        }
        else{
            textAlign(LEFT, BOTTOM);
            textStyle(BOLD);
            textFont('myFont');
            fill(tColor);   
            textSize(nbSize);
            text(this.numero, 10, tuileHeight);
        }
        pop();
    }      
       
}

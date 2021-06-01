class videoplayer extends Vimeo.Player{
    constructor(refid){
        super(refid);
        this.refid = refid;
        this.currChapter = 2;
        this.chapters;
        this.chapterStart = 0;
        this.chapterEnd = 0;
        
        var x = document.getElementById(this.refid);
        x.setAttribute('data-vimeo-width', boardWidth * 0.75);
        x.style.display ='none';
    }  
}

function drawEchelle(){
    let e = Tuiles.filter(t => t.next > 0);
    let t2, angle, img, v, w;
    for (tuile of e){       
        t2 = Tuiles[tuile.next];
        push();
        strokeWeight(5);
        imageMode(CORNER, CORNER);
        angleMode(DEGREES);
        if (t2.idx > tuile.idx){
            v = p5.Vector.sub(t2.center, tuile.center);
            angle = 90;
            img = imgEchelle;
            w = 40;
        } else{
            v = p5.Vector.sub(tuile.center, t2.center);
            angle = -90;
            img = imgSerpent;
            w = 40;
        }
        translate(t2.center.x, t2.center.y);
        rotate(v.heading() + angle);
        image(img, 0, 0, w, dist(tuile.center.x, tuile.center.y, t2.center.x, t2.center.y));
        pop();
    }
}
function drawBoard(){
        for (tuile of Tuiles){ 
        tuile.draw();
    } 
    drawEchelle(); 

}
function initBoard(){
    var idx = 0;
    var cnt = 1;
    var dir = -1;
    var xx;
    var yy;
    var coulidx;

    Tuiles = [];
    for(var row = nbRow; row > 0; row--){
        dir = dir * -1;
        for (var col=1; col <= nbCol; col++){
            if (dir === -1){ xx = boardWidth - (col * (tuileWidth));} 
            else{ xx = col * (tuileWidth) - (tuileWidth);}            
            yy = row * (tuileHeight) - (tuileHeight);
            cnt = (nbCol * nbRow) - (row * nbCol) + col;
            if (idx == 0 || idx == nbCol * nbRow - 1){coulidx = 0;}
            //else{coulidx = floor(random(1, 5));}
            else{coulidx = (coulidx==1)?2:1;}
            Tuiles.push(new Tuile(idx, createVector(xx, yy), boardColors[coulidx]));
            idx ++;
        }
    }

    Tuiles[12].next = 25;
    Tuiles[4].next = 18;
    Tuiles[22].next = 33;
    Tuiles[32].next = 17;
    Tuiles[40].next = 30;
    Tuiles[35].next = 20;   
    Tuiles[26].next = 13;  
    Tuiles[37].next = 31;  
    Tuiles[19].next = 5; 
    Tuiles[29].next = 39;   

    Tuiles[2].videoRef = 0;
    Tuiles[9].videoRef = 1;
    Tuiles[36].videoRef = 1;
    Tuiles[15].videoRef = 1;
    Tuiles[28].videoRef = 1;
    Tuiles[7].videoRef = 2;
    Tuiles[38].videoRef = 3;
    Tuiles[23].videoRef = 1;
}


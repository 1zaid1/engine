function Piston(x, y, r, l, w=150, h=150) {
    this.r = r;
    this.l = l;
    this.y0 = y;

    this.pos = createVector(x, y);

    this.H = function(ang) {return this.l+this.r*(1-cos(ang)) - sqrt(this.l**2 - (this.r*sin(ang))**2);}
    this.update = function(ang) {
        this.pos.y = this.y0 + this.H(ang);
    }

    this.draw = function(shaft) {
        push();

        beginShape();
        vertex(this.pos.x-w/2, this.y0-h/2);
        vertex(this.pos.x+w/2, this.y0-h/2);

        vertex(this.pos.x+w/2, this.y0 + this.r*2+w/2);
        vertex(shaft.center.x+shaft.r+35, shaft.center.y);
        vertex(shaft.center.x-shaft.r-35, shaft.center.y);
        vertex(this.pos.x-w/2, this.y0 + this.r*2+w/2);
        endShape(CLOSE);

        beginShape();
        vertex(shaft.pos.x-25, shaft.pos.y);
        vertex(this.pos.x-25, this.pos.y);

        vertex(this.pos.x+25, this.pos.y);
        vertex(shaft.pos.x+25, shaft.pos.y);
        endShape(CLOSE);

        rectMode(CENTER);
        rect(this.pos.x, this.pos.y, w, h);
        circle(this.pos.x, this.pos.y, 30);

        fill(0);
        rectMode(CORNER);
        rect(this.pos.x-w/2, this.pos.y-h/2, w, 3);
        rect(this.pos.x-w/2, this.pos.y-h/2.4, w, 3);

        pop();
    }
}

function Shaft(x, y, r, speed=0.1) {
    this.center = createVector(x, y);
    this.r = r;
    this.speed = speed;
    this.angle = 0;

    this.pos = createVector(this.center.x, this.center.y - this.r);

    this.force = function(f) {this.a.add(f);}
    this.update = function(dt) {
        this.angle += this.speed;
        this.pos = p5.Vector.add(this.center, createVector(-this.r*sin(this.angle), -this.r*cos(this.angle)));
    }

    this.draw = function() {
        circle(this.center.x, this.center.y, 2*(this.r+35));
        circle(this.center.x, this.center.y, 2*(this.r+30));
        circle(this.pos.x, this.pos.y, 50);
        circle(this.center.x, this.center. y, 40);
        line(this.center.x-20, this.center.y, this.center.x+20, this.center.y);
        line(this.center.x, this.center.y-20, this.center.x, this.center.y+20);
    }
}

function Engine(R, l, cx, cy) {
    this.shaft = new Shaft(cx, cy+(l+2*R)/2, R);
    this.piston = new Piston(cx, cy-(l+2*R)/2, R, l);

    this.update = function(dt) {
        this.shaft.update(dt);
        this.piston.update(this.shaft.angle);
    }

    this.draw = function() {
        this.piston.draw(this.shaft);
        this.shaft.draw();
    }
}

let engine, cnv;
function setup() {
    cnv = createCanvas(700, 700);
    let canv = document.getElementById(cnv.id());
    canv.style.left = window.innerWidth/2 - width/2 + "px";
    dx = window.innerWidth/2 - width/2;
    canv.style.top = window.innerHeight/2 - height/2 + "px";
    dx = window.innerHeight/2 - height/2;
    // canv.style.position = "absolute";

    document.getElementById("dv").style.width = window.innerHeight-100+"px";
    document.getElementById("dv").style.height = window.innerWidth+"px";
    engine = new Engine(70, 200, width/2, height/2);
}

function draw() {
    background(300);
    engine.update(1);
    engine.draw();
}

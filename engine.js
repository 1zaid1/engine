// let v = p5.Vector;

function deez(a, b) {
  return a.x*b.x + a.y*b.y;
}

function times(a, b) {
  return deez(a[0], b[0]) + deez(a[1], b[1]);
}

function rotCon(L, a, p, beta, dt) {
  let d = p5.Vector.sub(a.pos, p);
  let C = deez(d, d)-L*L;
  let Vi = a.vel;
  let J = d;
  let B = beta/dt * C;
  let M_ef = deez(d, d)/a.m;
  let lambda = -(deez(J, Vi)+B)/M_ef;
  let F = p5.Vector.mult(J, lambda);
  let Vf = p5.Vector.mult(F, 1/a.m);
  return Vf;
}
function distCon(L, a, b, beta, dt) {
  let d = v.sub(a.pos, b.pos);
  let C = deez(d, d)-L*L;
  let Vi = [a.vel, b.vel];
  let J = [d, v.sub(createVector(0,0), d)];
  let B = beta/dt * C;
  let M_ef = deez(d, d)/a.m + deez(d, d)/b.m;
  let lambda = -(times(J, Vi)+B)/M_ef;
  let F = [v.mult(J[0], lambda), v.mult(J[1], lambda)];
  let Vf = [v.mult(F[0], 1/a.m),
            v.mult(F[1], 1/b.m)];
  return Vf;
}

function distCon2(L, a, b, beta, dt) {
  let d = p5.Vector.sub(a.pos, b.pos);
  let C = deez(d, d)-L*L;
  let Vi = [a.vel, b.vel];
  let J = [createVector(0, d.y), p5.Vector.sub(createVector(0,0), d)];
  let B = beta/dt * C;
  let M_ef = deez(d, d)/a.m + deez(d, d)/b.m;
  let lambda = -(times(J, Vi)+B)/M_ef;
  let F = [p5.Vector.mult(J[0], lambda), p5.Vector.mult(J[1], lambda)];
  let Vf = [p5.Vector.mult(F[0], 1/a.m),
            p5.Vector.mult(F[1], 1/b.m)];
  return Vf;
}

function Piston(x, y, r, l, w=150, h=150) {
    this.r = r;
    this.l = l;
    this.y0 = y;

    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.a = createVector(0, 0);
    this.m = 1;

    this.force = function(f) {this.a.add(f);}
    this.update = function(dt) {
        this.pos.add(p5.Vector.mult(this.vel, dt));
        this.vel.add(p5.Vector.mult(this.a, dt));

        this.a = createVector(0, 0);
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
    this.vel = createVector(5, 0);
    this.a = createVector(0, 0);
    this.m = 1;

    this.force = function(f) {this.a.add(f);}
    this.update = function(dt) {
        this.pos.add(p5.Vector.mult(this.vel, dt));
        this.vel.add(p5.Vector.mult(this.a, dt));

        this.a = createVector(0, 0);
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
        let n = 100;
        dt /= n;
        this.shaft.a.mult(n);
        this.piston.a.mult(n);
        for (let i = 0; i < n; i++) {
            // rotation constraints
            let dV = rotCon(this.shaft.r, this.shaft, this.shaft.center, 1, dt);
            this.shaft.vel.add(dV);

            // distance constaints
            dV = distCon2(this.piston.l+this.piston.r, this.piston, this.shaft, 1, dt);
            this.piston.vel.add(dV[0]);
            this.shaft.vel.add(dV[1]);

            this.piston.update(dt);
            this.shaft.update(dt);
        }
    }

    this.draw = function() {
        this.piston.draw(this.shaft);
        this.shaft.draw();
    }
}

let engine, cnv;
function setup() {
    cnv = createCanvas(700, 700);
    engine = new Engine(70, 200, width/2, height/2);
}

let count
function draw() {
    background(300);
    engine.update(1);
    engine.draw();
}

var flock;
let velocity;
let fish1;
let fish2;
let foam;
let foamX;
let interv;
let boat;

let numFish = 40;

function drawFishy(){
    var fishy;
    var randomBool = random()
    if (randomBool > .5){
        return fish1
    } else {
        return fish2
    }
}


function setup() {
  createCanvas(1000,1000);

  fish1 = loadImage('public/fish1Resized.png');
  fish2 = loadImage('public/fish2Resized.png');
  foam = loadImage('public/rapids_foam.png');
  boat = loadImage('public/skiff.png');

  // createP("Drag the mouse to generate new boids.");

  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < numFish; i++) {
    var b = new Boid(width/2,height/2);
    flock.addBoid(b);
  }
  velocity = createVector(random(-1,1),random(-1,1))
  console.log(velocity - flock.boids[0].velocity)
}


function draw() {
  // background(51);
  background("#003366")
  flock.run();
  if(Math.abs(p5.Vector.sub(velocity, flock.boids[0]).y) > .65){
      velocity = flock.boids[0].velocity
      console.log(velocity)
  }
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX,mouseY));
}


class Flock{
    constructor(){
        this.boids = [];
    }

    run(){
        for (var i = 0; i < this.boids.length; i++) {
          this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
        }
    }

    addBoid(boid){
        this.boids.push(boid);
    }
}

function drawFoam(foam){
    let speed = .1;
    if (foamX < width){
        foamX += speed;
    } else {
        foamX = 0
    }
} //doesn't really work. it speeds up when you click the canvas. i have no idea why.


class Boid {
    constructor(x, y){
        this.acceleration = createVector(0,0);
        this.velocity = createVector(random(-1,1),random(-1,1));
        this.position = createVector(x,y);
        // this.acceleration = [0,0];
        // this.velocity = [random(-1,1),random(-1,1)];
        // this.position = [x,y];
        this.r = 10.0; //3.0
        this.maxspeed = 5;    // Maximum speed
        this.maxforce = 0.05; // Maximum steering force
    }

    run(){
        this.flock(flock.boids);
        this.update();
        this.borders();
        this.render();
    }

    applyForce(force){
         this.acceleration.add(force);
        // this.acceleration[0]+= force[0];
        // this.acceleration[1]+= force[1];
    }

    flock(boids){
        var sep = this.separate(boids);   // Separation
        var ali = this.align(boids);      // Alignment
        var coh = this.cohesion(boids);   // Cohesion
        // Arbitrarily weight these forces
        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);
        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    update(){
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
    }


//##############
    seek(target){
        var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        var steer = p5.Vector.sub(desired,this.velocity);
        steer.limit(this.maxforce);  // Limit to maximum steering force
        return steer;
    }

//##############
    render(){
        interv = setInterval(drawFishy, 1000);
        // Draw a triangle rotated in the direction of velocity
        var theta = this.velocity.heading() + radians(90);
        fill(127);
        fill("#003366")
        stroke('#0052A2');
        // drawFoam();
        // image(foam, foamX, 0); //cool idea, bro.
        push();
        translate(this.position.x,this.position.y);
        // rotate(theta);
        image(drawFishy(), this.position.x, this.position.y);
        // image(boat, 100, 100);
        // beginShape();
        // vertex(0, -this.r*2);
        // vertex(-this.r, this.r*2);
        // vertex(this.r, this.r*2);
        // endShape(CLOSE);
        pop();

    }

//##############
    borders(){
        if (this.position.x < -this.r) this.position.x = width +this.r;
        if (this.position.y < -this.r) this.position.y = height+this.r;
        if (this.position.x > width +this.r) this.position.x = -this.r;
        if (this.position.y > height+this.r) this.position.y = -this.r;
    }

    separate(boids){
        var desiredseparation = 25.0;
        var steer = createVector(0,0);
        var count = 0;
        // For every boid in the system, check if it's too close
        for (var i = 0; i < boids.length; i++) {
          var d = p5.Vector.dist(this.position,boids[i].position);
          // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
          if ((d > 0) && (d < desiredseparation)) {
            // Calculate vector pointing away from neighbor
            var diff = p5.Vector.sub(this.position,boids[i].position);
            diff.normalize();
            diff.div(d);        // Weight by distance
            steer.add(diff);
            count++;            // Keep track of how many
          }
        }
        // Average -- divide by how many
        if (count > 0) {
          steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
          // Implement Reynolds: Steering = Desired - Velocity
          steer.normalize();
          steer.mult(this.maxspeed);
          steer.sub(this.velocity);
          steer.limit(this.maxforce);
        }
        return steer;
    }

    align(boids){
        var neighbordist = 50;
        var sum = createVector(0,0);
        var count = 0;
        for (var i = 0; i < boids.length; i++) {
          var d = p5.Vector.dist(this.position,boids[i].position);
          if ((d > 0) && (d < neighbordist)) {
            sum.add(boids[i].velocity);
            count++;
          }
        }
        if (count > 0) {
          sum.div(count);
          sum.normalize();
          sum.mult(this.maxspeed);
          var steer = p5.Vector.sub(sum,this.velocity);
          steer.limit(this.maxforce);
          return steer;
        } else {
          return createVector(0,0);
        }
    }

    cohesion(boids){
        var neighbordist = 50;
        var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
        var count = 0;
        for (var i = 0; i < boids.length; i++) {
          var d = p5.Vector.dist(this.position,boids[i].position);
          if ((d > 0) && (d < neighbordist)) {
            sum.add(boids[i].position); // Add location
            count++;
          }
        }
        if (count > 0) {
          sum.div(count);
          return this.seek(sum);  // Steer towards the location
        } else {
          return createVector(0,0);
        }
    }

}

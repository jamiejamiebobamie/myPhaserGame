var flock;
let velocity;
let fish1;
let fish2;
let foam;
let foamX;
let interv;
let boat;
let squid1;
let squid2;
let shark1;
let shark2;
let shake;





let numFish = 50;

let sharks = Math.floor(numFish * .1)

function deviceShaken(){
    // let shake = true;
}

function setup() {
  var canvas = createCanvas(900,1500);
  canvas.parent('sketch-holder');
  imageMode(CENTER);
  shake = false;
  fish1 = loadImage('../images/fish1Resized.png');
  fish2 = loadImage('../images/fish2Resized.png');
  // foam = loadImage('public/rapids_foam.png');
  // boat = loadImage('public/skiff.png');
  // squid1 = loadImage('public/squid1ResizedDesat.png');
  // squid2 = loadImage('public/squid2ResizedDesat.png');
  shark1 = loadImage('../images/shark1Resized.png');
  shark2 = loadImage('../images/shark2Resized.png');

  // createP("Drag the mouse to generate new boids.");

  flock = new Flock();
  flockShark = new FlockShark();
  // Add an initial set of boids into the system
  for (var i = 0; i < numFish; i++) {
    var b = new Boid(width/2,height/2, "fish");
    flock.addBoid(b);
}

for (var i = 0; i < sharks; i++) {
  var b = new Boid(width/2,height/2, "shark", flock);
  flockShark.addBoid(b);
}

for (var i = 0; i < numFish; i++) {
    flock.boids[i].predator = flockShark
}
  velocity = createVector(random(-1,1),random(-1,1))
}



function draw() {
  // background(51);
  if (shake == true){
       background("red")
  } else {
      background("#003366")
  }
  // shake = false;
  flock.run();
  flockShark.run();
  if(Math.abs(p5.Vector.sub(velocity, flock.boids[0]).y) > .65){
      velocity = flock.boids[0].velocity
      // console.log(flock.len)
  }
  if(Math.abs(p5.Vector.sub(velocity, flock.boids[0]).y) > .65){
      velocity = flockShark.boids[0].velocity
      // console.log(flock.len)
  }
}

// Add a new boid into the System
function mouseDragged() {
    // if (flock.lenShark > sharks){
        // flock.addBoid(new Boid(mouseX,mouseY, "fish"));
    // } else if (flock.lenFish < (numFish*3)) {
  // flock.addBoid(new Boid(mouseX,mouseY, "shark"));
  // shake = true;
}

function mousePressed() {
    // if (flock.lenShark > sharks){
        // flock.addBoid(new Boid(mouseX,mouseY, "fish"));
    // } else if (flock.lenFish < (numFish*3)) {
  // flock.addBoid(new Boid(mouseX,mouseY, "shark"));
  shake = true;
}

function mouseReleased(){
       shake = false;
}


class Flock{
    constructor(){
        this.boids = [];
        this.lenShark = 0;
        this.lenFish = 0;
    }

    run(){
        for (var i = 0; i < this.boids.length; i++) {
          this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
        }
        // console.log([this.lenFish, this.lenShark])
    }

    addBoid(boid){
        this.boids.push(boid);
        // if (boid.fish == "fish"){
        //     this.lenFish += 1;
        // } else if (boid.fish == "shark"){
        //     this.lenShark += 1;
        // }
    }
}

class FlockShark{
    constructor(){
        this.boids = [];
        this.lenShark = 0;
        this.lenFish = 0;
    }

    run(){
        for (var i = 0; i < this.boids.length; i++) {
          this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
        }
        // console.log([this.lenFish, this.lenShark])
    }

    addBoid(boid){
        this.boids.push(boid);
        if (boid.fish == "fish"){
            this.lenFish += 1;
        } else if (boid.fish == "shark"){
            this.lenShark += 1;
        }
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


// class Predator extends Boid {
//     constructor(dateStr) {
//   super(dateStr);
// }
// }


class Boid {
    constructor(x, y, fish="fish", prey=undefined, predator=undefined){
        this.acceleration = createVector(0,0);
        this.velocity = createVector(random(-1,1),random(-1,1));
        this.position = createVector(x,y);
        // this.acceleration = [0,0];
        // this.velocity = [random(-1,1),random(-1,1)];
        // this.position = [x,y];
        this.r = 20.0; //3.0
        this.maxforce = 0.05; // Maximum steering force
        this.t = [150, 150, 150, random(100,255)];
        this.fish = fish;
        this.prey = prey;
        this.predator = predator;
        if (this.fish == "shark"){
            this.maxspeed = 9//random(8,9);
        } else if (this.fish == "fish"){
            this.maxspeed = random(33,34);    // Maximum speed
        }
        this.attackBool = false;
        this.dead = false;
        this.victim = undefined;
        this.victimDIST = 1000;
    }

    eaten(boids){
        if (this.fish == "fish" && this.predator != undefined){
            for (var i = 0; i < this.predator.length; i++) {
                var d = p5.Vector.dist(this.position,this.predator.boids[i].position);
                if (d < 100){
                    this.dead = true;
                }
              }
            }

        }


    attack(boids){
        // console.log(this.attackBool == false && this.fish == "shark" && this.prey != undefined)
        if (this.attackBool == false && this.fish == "shark" && this.prey != undefined){
            for (var i = 0; i < this.prey.boids.length; i++) {
                this.victimDIST = p5.Vector.dist(this.position,this.prey.boids[i].position);
                // let d = p5.Vector.dist(this.position,this.prey.boids[i].position);
                // console.log(p5.Vector.dist(this.position,this.prey.boids[i].position))
                 if (this.victimDIST < 1){
                     this.victim = this.prey.boids[i]
                     console.log(i)
                     this.attackBool = true
                 }
             }
         }
     }

     attacking(){
         // console.log(this.victim)
         if (this.victim != undefined && this.attack == true && this.victimDIST > 50){
             var d = p5.Vector.dist(this.position,this.victim.position);
             this.postion = lerp(this.postion, this.victim.position)
         }
         if (d < 50){
             this.victim.dead == true;
             this.victim = undefined;
             this.attackBool = false;
         }
     }


    //
    //         this.position = lerp()
    //       var diff = p5.Vector.sub(this.prey.boids[i].position, this.position);
    //     var steer = createVector(0,0);
    //     var count = 0;
    //     // console.log(this.fish == "shark" && this.prey != undefined)
    //     if (){
    //
    //
    //
    //               diff.normalize();
    //               diff.div(d);        // Weight by distance
    //               steer.add(diff);
    //               count++;            // Keep track of how many
    //             }
    //           }
    //         // Average -- divide by how many
    //         if (count > 0) {
    //           steer.div(count);
    //         }
    //
    //         // As long as the vector is greater than 0
    //         if (steer.mag() > 0) {
    //           // Implement Reynolds: Steering = Desired - Velocity
    //           steer.normalize();
    //           steer.mult(this.maxspeed);
    //           steer.sub(this.velocity);
    //           steer.limit(this.maxforce);
    //         }
    //
    //     }
    //     console.log(diff)
    //     return steer;
    // }

    drawFishy(){
        // var fishy;
        let randomBool = random()
        if (this.fish == "fish"){
        if (randomBool > .5){
        //     if (randomBool > .5){
        //         // return squid1
                return fish1
                // return shark1
        } else {
        //     // return squid2
            return fish2
            // return shark2
        //     }
    }} else if (this.fish == "shark") {
            if (randomBool > .5){ //need to fix shark swim anim
        //     // return squid1
        //     // return fish1
            return shark1
        } else {
        // // return squid2
        //     // return fish2
            return shark2
        }
    }
    } //size comparison

    run(){
        if (this.fish == "fish") {
            this.flock(flock.boids);
        } else if (this.fish == "shark"){
            this.flock(flockShark.boids);
        }
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
        if (this.fish == "fish"){
            this.eaten(this.predator)
        }
        if (this.fish == "shark"){
            this.attack(boids);
            this.attacking()
            // console.log(this.attackBool)
            // var atk = this.attack(boids); //doesn't work
            // atk.mult(3.0);
            // this.applyForce(atk);
        }
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
        // Draw a triangle rotated in the direction of velocity
        if (this.fish == "fish"){
        var theta = this.velocity.heading() +radians(180)//+ radians(90);
    } else if (this.fish == "shark"){
        var theta = this.velocity.heading()// - radians(180)//
    }
        fill(127);
        fill("#003366")
        stroke('#0052A2');
        // drawFoam();
        // image(foam, foamX, 0); //cool idea, bro.
        push();
        translate(this.position.x,this.position.y);
        //
        //
        rotate(theta);
        // image(boat, 100, 100);
        // fill("black")
        // stroke("white");
        // beginShape();
        // vertex(0, -this.r*2);
        // vertex(-this.r, this.r*2);
        // vertex(this.r, this.r*2);
        // endShape(CLOSE);
        // pop();
        // push();
        // rotate(theta);
        if (this.dead == false){
        tint(this.t[0],this.t[1],this.t[2],this.t[3])
    } else {
        tint(255, 0, 0)
    }
        if (this.fish == "shark"){
            // console.log(this.prey)
            // image(this.drawFishy(), this.position.x-500, this.position.y+100);
            image(this.drawFishy(), 0,0)//this.position.x-200, this.position.y-25);
        } else if (this.fish == "fish"){
            // console.log(this.predator)
            image(this.drawFishy(), 0, 0)//this.position.x, this.position.y);
        }
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
        if (this.fish == "fish"){
            var desiredseparation = 25.0; //25.0
        } else if (this.fish == "shark"){
            var desiredseparation = 50.0; //25.0
        }
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
        var neighbordist = 70;
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
        var neighbordist = 70;
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

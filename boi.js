let flock;
let velocity;

function setup() {
  createCanvas(700,700);
  // createP("Drag the mouse to generate new boids.");

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 10; i++) {
      let x = width/2;
      let y = height/2;
    let b = new Boid(x,y);
    flock.addBoid(b);
  }
}


function draw() {
  background(51);
  flock.run();
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
        for (let i = 0; i < this.boids.length; i++) {
          this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
        }
    }

    addBoid(boid){
        this.boids.push(boid);
    }
}

class Boid {
    constructor(x, y){
        this.acceleration = [0,0];
        this.velocity = [random(-1,1),random(-1,1)];
        this.position = [x,y];
        // this.acceleration = [0,0];
        // this.velocity = [random(-1,1),random(-1,1)];
        // this.position = [x,y];
        this.r = random(3,5); //3.0
        this.maxspeed = random(2.5,3);    // Maximum speed
        this.maxforce = 0.05; // Maximum steering force
        // this.desired = [0,0];
        // this.steer = [0,0];
    }

    run(){
        this.flock(flock.boids);
        this.update();
        this.borders();
        this.render();
    }

    applyForce(force){
         // this.acceleration.add(force);
        this.acceleration[0]+= force[0];
        this.acceleration[1]+= force[1];
    }

    flock(boids){
        // let sep = this.separate(boids);   // Separation
        // let ali = this.align(boids);      // Alignment
        let coh = this.cohesion(boids);   // Cohesion

        // Arbitrarily weight these forces
        // sep[0] *= 1.5
        // sep[1] *= 1.5

        // sep.mult(1.5);
        // ali.mult(1.0);
        // coh.mult(1.0);

        // Add the force vectors to acceleration
        // this.applyForce(sep);
        // this.applyForce(ali);
        this.applyForce(coh);
    }

    update(){
        // Update velocity
        if (this.velocity[0] < this.maxspeed || this.velocity[1] < this.maxspeed){
            this.velocity[0] += this.acceleration;
            this.velocity[1] += this.acceleration;
        } else if (this.velocity[0] > this.maxspeed || this.velocity[1] > this.maxspeed){
            this.velocity[0] -= this.acceleration;
            this.velocity[1] -= this.acceleration;
        }
        // this.velocity.add(this.acceleration);
        // Limit speed
        this.position[0] += this.velocity[0]
        this.position[1] += this.velocity[1]

        // this.velocity.limit(this.maxspeed);
        // this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        // this.acceleration.mult(0);

        this.acceleration[0] = 0;
        this.acceleration[1] = 0;
    }


//##############
    seek(target){
        let normalizedDesired;

        desired[0] = this.position[0] - target[0]
        desired[1] = this.position[1] - target[1]

        if (desired[0]>desired[1]) {
            normalizedDesired = [1, (desired[0] / desired[1])]
        } else if (desired[1]>desired[0]) {
            normalizedDesired = [(desired[1] / desired[0]), 1]
        } else {
            normalizedDesired = [1,1]
        }
        // p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        // desired.normalize();
        normalizedDesired[0] *= this.maxspeed
        normalizedDesired[1] *= this.maxspeed

        // desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        let steer = [0,0]
        steer[0] = normalizedDesired[0] -= this.velocity[0];
        steer[1] = normalizedDesired[1] -= this.velocity[1];

        if (steer[0] < this.maxforce || steer[1] < this.maxforce){
        steer[0] = normalizedDesired[0] -= this.velocity[0];
        steer[1] = normalizedDesired[1] -= this.velocity[1];
    } else {
        steer[0] = normalizedDesired[0] += this.velocity[0];
        steer[1] = normalizedDesired[1] += this.velocity[1];
    }


        // let steer = p5.Vector.sub(desired,this.velocity);
        // steer.limit(this.maxforce);  // Limit to maximum steering force
                // console.log(typeof steer)
        return steer;
    }

//##############
    render(){
        // Draw a triangle rotated in the direction of velocity
        let theta = Math.acos(this.velocity[0]/(Math.sqrt(Math.pow(this.velocity[0])+Math.pow(this.velocity[0])))) + radians(90);
        // let theta = this.velocity.heading() + radians(90);
        fill(127);
        stroke(200);
        push();
        // console.log(typeof this.position[0])
        // console.log(parseFloat(this.position[0]),parseFloat(this.position[1]))
        translate(parseFloat(this.position[0]),parseFloat(this.position[1]));
        rotate(theta);
        beginShape();
        vertex(0, -this.r*2);
        vertex(-this.r, this.r*2);
        vertex(this.r, this.r*2);
        endShape(CLOSE);
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
        let desiredseparation = 25.0;
        let steer = [0,0];
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < boids.length; i++) {
             let d = [Math.pow((boids[i].position[0] - this.position[0]),2) + Math.pow((boids[i].position[1] - this.position[1]),2)]
             d = Math.sqrt(d)
          // let d = p5.Vector.dist(this.position,boids[i].position);
          // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
          if ((d > 0) && (d < desiredseparation)) {
            // Calculate vector pointing away from neighbor
            let diff = [0,0];
            diff[0] = boids[i].position[0] - this.position[0];
            diff[1] = boids[i].position[1] - this.position[1];

            if (diff[0]>diff[1]) {
                diff = [1, (diff[0] / diff[1])];
            } else if (diff[1]>diff[0]) {
                diff = [(diff[1] / diff[0]), 1];
            } else {
                diff = [1,1];
            }

            // let diff = p5.Vector.sub(this.position,boids[i].position);
            // diff.normalize();

            diff[0] /= d;
            diff[1] /= d;

            steer[0] = diff[0] + steer[0];
            steer[1] = diff[1] + steer[1];
            // diff.div(d);        // Weight by distance
            // steer.add(diff);
            count++;            // Keep track of how many
          }
        }
        // Average -- divide by how many
        if (count > 0) {
            steer[0] /= count;
            steer[1] /= count;

          // `steer.div(count);
        }

         // magnitude of a vector: sqrt(x*x + y*y + z*z).)
         let mag = Math.sqrt(Math.pow(steer[0],2) + Math.pow(steer[1],2))
        // As long as the vector is greater than 0
        if (mag > 0) {
          // Implement Reynolds: Steering = Desired - Velocity
          steer.normalize();
          if (steer[0]>steer[1]) {
              steer = [1, (steer[0] / steer[1])];
          } else if (steer[1]>steer[0]) {
              steer = [(steer[1] / steer[0]), 1];
          } else {
              steer = [1,1];
          }

          steer[0] *= this.maxspeed;
          steer[1] *= this.maxspeed;

          // steer.mult(this.maxspeed);

          if (steer[0] < this.maxforce || steer[1] < this.maxforce){
          steer[0] -= this.velocity[0];
          steer[1] -= this.velocity[1];
      } else {
          steer[0] += this.velocity[0];
          steer[1] += this.velocity[1];

      }

          // steer.sub(this.velocity);
          // steer.limit(this.maxforce);
        }
        return steer;
        // console.log(steer)
    }

    align(boids){
        let neighbordist = 50;
        let sum = [0,0];
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
         let d = [Math.pow((boids[i].position[0] - this.position[0]),2) + Math.pow((boids[i].position[1] - this.position[1]),2)]
         d = Math.sqrt(d)
          if ((d > 0) && (d < neighbordist)) {
              sum[0] += boids[i].velocity[0]
              sum[1] += boids[i].velocity[1]
            // sum.add(boids[i].velocity);
            count++;
          }
        }
        if (count > 0) {
            sum[0] /= count;
            sum[1] /= count;
          // sum.div(count);

          if (sum[0]>sum[1]) {
              sum = [1, (sum[0] / sum[1])]
          } else if (sum[1]>sum[0]) {
              sum = [(sum[1] / sum[0]), 1]
          } else {
              sum = [1,1]
          }

          // sum.normalize();
          sum[0] *= this.maxspeed;
          sum[1] *= this.maxspeed;

          // sum.mult(this.maxspeed);
          let steer = [0,0];

          steer[0] = sum -= this.velocity[0];
          steer[1] = sum -= this.velocity[1];

          if (steer[0] < this.maxforce || steer[1] < this.maxforce){
          steer[0] -= this.velocity[0];
          steer[1] -= this.velocity[1];
      } else {
          steer[0] += this.velocity[0];
          steer[1] += this.velocity[1];

      }

          // let steer = p5.Vector.sub(sum,this.velocity);
          // steer.limit(this.maxforce);
          return steer;
        } else {
          return [0,0];
        }
    }

    cohesion(boids){
        let neighbordist = 50;
        let sum = [0,0];   // Start with empty vector to accumulate all locations
        let count = 0;
        let otherBoidPos = [0,0];
        let pos;
        for (let i = 0; i < boids.length; i++) {
            otherBoidPos = boids[i].position;
            pos = otherBoidPos[0] //- this.position[0]
            console.log(pos)
            let d = [Math.pow(otherBoidPos[0] - this.position[0],2) + Math.pow((boids[i].position[1] - this.position[1]),2)]
            d = Math.sqrt(d)
            // console.log(d)
          // let d = p5.Vector.dist(this.position,boids[i].position);
          if ((d > 0) && (d < neighbordist)) {
              sum[0] += boids[i].position[0]
              sum[1] += boids[i].position[1]
            // sum.add(boids[i].position); // Add location
            count++;
          }
        }
        // console.log(count)
        if (count > 0) {
            sum[0] /= count;
            sum[1] /= count;
          // sum.div(count);
          return this.seek(sum);  // Steer towards the location
        } else {
          return [0,0];
        }
    }

}

This is a repository for a project that utilizes the p5.js boid simulation code found:

https://p5js.org/examples/simulate-flocking.html

The live site is:

https://shark-aquarium.herokuapp.com

Touch and hold the mouse or screen (if viewing the site on a mobile device) to control the shark.
When the shark collides with the fish, the fish disappear (as if eaten).

Boids are the name given to autonomous agents that simulate the flocking behavior found in the natural world, such as in schools of fish and flocks of pigeons. Boids operate individually, but demonstrate the same principles of cohesion, separation, and direction throughout the flock.

If you wish to contribute to this project feel free to fork this project and begin working on boid.js found in the public/js folder.

To-Do's:
    Optimize the shark's behavior. As of now the shark is part of its own flock, which is unnecessary.
    Remove fish objects from flock on being eaten. As of now they simply become transparent.
    Add obstacles and enemies to the 'aquarium'.
    Add more fish to the flock when the player has eaten them all.

    Determine why the fish line-up diagonally across the screen when the player controls the shark...

    The original code from https://p5js.org/examples/simulate-flocking.html can be found in the boids.js file in the main folder of this repo.

    The 'boi.js' file (also in the main folder) is an attempt at re-writing the boids.js file without the p5.js methods, in order to port it to other html graphics api's such as Canvas or Phaser3.

If you are interested in the project, please feel free to email me at jamie.mccrory@students.makeschool.com

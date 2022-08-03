/*
** Reaction Diffusion
* Cristian Rojas Cardenas, April 2022
* Algorithm based on the tutorial by Karl Sims (https://www.karlsims.com/rd.html), and 
* the video tutorial by Daniel Shiffman (https://www.youtube.com/watch?v=BV9ny785UNc).
* 
* The algorithm operates on a 2D grid, which stores values for two different chemicals. 
* The grid is initialized filled with one of the chemicals, and a square of 20x20 of the 
* second chemical in the center. The interaction between the chemicals is driven by the following
* equations:
* 
*   -	A’ = A + Da*(▽^2)*A – A*B^2 + f*(1 - A)
*   -	B’ = B + Db*(▽^2)*B – (k + f)*B
* 
* Where Da and Db are the diffusion rates for each chemical, (▽^2)*A and (▽^2)*B are
* 2D Laplacian functions that return the difference between the average content of each
* chemical in all neighbouring cells and the content of the same chemical in the cell
* being evaluated, and 'f' and 'k' are the feed and kill rates for the chemicals.
* The grid is computed and updated at every time step. 
* 
*/

let play = true;
let dA = 1.5;   //Diffusion rate A
let dB = 0.1;   //Diffusion rate B
var f = 0.055;  //Feed
var k = 0.062;  //Kill



// Settings, values used in the algorithm execution
let settings = {
    Play: function () { play = true; },
    Pause: function () { play = false; },
    Reset: function () { init() },
};

function gui() {
    // Adding the GUI menu
    var gui = new dat.GUI();
    gui.width = 150;
    gui.add(settings, 'Play');
    gui.add(settings, 'Pause');
    gui.add(settings, 'Reset');
};

// At clicking the grid the state of the cell selected is changed
function mouseDragged() {
    grid[floor(mouseX)][floor(mouseY)].b = 1;
}


function init() {
    central_point = [floor(width / 2), floor(height / 2)]

    grid = [];
    next = [];

    // Initialize the grid
    for (let i = 0; i < width; i++) {
        grid[i] = [];
        next[i] = []
        for (let j = 0; j < height; j++) {
            // Initial State starts with null quantities of a and b 
            if (i > central_point[0] - 10 & i < central_point[0] + 10
                & j > central_point[1] - 10 & j < central_point[1] + 10) {
                grid[i][j] = { a: 1, b: 1 };
            } else {
                grid[i][j] = { a: 1, b: 0 };
            }
            next[i][j] = { a: 1, b: 0 };
        }
    }
}


function setup() {
    gui();
    createCanvas(400, 400);
    pixelDensity(1);
    background(255);
    init();
}




function draw() {

    if (play) {
        // Update the current values using the diffusion formulas
        // Look at the theory in http://karlsims.com/rd.html
        for (let i = 1; i < width - 1; i++) {
            for (let j = 1; j < height - 1; j++) {
                var a = grid[i][j].a
                var b = grid[i][j].b


                next[i][j].a = a + dA * laplaceA(i, j) - a * b * b + f * (1 - a);
                next[i][j].b = b + dB * laplaceB(i, j) + a * b * b - (k + f) * b;


                next[i][j].a = constrain(next[i][j].a, 0, 1);
                next[i][j].b = constrain(next[i][j].b, 0, 1);
            }
        }

        // Render the the next state
        loadPixels();
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                var pix = (i + j * width) * 4;
                c = floor((next[i][j].a - next[i][j].b) * 255);
                c = constrain(c, 0, 255);
                pixels[pix + 0] = c;
                pixels[pix + 1] = c;
                pixels[pix + 2] = c;
                pixels[pix + 3] = 255;
            }
        }
        updatePixels();

        grid = next;
    }

}

// TODO #1 chemical is never used @crarojasca
function laplaceA(x, y, chemical) {
    var sumA = 0;
    sumA += grid[x][y].a * -1;
    sumA += grid[x - 1][y].a * 0.2;
    sumA += grid[x + 1][y].a * 0.2;
    sumA += grid[x][y + 1].a * 0.2;
    sumA += grid[x][y - 1].a * 0.2;
    sumA += grid[x - 1][y - 1].a * 0.05;
    sumA += grid[x + 1][y - 1].a * 0.05;
    sumA += grid[x + 1][y + 1].a * 0.05;
    sumA += grid[x - 1][y + 1].a * 0.05;
    return sumA;
}

function laplaceB(x, y) {
    var sumB = 0;
    sumB += grid[x][y].b * -1;
    sumB += grid[x - 1][y].b * 0.2;
    sumB += grid[x + 1][y].b * 0.2;
    sumB += grid[x][y + 1].b * 0.2;
    sumB += grid[x][y - 1].b * 0.2;
    sumB += grid[x - 1][y - 1].b * 0.05;
    sumB += grid[x + 1][y - 1].b * 0.05;
    sumB += grid[x + 1][y + 1].b * 0.05;
    sumB += grid[x - 1][y + 1].b * 0.05;
    return sumB;
}

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

// Initialize the score variable
var score = 0;

var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

var apple = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
    requestAnimationFrame(loop);

    // Slow game loop to 10 fps instead of 15 (60/10 = 6)
    if (++count < 20) { // Change this value to adjust speed
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    // Wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    // Wrap snake position vertically on edge of screen
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Keep track of where snake has been. Front of the array is always the head
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Draw snake one cell at a time
    context.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Snake ate apple
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;

            // Increase the score
            score += 1; // Increment score by 1 point

            // Canvas is 400x400 which is 25x25 grids
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        // Check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < snake.cells.length; i++) {
            // Snake occupies the same space as a body part. Reset game
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame(); // Call reset game function
            }
        }
    });

    // Draw the score
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, 10, 20); // Display score at the top-left corner
}

// Function to reset the game
function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    // Reset score
    score = 0; // Reset score on collision

    // Reset apple position
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;

    // Update score display
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas to redraw
    context.fillText('Score: ' + score, 10, 20); // Reset score display
}

// Listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
    // Prevent snake from backtracking on itself
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// Start the game loop
requestAnimationFrame(loop);

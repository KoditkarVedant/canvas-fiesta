function Canvas(width, height) {
    this.height = height;
    this.width = width;

    this.update = function (width, height) {
        this.height = height;
        this.width = width;
        const canvasElement = document.querySelector("canvas");
        canvasElement.width = this.width;
        canvasElement.height = this.height;
        canvasElement.style.backgroundColor = "red";
    };

    this.getContext = function () {
        const canvasElement = document.querySelector("canvas");
        return canvasElement.getContext("2d");
    };

    this.update(this.width, this.height);
}

function Food(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.eaten = false;

    this.draw = function (context) {
        if (this.eaten) {
            return;
        }

        context.beginPath();
        context.rect(this.x, this.y, this.w, this.h);
        context.fillStyle = "green";
        context.fill();
        context.closePath();
    };

    this.ate = function () {
        this.eaten = true;
    };
}

function Game(canvas) {
    this.initialize = function (canvas) {
        this.snake = new Snake();
        this.direction = Direction.EAST;
        this.canvas = canvas;
        this.food = FoodHelper.createAFood(this.canvas, this.snake);
    };

    this.initialize(canvas);

    this.updateDirection = function (direction) {
        if (direction) {
            if (
                direction.x + this.direction.x != 0 ||
                direction.y + this.direction.y != 0
            ) {
                this.direction = direction;
            }
        }
    };

    this.update = function () {
        if (this.snake.isDead()) {
            this.restart();
        }

        if (this.food.eaten) {
            this.food = FoodHelper.createAFood(this.canvas, this.snake);
        }

        this.snake.update(this.direction, this.canvas, this.food);
    };

    this.draw = function () {
        const context = this.canvas.getContext();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.food.draw(context);
        this.snake.draw(context);
    };

    this.restart = function () {
        this.initialize(this.canvas);
    };
}

const canvas = new Canvas(
    DEFAULT_BODY_PART_WIDTH * 100,
    DEFAULT_BODY_PART_HEIGHT * 90
);

const game = new Game(canvas);

const animate = (x) => (y) => {
    if (y - x > 100) {
        window.requestAnimationFrame(animate(y));
        game.update();
        game.draw();
    } else {
        window.requestAnimationFrame(animate(x));
    }
};

window.requestAnimationFrame(animate(0));

window.addEventListener("keydown", function (event) {
    event.preventDefault();

    switch (event.key.toLowerCase()) {
        case "arrowup":
        case "w":
            game.updateDirection(Direction.NORTH);
            break;
        case "arrowdown":
        case "s":
            game.updateDirection(Direction.SOUTH);
            break;
        case "arrowright":
        case "d":
            game.updateDirection(Direction.EAST);
            break;
        case "arrowleft":
        case "a":
            game.updateDirection(Direction.WEST);
            break;
    }
});

const colorPicker = {
    colors: [
        '#c5d7bd',
        '#9fb8ad',
        '#383e56',
        '#fb743e'
    ],
    getRandomColor: function () {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}

function Circle(x, y, radius, dx, dy, fillColor) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.originalRadius = radius;
    this.maxScale = 4;
    this.fillColor = fillColor;

    this.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.fillColor;
        context.fill();
        context.closePath();
    }

    this.update = function (canvas, mouse) {

        if (this.x <= this.radius) {
            this.dx = Math.abs(this.dx);
        } else if (this.x >= canvas.width - this.radius) {
            this.dx = Math.abs(this.dx) * -1;
        }

        if (this.y <= this.radius) {
            this.dy = Math.abs(this.dy);
        } else if (this.y >= canvas.height - this.radius) {
            this.dy = Math.abs(this.dy) * -1;
        }

        if (
            (mouse.x - 50 <= this.x && this.x <= mouse.x + 50) &&
            (mouse.y - 50 <= this.y && this.y <= mouse.y + 50)
        ) {
            if (this.radius < this.originalRadius * this.maxScale) {
                this.radius = this.radius + 1;
            }
        } else {
            if (this.radius > this.originalRadius) {
                this.radius = this.radius - 1;
            } else {
                this.radius = this.originalRadius;
            }
        }

        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }
}

function Canvas(canvasElement, width, height) {
    this.width = width;
    this.height = height;
    this.canvas = canvasElement;
    this.context = undefined;

    this.init = function () {
        this.canvas.height = this.height || 100;
        this.canvas.width = this.width || 100;
    }

    this.get2dContext = function () {
        if (!this.context) {
            this.context = this.canvas.getContext("2d");
        }

        return this.context;
    }

    this.init();
}

function Bubbles() {
    this.canvas = undefined;
    this.circles = [];

    this.init = function (canvas) {
        this.canvas = canvas
        const context = this.canvas.get2dContext();

        this.circles = [];
        for (let i = 0; i < 500; i++) {
            const radius = Math.random() * 5 + 1;
            const x = Math.random() * (this.canvas.width - radius * 2) + radius;
            const y = Math.random() * (this.canvas.height - radius * 2) + radius;
            const dx = (Math.random() - 0.5) * 3;
            const dy = (Math.random() - 0.5) * 3;
            const color = colorPicker.getRandomColor();
            const circle = new Circle(x, y, radius, dx, dy, color);
            this.circles.push(circle);
            circle.draw(context);
        }
    };

    this.update = function (mouse) {
        const context = this.canvas.get2dContext();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const circle of this.circles) {
            circle.update(this.canvas, mouse);
            circle.draw(context);
        }
    }
};

function MouseTracker() {
    this.x = undefined;
    this.y = undefined;

    this.setMousePosition = function (x, y) {
        this.x = x;
        this.y = y;
    }

    this.mouseOut = function () {
        this.x = undefined;
        this.y = undefined;
    }
}

window.bubbles = new Bubbles();
window.mouse = new MouseTracker();

window.addEventListener('resize', function () {
    const canvas = new Canvas(document.querySelector('canvas'), window.innerWidth, window.innerHeight);
    window.bubbles.init(canvas);
});

window.addEventListener('mousemove', function (event) {
    window.mouse.setMousePosition(event.x, event.y);
});

window.addEventListener('mouseout', function () {
    window.mouse.mouseOut();
});

function animate() {
    requestAnimationFrame(animate);
    window.bubbles.update(window.mouse);
}

const canvas = new Canvas(document.querySelector('canvas'), window.innerWidth, window.innerHeight);
window.bubbles.init(canvas);
animate();
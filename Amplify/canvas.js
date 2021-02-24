const colorPicker = {
    colors: [
        '#c5d7bd',
        '#9fb8ad',
        '#383e56',
        '#fb743e',
        'turquoise',
        'pink',
        'orange',
        'violet',
        'skyblue'
    ],
    getRandomColor: function () {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}

function Canvas() {
    this.canvas = undefined;
    this.context = undefined;

    this.width = undefined;
    this.height = undefined;

    this.init = function (canvasElement, widht, height) {
        this.canvas = canvasElement;
        this.dimentions(widht, height);
    }

    this.dimentions = function (width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    this.get2dContext = function () {
        if (!this.context) {
            this.context = this.canvas.getContext("2d");
        }

        return this.context;
    }
}

function Rectangle(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.originalY = y;
    this.originalHeight = height;
    this.fillColor = colorPicker.getRandomColor();
    this.height = height;
    this.width = width;

    this.draw = function (canvas, context) {
        context.beginPath();
        context.fillStyle = this.fillColor;
        context.rect(this.x, canvas.height - this.height, this.width, this.height);
        context.fill();
    }

    this.update = function (canvas, mouse) {
        if (this.x <= mouse.x && mouse.x <= this.x + this.width) {
            if (this.y > 0) {
                this.y -= this.speed;
                this.height += this.speed;
            }
        } else {
            if (this.y < this.originalY) {
                this.y += this.speed;
            } else {
                this.y = this.originalY;
            }
        }
        this.speed += 0.01;
        this.height -= (this.height - Math.abs(Math.sin(this.speed) * canvas.height / 2.5)) * 0.12;
    }
}

function Amplify() {
    this.canvas = undefined;
    this.mouse = undefined;
    this.bars = [];

    this.init = function (canvas, mouse) {
        this.canvas = canvas;
        this.mouse = mouse;
        this.bars = [];

        const context = this.canvas.get2dContext();

        const totalRectangles = 15;
        const widthPerRectangle = this.canvas.width / totalRectangles;
        let speed = 0;
        for (let i = 0; i < totalRectangles; i++) {
            const x = widthPerRectangle * i;
            const y = this.canvas.height;;
            const width = widthPerRectangle;
            const height = 0;
            const bar = new Rectangle(x, y, width, height, speed);
            this.bars.push(bar);
            //bar.draw(context);
            speed += 0.01;
        }
    }

    this.update = function () {
        const context = this.canvas.get2dContext();
        //context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = 'rgba(0,0,0,0.1)';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        console.log(this.bars);
        for (const bar of this.bars) {
            bar.update(this.canvas, this.mouse);
            bar.draw(this.canvas, context);
        }
    }
}

function Mouse() {
    this.x = undefined;
    this.y = undefined;

    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    }

    this.mouseOut = function () {
        this.x = undefined;
        this.y = undefined;
    }
}

const canvas = new Canvas();
canvas.init(document.querySelector('canvas'), window.innerWidth, window.innerHeight);

const mouse = new Mouse();

window.amplify = new Amplify();
window.amplify.init(canvas, mouse);

function animate() {
    requestAnimationFrame(animate);
    window.amplify.update();
}

window.addEventListener('resize', function () {
    canvas.init(document.querySelector('canvas'), window.innerWidth, window.innerHeight);
    window.amplify.init(canvas, mouse);
});

window.addEventListener('mousemove', function (event) {
    mouse.setPosition(event.x, event.y);
})

window.addEventListener('mouseout', function () {
    mouse.mouseOut();
})

animate();
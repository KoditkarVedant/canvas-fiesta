const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient1.addColorStop(0.1, 'blue');
gradient1.addColorStop(0.2, 'pink');
gradient1.addColorStop(0.3, 'red');
gradient1.addColorStop(0.4, 'orange');
gradient1.addColorStop(0.5, 'yellow');
gradient1.addColorStop(0.6, 'green');
gradient1.addColorStop(0.7, 'turquoise');
gradient1.addColorStop(0.8, 'violet');

const inputText = "Vedant";

let particleArray = [];

const mouse = {
    x: undefined,
    y: undefined,
    radius: 150,
};

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("mouseout", function () {
    mouse.x = undefined;
    mouse.y = undefined;
    console.log("mouseout", mouse);
});

ctx.fillStyle = "white";
ctx.font = "italic 30px Segoe Script";
ctx.fillText(inputText, 0, 32);
const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = 3;
        this.speed = 3;
        this.density = Math.random() * 40 + 5;
    }

    draw() {
        ctx.fillStyle = gradient1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }

            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

class TextPixel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function getPixelData() {
    const pixels = [];
    let minX = window.innerWidth;
    let maxX = -1;

    let minY = window.innerHeight;
    let maxY = -1;
    for (let y = 0; y < textCoordinates.height; y++) {
        for (let x = 0; x < textCoordinates.width; x++) {
            if (
                textCoordinates.data[
                    y * 4 * textCoordinates.width + x * 4 + 3
                ] > 128
            ) {
                const positionX = x * 15;
                const positionY = y * 15;

                if (positionX < minX) {
                    minX = positionX;
                }
                if (positionX > maxX) {
                    maxX = positionX;
                }

                if (positionY < minY) {
                    minY = positionY;
                }
                if (positionY > maxY) {
                    maxY = positionY;
                }

                pixels.push(new TextPixel(positionX, positionY));
            }
        }
    }

    return {
        pixels,
        minX,
        minY,
        maxX,
        maxY,
    };
}

function init() {
    particleArray = [];

    const pixelData = getPixelData();

    const addX =
        (canvas.width - (pixelData.maxX - pixelData.minX)) / 2 - pixelData.minX;
    const addY =
        (canvas.height - (pixelData.maxY - pixelData.minY)) / 2 -
        pixelData.minY;

    for (let p = 0; p < pixelData.pixels.length; p++) {
        const positionX = pixelData.pixels[p].x + addX;
        const positionY = pixelData.pixels[p].y + addY;
        particleArray.push(new Particle(positionX, positionY));
    }

    connect();
}

init();

function connect() {
    for (let x = 0; x < particleArray.length; x++) {
        const particalA = particleArray[x];
        for (let y = x + 1; y < particleArray.length; y++) {
            const particalB = particleArray[y];

            let dx = particalA.x - particalB.x;
            let dy = particalA.y - particalB.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
                ctx.strokeStyle = gradient1;
                ctx.beginPath();
                ctx.moveTo(particalA.x, particalA.y);
                ctx.lineTo(particalB.x, particalB.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

animate();
